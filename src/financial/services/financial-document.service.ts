import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Property } from '../../property/entities/property.entity.js';
import { CreateFinancialDocumentDto } from '../dto/create-financial-document.dto.js';
import { UpdateFinancialDocumentDto } from '../dto/update-financial-document.dto.js';
import { Concept } from '../entities/concept.entity.js';
import { DocumentApplication } from '../entities/document-application.entity.js';
import {
  FinancialDocument,
  FinancialDocumentStatus,
  FinancialDocumentType,
} from '../entities/financial-document.entity.js';

const itemizedTypes = new Set([
  FinancialDocumentType.F,
  FinancialDocumentType.ND,
]);

@Injectable()
export class FinancialDocumentService {
  constructor(
    @InjectRepository(FinancialDocument)
    private readonly documents: Repository<FinancialDocument>,
    @InjectRepository(Property)
    private readonly properties: Repository<Property>,
    @InjectRepository(Concept)
    private readonly concepts: Repository<Concept>,
  ) {}

  async create(dto: CreateFinancialDocumentDto) {
    this.validateItems(dto.documentType, dto.items);
    const property = await this.findProperty(dto.propertyId, dto.phId);
    const items = await this.resolveItems(dto.items ?? [], dto.phId);

    return this.documents.save(
      this.documents.create({
        documentType: dto.documentType,
        documentNumber: dto.documentNumber,
        issueDate: dto.issueDate,
        totalAmount: dto.totalAmount,
        status: dto.status ?? FinancialDocumentStatus.ACTIVE,
        complex: { id: dto.phId },
        property,
        items,
      }),
    );
  }

  findAll() {
    return this.documents.find({
      relations: { property: true, items: { concept: true } },
    });
  }

  async findOne(id: string) {
    const document = await this.documents.findOne({
      where: { id },
      relations: {
        complex: true,
        property: true,
        items: { concept: true },
      },
    });
    if (!document) {
      throw new NotFoundException(`Financial document ${id} not found`);
    }
    return document;
  }

  async update(id: string, dto: UpdateFinancialDocumentDto) {
    const document = await this.documents.findOne({
      where: { id },
      relations: { items: { concept: true } },
    });
    if (!document) {
      throw new NotFoundException(`Financial document ${id} not found`);
    }

    const type = dto.documentType ?? document.documentType;
    const itemsWereProvided = dto.items !== undefined;
    const items = itemsWereProvided
      ? dto.items!
      : document.items.map((item) => ({
          conceptId: item.conceptId,
          description: item.description,
          amount: item.amount,
        }));
    this.validateItems(type, itemsWereProvided ? dto.items : items);

    const phId = dto.phId ?? document.phId;
    const property =
      dto.propertyId !== undefined || dto.phId !== undefined
        ? await this.findProperty(dto.propertyId ?? document.propertyId, phId)
        : undefined;
    const resolvedItems = itemsWereProvided
      ? await this.resolveItems(dto.items!, phId)
      : undefined;

    const changesAppliedDocument =
      dto.phId !== undefined ||
      dto.propertyId !== undefined ||
      dto.documentType !== undefined ||
      dto.totalAmount !== undefined ||
      dto.status !== undefined;
    if (changesAppliedDocument) {
      const applicationCount = await this.documents.manager
        .getRepository(DocumentApplication)
        .count({
          where: [
            { debtDocument: { id } },
            { creditDocument: { id } },
          ],
        });
      if (applicationCount > 0) {
        throw new BadRequestException(
          'Cannot change the complex, property, type, amount, or status of a document with applications',
        );
      }
    }

    this.documents.merge(document, {
      ...(dto.phId === undefined ? {} : { complex: { id: dto.phId } }),
      ...(property === undefined ? {} : { property }),
      ...(dto.documentType === undefined
        ? {}
        : { documentType: dto.documentType }),
      ...(dto.documentNumber === undefined
        ? {}
        : { documentNumber: dto.documentNumber }),
      ...(dto.issueDate === undefined ? {} : { issueDate: dto.issueDate }),
      ...(dto.totalAmount === undefined
        ? {}
        : { totalAmount: dto.totalAmount }),
      ...(dto.status === undefined ? {} : { status: dto.status }),
      ...(resolvedItems === undefined ? {} : { items: resolvedItems }),
    });
    return this.documents.save(document);
  }

  async remove(id: string) {
    const applicationCount = await this.documents.manager
      .getRepository(DocumentApplication)
      .count({
        where: [{ debtDocument: { id } }, { creditDocument: { id } }],
      });
    if (applicationCount > 0) {
      throw new BadRequestException(
        'Cannot delete a financial document that has applications',
      );
    }
    const result = await this.documents.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Financial document ${id} not found`);
    }
    return result;
  }

  private validateItems(
    type: FinancialDocumentType,
    items: CreateFinancialDocumentDto['items'],
  ) {
    if (items?.length && !itemizedTypes.has(type)) {
      throw new BadRequestException(
        'Only F and ND documents can contain document items',
      );
    }
  }

  private async findProperty(propertyId: string, phId: string) {
    const property = await this.properties.findOne({
      where: { id: propertyId, complex: { id: phId } },
    });
    if (!property) {
      throw new NotFoundException(
        `Property ${propertyId} not found in complex ${phId}`,
      );
    }
    return property;
  }

  private async resolveItems(
    items: NonNullable<CreateFinancialDocumentDto['items']>,
    phId: string,
  ) {
    if (items.length === 0) {
      return [];
    }
    const ids = [...new Set(items.map((item) => item.conceptId))];
    const concepts = await this.concepts.find({
      where: { id: In(ids) },
      relations: { complex: true },
    });
    if (
      concepts.length !== ids.length ||
      concepts.some((concept) => concept.phId && concept.phId !== phId)
    ) {
      throw new BadRequestException(
        'Every item must reference an existing global concept or one from the same complex',
      );
    }
    const conceptsById = new Map(concepts.map((concept) => [concept.id, concept]));
    return items.map((item) => ({
      concept: conceptsById.get(item.conceptId)!,
      description: item.description,
      amount: item.amount,
    }));
  }
}
