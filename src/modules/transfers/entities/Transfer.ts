import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { Statement } from "../../statements/entities/Statement";

@Entity("transfers")
class Transfer {
  @PrimaryColumn()
  id: string;

  @OneToOne(() => Statement)
  @JoinColumn({name: "statement_id"})
  statement_id: string;

  @Column()
  sender_id: string;

  @Column()
  amount: number;

  @Column()
  description: number;

  @Column()
  type: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date

  constructor() {
    if (!this.id) {
      this.id = uuid()
    }
  }
}

export { Transfer }
