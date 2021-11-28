import {MigrationInterface, TableColumn, QueryRunner} from "typeorm";

export class CreatePauseAdColumn1638125641802 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn(
        'ads',
        new TableColumn({
          name: 'paused',
          type: 'boolean',
          isNullable: true,
        }),
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
