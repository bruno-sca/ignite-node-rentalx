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
    await request(app)
      .post('/categories')
      .send({
        name: 'ListCategories test',
        description: 'test',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app).get('/categories');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0].name).toBe('ListCategories test');
    expect(response.body[0].description).toBe('test');
  });
});
