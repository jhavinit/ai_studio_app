import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity("generations")
export class Generation {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.generations, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column()
  image_url!: string;

  @Column()
  prompt!: string;

  @Column()
  style!: string;

  @Column()
  status!: string;

  @CreateDateColumn({ type: "timestamptz" })
  created_at!: Date;
}
