import {MigrationInterface, TableColumn, QueryRunner} from "typeorm";

export class addDoorsQuantityField1635465876834 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'cars',
      new TableColumn({
        name: 'doors',
        type: 'int',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('cars', 'doors');
  }
}
