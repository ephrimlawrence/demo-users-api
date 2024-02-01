import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { MongoClient } from 'mongodb';
import { faker } from '@faker-js/faker';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let client: MongoClient;

  beforeAll(async () => {
    client = new MongoClient("mongodb://localhost:27017/test");
    await client.connect();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/uses/{userId} (GET)', () => {

    it('should return a user object', async () => {
      const db = client.db();
      const usersCollection = db.collection('users');

      // Create user object
      const user = {
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        id: faker.string.uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const resp = await usersCollection.insertOne(user);

      return request(app.getHttpServer())
        .get(`/api/users/${resp.insertedId.toString()}`)
        .expect(200)
        .expect((resp) => {
          const body = resp.body;

          expect(body.statusCode).toBe(200);
          expect(body).toBeDefined();
          expect(body.data[0]).toHaveProperty('email');
          expect(body.data[0].email).toBe(user.email);
        });
    });


    it('should throw user not found error', async () => {
      return request(app.getHttpServer())
        .get(`/api/users/${faker.database.mongodbObjectId()}`)
        .expect(404)
        .expect((resp) => {
          const body = resp.body;

          expect(body).toBeDefined();
          expect(body.statusCode).toBe(404);
          expect(body.error).toBe("Not Found");
        });
    });

    it("should throw 'Invalid user ID' error", async () => {
      return request(app.getHttpServer())
        .get(`/api/users/44434`)
        .expect(400)
        .expect((resp) => {
          const body = resp.body;

          expect(body).toBeDefined();
          expect(body.statusCode).toBe(400);
          expect(body.error).toBe("Bad Request");
        });
    });
  });

  describe('/users/{userId} (GET) Rate Limit', () => {
    it('should return 429 Too Many Requests error when rate limit exceeded', async () => {
      // Create user object for testing
      const usersCollection = client.db().collection('users');

      const user = {
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        id: faker.string.uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const resp = await usersCollection.insertOne(user);

      // Simulate rate limit exceeded by making multiple requests within a short time period
      for (let i = 0; i < 7; i++) {
        await request(app.getHttpServer())
          .get(`/api/users/${resp.insertedId.toString()}`)
          .expect(200);
      }

      // Make one more request and expect 429 Too Many Requests error
      return request(app.getHttpServer())
        .get(`/api/users/${resp.insertedId.toString()}`)
        .expect(429)
    });
  });
});
