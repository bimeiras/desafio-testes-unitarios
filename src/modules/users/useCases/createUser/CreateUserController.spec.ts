import request from "supertest";

import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from '../../../../database';

let connection: Connection

describe("Create User", () => {
  beforeAll( async () => {
    connection = await createConnection()
    await connection.runMigrations()
  });

  afterAll(async () => {
    await connection.close()

})

  it("should be able to create users", async() => {
    const response = await request(app).post("/users")
    .send({
        name: "User",
        email: "user@email.com",
        password: "password"
    })

    expect(response.status).toBe(201)
  })
})

