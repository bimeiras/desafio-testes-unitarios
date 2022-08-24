import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase
let createUserUseCase: CreateUserUseCase

describe("Show User Profile", () => {
  beforeEach( async() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  })

  it("should be able to show user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "User Name",
      email: "user@email.com",
      password: "password"
    });

    const user_id = user.id

    const userProfile = await showUserProfileUseCase.execute(user_id)

    expect(userProfile).toHaveProperty("id")

  })

  it("should not be able to show profile when user does not exist", async() => {
    expect(async() => {
      await showUserProfileUseCase.execute("1234")
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})
