import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export default class AddIsNullToImageFieldInCarsImages1633878526971 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('cars_images', 'image');

    await queryRunner.addColumn(
      'cars_images',
      new TableColumn({
        name: 'image',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('cars_images', 'image');

    await queryRunner.addColumn(
      'cars_images',
      new TableColumn({
        name: 'image',
        type: 'varchar',
      }),
    );
  }
}
