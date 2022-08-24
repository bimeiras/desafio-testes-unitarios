import { create } from "domain";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let inMemoryUsersRepository: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase

describe("Authenticate User", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  });

  it("should be able to authenticate user", async() => {
    const user = {
      name: "User Name",
      email: "user@email.com",
      password: "password"
    }

    await createUserUseCase.execute(user)

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(result).toHaveProperty("token")
  });

  it("should not be able to authenticate user with invalid email", async () => {
    expect(async() => {
      await authenticateUserUseCase.execute({
        email: "notexistinguser@email.com",
        password: "password"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  });

  it("should not be able to authenticate user with invalid password", async() => {
    expect(async() => {
      const user = await createUserUseCase.execute({
        name: "User Name",
        email: "user@email.com",
        password: "password"
      })

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrectPassword"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })



})
