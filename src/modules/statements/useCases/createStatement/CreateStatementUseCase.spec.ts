import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createStatementUserCase: CreateStatementUseCase
let createUserUseCase: CreateUserUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {
  beforeEach(async() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUserCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it("should be able to create a statement", async() => {
    const user = await createUserUseCase.execute({
      name: "User Name",
      email: "user@email.com",
      password: "password"
    });

    const deposit = await createStatementUserCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 10.00,
      description: "Deposit"
    });

    const withdraw = await createStatementUserCase.execute({
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 10.00,
      description: "Withdraw"
    });

    expect(deposit).toHaveProperty("id")
    expect(withdraw).toHaveProperty("id")
  });

  it("should not be able to create a statement to a non-existing user", async() => {
    expect(async() => {
      await createStatementUserCase.execute({
        user_id: "1234",
        type: OperationType.DEPOSIT,
        amount: 10.00,
        description: "Deposit"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  });

  it("should not be able to create a withdraw when balance is not sufficient", async() => {

    expect(async() => {
      const user = await createUserUseCase.execute({
        name: "User Name",
        email: "user@email.com",
        password: "password"
      });

      const withdraw = await createStatementUserCase.execute({
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 10.00,
        description: "Withdraw"
      });

    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})


