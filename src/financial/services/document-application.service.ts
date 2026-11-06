import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateDocumentApplicationDto } from '../dto/create-document-application.dto.js';
import { DocumentApplication } from '../entities/document-application.entity.js';
import {
  FinancialDocument,
  FinancialDocumentStatus,
  FinancialDocumentType,
} from '../entities/financial-document.entity.js';

const debtTypes = new Set([
  FinancialDocumentType.F,
  FinancialDocumentType.ND,
]);
const creditTypes = new Set([
  FinancialDocumentType.RC,
  FinancialDocumentType.NC,
]);

function toCents(amount: number): number {
  return Math.round(amount * 100);
}

@Injectable()
export class DocumentApplicationService {
  constructor(
    @InjectRepository(DocumentApplication)
    private readonly applications: Repository<DocumentApplication>,
    private readonly dataSource: DataSource,
  ) {}

  create(dto: CreateDocumentApplicationDto) {
    return this.dataSource.transaction(async (manager) => {
      const documents = manager.getRepository(FinancialDocument);
      const applications = manager.getRepository(DocumentApplication);
      const debt = await documents.findOne({
        where: { id: dto.debtDocumentId },
        lock: { mode: 'pessimistic_write' },
      });
      const credit = await documents.findOne({
        where: { id: dto.creditDocumentId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!debt) {
        throw new NotFoundException(
          `Debt document ${dto.debtDocumentId} not found`,
        );
      }
      if (!credit) {
        throw new NotFoundException(
          `Credit document ${dto.creditDocumentId} not found`,
        );
      }
      if (!debtTypes.has(debt.documentType)) {
        throw new BadRequestException(
          'Debt document must have type F or ND',
        );
      }
      if (!creditTypes.has(credit.documentType)) {
        throw new BadRequestException(
          'Credit document must have type RC or NC',
        );
      }
      if (
        debt.phId !== dto.phId ||
        credit.phId !== dto.phId ||
        debt.propertyId !== credit.propertyId
      ) {
        throw new BadRequestException(
          'Debt and credit documents must belong to the same complex and property specified',
        );
      }
      if (
        debt.status !== FinancialDocumentStatus.ACTIVE ||
        credit.status !== FinancialDocumentStatus.ACTIVE
      ) {
        throw new BadRequestException(
          'Cannot apply an annulled financial document',
        );
      }

      const usedByCredit = await applications
        .createQueryBuilder('application')
        .select('COALESCE(SUM(application.applied_amount), 0)', 'total')
        .where('application.credit_document_id = :id', { id: credit.id })
        .getRawOne<{ total: string }>();
      const usedByDebt = await applications
        .createQueryBuilder('application')
        .select('COALESCE(SUM(application.applied_amount), 0)', 'total')
        .where('application.debt_document_id = :id', { id: debt.id })
        .getRawOne<{ total: string }>();
      const creditAvailable =
        toCents(credit.totalAmount) - toCents(Number(usedByCredit?.total ?? 0));
      const debtAvailable =
        toCents(debt.totalAmount) - toCents(Number(usedByDebt?.total ?? 0));
      const applied = toCents(dto.appliedAmount);
      if (applied > creditAvailable || applied > debtAvailable) {
        throw new BadRequestException(
          'Applied amount exceeds the available credit or outstanding debt',
        );
      }

      return applications.save(
        applications.create({
          complex: { id: dto.phId },
          debtDocument: { id: debt.id },
          creditDocument: { id: credit.id },
          appliedAmount: dto.appliedAmount,
        }),
      );
    });
  }

  findAll() {
    return this.applications.find({
      relations: { debtDocument: true, creditDocument: true },
    });
  }

  async findOne(id: string) {
    const application = await this.applications.findOne({
      where: { id },
      relations: { debtDocument: true, creditDocument: true },
    });
    if (!application) {
      throw new NotFoundException(`Document application ${id} not found`);
    }
    return application;
  }

  async remove(id: string) {
    const result = await this.applications.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Document application ${id} not found`);
    }
    return result;
  }
}
