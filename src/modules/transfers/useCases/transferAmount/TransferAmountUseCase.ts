import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../../statements/repositories/IStatementsRepository";
import { TransferAmountError } from "./TransferAmountError";
import { ITransfersRepository } from "../../repositories/ITransfersRepository";
import { Transfer } from "../../entities/Transfer";

interface ITransferAmountDTO {
  recipient_id: string;
  sender_id: string;
  amount: number;
  description: string;
}

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

@injectable()
class TransferAmountUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,
    @inject("TransfersRespository")
    private transfersRepository: ITransfersRepository
  ) { }

  async execute({ recipient_id, sender_id, amount, description }: ITransferAmountDTO): Promise<Transfer> {
    const senderUser = await this.usersRepository.findById(sender_id);

    if (!senderUser) {
      throw new TransferAmountError.UserNotFound()
    }

    const senderUserBalance = await this.statementsRepository.getUserBalance({
      user_id: sender_id
    })

    if (senderUserBalance.balance < amount) {
      throw new TransferAmountError.InsufficientFunds()
    }

    const recipientUser = await this.usersRepository.findById(recipient_id)

    if (!recipientUser) {
      throw new TransferAmountError.RecipientNotFound()
    }

    const senderTransferStatement = await this.statementsRepository.create({
      user_id: sender_id,
      amount,
      description,
      type: OperationType.WITHDRAW
    })

    const recipientTransferStatement = await this.statementsRepository.create({
      user_id: recipient_id,
      amount,
      description,
      type: OperationType.DEPOSIT
    });

    const statement_id = recipientTransferStatement.id

    const transfer = await this.transfersRepository.create(
      sender_id,
      statement_id,
      amount,
      description
    )

    return transfer
  }



}

export { TransferAmountUseCase }
