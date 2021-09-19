import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateCarAttachments1631588908685 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'car_attachments',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'attachment',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'type',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'title',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'car_id',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'created_at',
              type: 'timestamp with time zone',
              default: 'now()',
            },
            {
              name: 'updated_at',
              type: 'timestamp with time zone',
              default: 'now()',
            },
          ],
          foreignKeys: [
            {
              name: 'CarId',
              referencedTableName: 'cars',
              referencedColumnNames: ['id'],
              columnNames: ['car_id'],
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
            },
          ],
        }),
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('car_attachments')
    }

}
