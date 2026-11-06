import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1793904563082 implements MigrationInterface {
    name = 'Init1793904563082'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."owner_person_document_type_enum" AS ENUM('CC', 'NIT', 'CE', 'PASSPORT')`);
        await queryRunner.query(`CREATE TABLE "owner_person" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "document_type" "public"."owner_person_document_type_enum" NOT NULL, "document_number" character varying(50) NOT NULL, "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "phone" character varying(20), "email" character varying(255), "ph_id" uuid NOT NULL, CONSTRAINT "PK_d991a8986c7d885b74fc06c6ed9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "document_application" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "applied_amount" numeric(12,2) NOT NULL, "ph_id" uuid NOT NULL, "debt_document_id" uuid NOT NULL, "credit_document_id" uuid NOT NULL, CONSTRAINT "PK_c7bd3c520975f36a0cfe9d37db4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "concept" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" character varying(255), "ph_id" uuid, CONSTRAINT "PK_83c1330866b9866ac2d0ed2b36b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "document_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying(255) NOT NULL, "amount" numeric(12,2) NOT NULL, "document_id" uuid NOT NULL, "concept_id" uuid NOT NULL, CONSTRAINT "PK_704041a979987ef1ee6e493b991" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."financial_document_document_type_enum" AS ENUM('F', 'ND', 'RC', 'NC')`);
        await queryRunner.query(`CREATE TYPE "public"."financial_document_status_enum" AS ENUM('ACTIVE', 'ANNULLED')`);
        await queryRunner.query(`CREATE TABLE "financial_document" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "document_type" "public"."financial_document_document_type_enum" NOT NULL, "document_number" character varying(100) NOT NULL, "issue_date" date NOT NULL, "total_amount" numeric(12,2) NOT NULL, "status" "public"."financial_document_status_enum" NOT NULL DEFAULT 'ACTIVE', "ph_id" uuid NOT NULL, "property_id" uuid NOT NULL, CONSTRAINT "PK_aa81ac787ddfb38803e64c12fd8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "property" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "area_m2" numeric NOT NULL, "coefficient" numeric NOT NULL, "ph_id" uuid NOT NULL, "block_id" uuid NOT NULL, CONSTRAINT "PK_d80743e6191258a5003d5843b4f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "block" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "total_floor" integer, "has_elevator" boolean NOT NULL DEFAULT false, "ph_id" uuid NOT NULL, CONSTRAINT "PK_d0925763efb591c2e2ffb267572" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "complex_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "late_fee_percentage" numeric NOT NULL, "grace_period" integer NOT NULL, "logo" text NOT NULL, "ph_id" uuid NOT NULL, CONSTRAINT "REL_96ce43bafe9ed1b1d241d2e920" UNIQUE ("ph_id"), CONSTRAINT "PK_b2625f6c858fe40fa33c0e53ccd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "complex" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "nit" character varying(20) NOT NULL, "address" character varying(200) NOT NULL, "city" character varying(100) NOT NULL, "whatsapp" character varying(20) NOT NULL, "phone" character varying(20) NOT NULL, "email" character varying(100) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0706ea9994e4e39197da5cb03d0" UNIQUE ("name"), CONSTRAINT "UQ_c625e3898027e3d6df36c221e42" UNIQUE ("nit"), CONSTRAINT "PK_9a906310d3cb35d50a9d5d03d46" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "app_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "is_actived" boolean NOT NULL DEFAULT true, "last_login" TIMESTAMP, "ph_id" uuid, CONSTRAINT "UQ_3fa909d0e37c531ebc237703391" UNIQUE ("email"), CONSTRAINT "PK_22a5c4a3d9b2fb8e4e73fc4ada1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "UQ_user_role_user_role" UNIQUE ("user_id", "role_id"), CONSTRAINT "PK_fb2e442d14add3cefbdf33c4561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" character varying(255) NOT NULL, "ph_id" uuid, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "property_owner" ("owner_id" uuid NOT NULL, "property_id" uuid NOT NULL, CONSTRAINT "PK_07f2788087c368334137284375a" PRIMARY KEY ("owner_id", "property_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_333bdbeee5a1f17a5f70fb24d6" ON "property_owner"  ("owner_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c0a0fe356fc308a185fbda2c3b" ON "property_owner"  ("property_id") `);
        await queryRunner.query(`ALTER TABLE "owner_person" ADD CONSTRAINT "FK_c88ecfa8de0a8034ecfaa465fc4" FOREIGN KEY ("ph_id") REFERENCES "complex"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document_application" ADD CONSTRAINT "FK_260bae82a90eca8e18ca53f1ac9" FOREIGN KEY ("ph_id") REFERENCES "complex"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document_application" ADD CONSTRAINT "FK_fd90f558b8d2ab5d9bcc827d6bd" FOREIGN KEY ("debt_document_id") REFERENCES "financial_document"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document_application" ADD CONSTRAINT "FK_18898bcb69e8a1491b181b78abc" FOREIGN KEY ("credit_document_id") REFERENCES "financial_document"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "concept" ADD CONSTRAINT "FK_9fadaae556040b24e559590d727" FOREIGN KEY ("ph_id") REFERENCES "complex"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document_item" ADD CONSTRAINT "FK_e4adb85d5c78d5ca9ff334fb07b" FOREIGN KEY ("document_id") REFERENCES "financial_document"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document_item" ADD CONSTRAINT "FK_356d59396d4e5002af955fca194" FOREIGN KEY ("concept_id") REFERENCES "concept"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "financial_document" ADD CONSTRAINT "FK_b50f07b1fff951cf6a7c0a0a8e7" FOREIGN KEY ("ph_id") REFERENCES "complex"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "financial_document" ADD CONSTRAINT "FK_2d6b0260af46f6e91d7272e2dbd" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property" ADD CONSTRAINT "FK_58d4145810a2eaf02c804d3dea7" FOREIGN KEY ("ph_id") REFERENCES "complex"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property" ADD CONSTRAINT "FK_4b1c96ace26de98a5275fed8f00" FOREIGN KEY ("block_id") REFERENCES "block"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "block" ADD CONSTRAINT "FK_4e94666eb93e738a70b48b4f63a" FOREIGN KEY ("ph_id") REFERENCES "complex"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "complex_settings" ADD CONSTRAINT "FK_96ce43bafe9ed1b1d241d2e9206" FOREIGN KEY ("ph_id") REFERENCES "complex"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "app_user" ADD CONSTRAINT "FK_78c089bd9d8b80e2e73d58f52c9" FOREIGN KEY ("ph_id") REFERENCES "complex"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_d0e5815877f7395a198a4cb0a46" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_32a6fc2fcb019d8e3a8ace0f55f" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_365c31e501f026ea7ea5a17624a" FOREIGN KEY ("ph_id") REFERENCES "complex"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_owner" ADD CONSTRAINT "FK_333bdbeee5a1f17a5f70fb24d66" FOREIGN KEY ("owner_id") REFERENCES "owner_person"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "property_owner" ADD CONSTRAINT "FK_c0a0fe356fc308a185fbda2c3bd" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_owner" DROP CONSTRAINT "FK_c0a0fe356fc308a185fbda2c3bd"`);
        await queryRunner.query(`ALTER TABLE "property_owner" DROP CONSTRAINT "FK_333bdbeee5a1f17a5f70fb24d66"`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_365c31e501f026ea7ea5a17624a"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_32a6fc2fcb019d8e3a8ace0f55f"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_d0e5815877f7395a198a4cb0a46"`);
        await queryRunner.query(`ALTER TABLE "app_user" DROP CONSTRAINT "FK_78c089bd9d8b80e2e73d58f52c9"`);
        await queryRunner.query(`ALTER TABLE "complex_settings" DROP CONSTRAINT "FK_96ce43bafe9ed1b1d241d2e9206"`);
        await queryRunner.query(`ALTER TABLE "block" DROP CONSTRAINT "FK_4e94666eb93e738a70b48b4f63a"`);
        await queryRunner.query(`ALTER TABLE "property" DROP CONSTRAINT "FK_4b1c96ace26de98a5275fed8f00"`);
        await queryRunner.query(`ALTER TABLE "property" DROP CONSTRAINT "FK_58d4145810a2eaf02c804d3dea7"`);
        await queryRunner.query(`ALTER TABLE "financial_document" DROP CONSTRAINT "FK_2d6b0260af46f6e91d7272e2dbd"`);
        await queryRunner.query(`ALTER TABLE "financial_document" DROP CONSTRAINT "FK_b50f07b1fff951cf6a7c0a0a8e7"`);
        await queryRunner.query(`ALTER TABLE "document_item" DROP CONSTRAINT "FK_356d59396d4e5002af955fca194"`);
        await queryRunner.query(`ALTER TABLE "document_item" DROP CONSTRAINT "FK_e4adb85d5c78d5ca9ff334fb07b"`);
        await queryRunner.query(`ALTER TABLE "concept" DROP CONSTRAINT "FK_9fadaae556040b24e559590d727"`);
        await queryRunner.query(`ALTER TABLE "document_application" DROP CONSTRAINT "FK_18898bcb69e8a1491b181b78abc"`);
        await queryRunner.query(`ALTER TABLE "document_application" DROP CONSTRAINT "FK_fd90f558b8d2ab5d9bcc827d6bd"`);
        await queryRunner.query(`ALTER TABLE "document_application" DROP CONSTRAINT "FK_260bae82a90eca8e18ca53f1ac9"`);
        await queryRunner.query(`ALTER TABLE "owner_person" DROP CONSTRAINT "FK_c88ecfa8de0a8034ecfaa465fc4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c0a0fe356fc308a185fbda2c3b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_333bdbeee5a1f17a5f70fb24d6"`);
        await queryRunner.query(`DROP TABLE "property_owner"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "user_role"`);
        await queryRunner.query(`DROP TABLE "app_user"`);
        await queryRunner.query(`DROP TABLE "complex"`);
        await queryRunner.query(`DROP TABLE "complex_settings"`);
        await queryRunner.query(`DROP TABLE "block"`);
        await queryRunner.query(`DROP TABLE "property"`);
        await queryRunner.query(`DROP TABLE "financial_document"`);
        await queryRunner.query(`DROP TYPE "public"."financial_document_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."financial_document_document_type_enum"`);
        await queryRunner.query(`DROP TABLE "document_item"`);
        await queryRunner.query(`DROP TABLE "concept"`);
        await queryRunner.query(`DROP TABLE "document_application"`);
        await queryRunner.query(`DROP TABLE "owner_person"`);
        await queryRunner.query(`DROP TYPE "public"."owner_person_document_type_enum"`);
    }

}
