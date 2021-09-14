import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateCars1631588013095 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'cars',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'manufacturer',
              type: 'varchar',
            },
            {
              name: 'brand',
              type: 'varchar',
            },
            {
              name: 'model',
              type: 'varchar',
            },
            {
              name: 'year_manufacture',
              type: 'varchar',
            },
            {
              name: 'fuel',
              type: 'varchar',
            },
            {
              name: 'gearbox_type',
              type: 'varchar',
            },
            {
              name: 'km',
              type: 'int',
            },
            {
              name: 'color',
              type: 'varchar',
            },
            {
              name: 'vehicle_item_id',
              type: 'uuid',
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
              name: 'VehicleItemId',
              referencedTableName: 'vehicle_items',
              referencedColumnNames: ['id'],
              columnNames: ['vehicle_item_id'],
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
            },
          ],
        }),
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('cars');
    }

}
