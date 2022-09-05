import { Transfer } from "../entities/Transfer";


interface ITransfersRepository {
  create(sender_id: string, statement_id: string, amount: number, description: string): Promise<Transfer>;
}

export { ITransfersRepository }
