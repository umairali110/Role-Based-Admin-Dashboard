import { Entity,Column,PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  salary!: number;

  @Column()
  department!: string;

  @Column()
  created_by!: number;
}