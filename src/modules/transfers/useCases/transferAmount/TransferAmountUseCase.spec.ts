import { InMemoryStatementsRepository } from "../../../statements/repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../../../statements/useCases/createStatement/CreateStatementUseCase"
import { GetBalanceUseCase } from "../../../statements/useCases/getBalance/GetBalanceUseCase"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryTransfersRepository } from "../../repositories/in-memory/InMemoryTransfersRepository"
import { TransferAmountError } from "./TransferAmountError"
import { TransferAmountUseCase } from "./TransferAmountUseCase"


let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryTransfersRepository: InMemoryTransfersRepository
let createStatementUseCase: CreateStatementUseCase
let transferAmountUseCase: TransferAmountUseCase
let getBalanceUseCase: GetBalanceUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Transfer Amount", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryTransfersRepository = new InMemoryTransfersRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    transferAmountUseCase = new TransferAmountUseCase(inMemoryUsersRepository, inMemoryStatementsRepository, inMemoryTransfersRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)

  })

  it("should be able to transfer amount between users", async() => {
    const senderUser = await inMemoryUsersRepository.create({
      name: "Elijah Johnston",
      email: "be@af.ug",
      password: "1234"
    });

    const recipientUser = await inMemoryUsersRepository.create({
      name: "Sally Morales",
      email: "cukob@rumlin.tw",
      password: "1234"
    });

    const senderUserCreatedStatement = await createStatementUseCase.execute({
      user_id: senderUser.id,
      type: OperationType.DEPOSIT,
      amount: 49.00,
      description: "iCIkqDIgTF"
    })

    const transfer = await transferAmountUseCase.execute({
      recipient_id: recipientUser.id,
      sender_id: senderUser.id,
      amount: senderUserCreatedStatement.amount,
      description: "uemyErZNcV"
    })

    expect(transfer).toHaveProperty("id")

  });

  it("should not be able to transfer amount if sender user does not exist", async() => {
    expect(async() => {
      const recipientUser = await inMemoryUsersRepository.create({
        name: "Sally Morales",
        email: "cukob@rumlin.tw",
        password: "1234"
      });

      await transferAmountUseCase.execute({
        recipient_id: recipientUser.id,
        sender_id: "1234",
        amount: 97,
        description: "XaCwzsjxPt"
      })
    }).rejects.toBeInstanceOf(TransferAmountError.UserNotFound)
  });

  it("should not be able to transfer amount if sender user does not have sufficient funding", async() => {
    expect(async () => {
      const senderUser = await inMemoryUsersRepository.create({
        name: "Elijah Johnston",
        email: "be@af.ug",
        password: "1234"
      });

      const recipientUser = await inMemoryUsersRepository.create({
        name: "Sally Morales",
        email: "cukob@rumlin.tw",
        password: "1234"
      });

      await transferAmountUseCase.execute({
        recipient_id: recipientUser.id,
        sender_id: senderUser.id,
        amount: 77,
        description: "uemyErZNcV"
      })
    }).rejects.toBeInstanceOf(TransferAmountError.InsufficientFunds)

  });

  it("should not be able to transfer amount if recipient user does not exist", async() => {
    expect(async() => {
      const senderUser = await inMemoryUsersRepository.create({
        name: "Elijah Johnston",
        email: "be@af.ug",
        password: "1234"
      });

      const senderUserCreatedStatement = await createStatementUseCase.execute({
        user_id: senderUser.id,
        type: OperationType.DEPOSIT,
        amount: 49.00,
        description: "iCIkqDIgTF"
      })

      const transfer = await transferAmountUseCase.execute({
        recipient_id: "mgIVhbjTYb",
        sender_id: senderUser.id,
        amount: senderUserCreatedStatement.amount,
        description: "uemyErZNcV"
      })
    }).rejects.toBeInstanceOf(TransferAmountError.RecipientNotFound)
  });

  it("should be able to consider transfer sent/recivied in user's balance", async() => {
    const senderUser = await inMemoryUsersRepository.create({
      name: "Elijah Johnston",
      email: "be@af.ug",
      password: "1234"
    });

    const recipientUser = await inMemoryUsersRepository.create({
      name: "Sally Morales",
      email: "cukob@rumlin.tw",
      password: "1234"
    });

    const senderUserCreatedStatement = await createStatementUseCase.execute({
      user_id: senderUser.id,
      type: OperationType.DEPOSIT,
      amount: 49.00,
      description: "iCIkqDIgTF"
    })

    await transferAmountUseCase.execute({
      recipient_id: recipientUser.id,
      sender_id: senderUser.id,
      amount: senderUserCreatedStatement.amount,
      description: "uemyErZNcV"
    })

    const senderBalance = await getBalanceUseCase.execute({user_id: senderUser.id})
    const recipientBalance = await getBalanceUseCase.execute({user_id: recipientUser.id})

    expect(senderBalance.balance).toBe(0)
    expect(recipientBalance.balance).toBe(senderUserCreatedStatement.amount)
  })


})
