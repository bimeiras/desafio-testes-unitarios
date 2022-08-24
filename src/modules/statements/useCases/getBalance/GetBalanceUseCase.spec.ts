import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository
let getBalanceUseCase: GetBalanceUseCase;
let createStatementUserCase: CreateStatementUseCase
let createUserUseCase: CreateUserUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Balance", () => {

  beforeEach(async() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUserCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
  })

  it("should be able to get user's balance", async() => {
    const user = await createUserUseCase.execute({
      name: "User Name",
      email: "user@email.com",
      password: "password"
    });

    await createStatementUserCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 10.00,
      description: "Deposit"
    });

    const balance = await getBalanceUseCase.execute({user_id: user.id})

    expect(balance.balance).toEqual(10)
    expect(balance.statement.length).toBe(1)

  })

  it("should not be able to get balance from a non existing user", async() => {
    expect(async() => {
      const user_id =  "1234"
      await getBalanceUseCase.execute({ user_id })
    }).rejects.toBeInstanceOf(GetBalanceError)
  })
})
