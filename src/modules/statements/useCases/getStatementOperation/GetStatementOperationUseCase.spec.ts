import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}


describe("Get Statament Operation", () => {
  beforeEach(async() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("should be able to get informations about a specific operation", async() => {
    const user = await createUserUseCase.execute({
      name: "User Name",
      email: "user@email.com",
      password: "password"
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 10.00,
      description: "Deposit"

    });

    const response = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id
    });

    expect(response).toHaveProperty("id")
  });

  it("should not be able to get information about a operation when user does not exist", async() => {
    expect(async() => {
      await getStatementOperationUseCase.execute({
        user_id: "1234",
        statement_id: "1234"
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  });

  it("should not be able to get information about a not existing operation", async() => {
    expect(async() => {
      const user = await createUserUseCase.execute({
        name: "User Name",
        email: "user@email.com",
        password: "password"
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "1234"
      });

    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)

  });

})
