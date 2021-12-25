import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;
let token: string;

describe('Create Category Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
      values('${uuidV4()}', 'admin', 'admin@rentx.com', '${password}', 'true', 'now()', 'XXXX')
    `
    );

    const authResponse = await request(app).post('/sessions').send({
      email: 'admin@rentx.com',
      password: 'admin',
    });

    token = authResponse.body.token;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new category', async () => {
    const response = await request(app)
      .post('/categories')
      .send({
        name: 'CreateCategory test',
        description: 'test',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it('should not be able to create a new category with existing name', async () => {
    const response = await request(app)
      .post('/categories')
      .send({
        name: 'CreateCategory test',
        description: 'test',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });
});
