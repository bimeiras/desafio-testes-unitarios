import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"


let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe("Create User", () => {
  beforeEach( async() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("should be able to create a new user", async () => {

    const user = await createUserUseCase.execute({
      name: "User Name",
      email: "user@email.com",
      password: "1234"
    })

    expect(user).toHaveProperty("id")

  })

  it("should not be able to create user when given email is already taken", async() => {

    expect(async() => {
      await createUserUseCase.execute({
        name: "User Name",
        email: "sameuser@email.com",
        password: "1234"
      })

      await createUserUseCase.execute({
        name: "User Name",
        email: "sameuser@email.com",
        password: "1234"
      })

    }).rejects.toBeInstanceOf(CreateUserError)

  })
})
