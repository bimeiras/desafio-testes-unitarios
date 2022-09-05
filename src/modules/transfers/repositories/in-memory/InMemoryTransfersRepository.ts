import { Transfer } from "../../entities/Transfer";
import { ITransfersRepository } from "../ITransfersRepository";

class InMemoryTransfersRepository implements ITransfersRepository {
  private transfers: Transfer[] = []

  async create(sender_id: string, statement_id: string, amount: number, description: string): Promise<Transfer> {
    const transfer = new Transfer()

    Object.assign(transfer, {
      statement_id,
      sender_id,
      amount,
      description,
      type: "transfer",
      created_at: new Date(),
      updated_at: new Date()
    })

    this.transfers.push(transfer);

    return transfer
  }

}

export { InMemoryTransfersRepository }
