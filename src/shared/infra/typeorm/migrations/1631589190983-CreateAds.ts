import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateAds1631589190983 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'ads',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'ad_code',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'title',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'description',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'price',
              type: 'int',
              isNullable: true,
            },
            {
              name: 'views',
              type: 'int',
              isNullable: true,
            },
            {
              name: 'interests',
              type: 'int',
              isNullable: true,
            },
            {
              name: 'user_id',
              type: 'uuid',
            },
            {
              name: 'car_id',
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
              name: 'CarId',
              referencedTableName: 'cars',
              referencedColumnNames: ['id'],
              columnNames: ['car_id'],
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
            },
            {
              name: 'UserId',
              referencedTableName: 'users',
              referencedColumnNames: ['id'],
              columnNames: ['user_id'],
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
            },
          ],
        }),
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('ads')
    }

}
