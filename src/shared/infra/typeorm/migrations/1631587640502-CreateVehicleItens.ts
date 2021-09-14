import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateVehicleItens1631587640502 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'vehicle_items',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'airbag',
              type: 'boolean',
            },
            {
              name: 'alarm',
              type: 'boolean',
            },
            {
              name: 'air_conditioning',
              type: 'boolean',
            },
            {
              name: 'eletric_lock',
              type: 'boolean',
            },
            {
              name: 'eletric_window',
              type: 'boolean',
            },
            {
              name: 'stereo',
              type: 'boolean',
            },
            {
              name: 'reverse_sensor',
              type: 'boolean',
            },
            {
              name: 'reverse_camera',
              type: 'boolean',
            },
            {
              name: 'armoured',
              type: 'boolean',
            },
            {
              name: 'hydraulic_steering',
              type: 'boolean',
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
        }),
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('vehicle_items');
    }

}
