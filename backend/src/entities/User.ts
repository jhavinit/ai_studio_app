import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Generation } from "./Generation";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @CreateDateColumn({ type: "timestamptz" })
  created_at!: Date;

  @OneToMany(() => Generation, (generation) => generation.user)
  generations!: Generation[];
}
