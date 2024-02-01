import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { User } from './models/user.model';
import { KindagooseModule } from 'kindagoose';
import { faker } from '@faker-js/faker';
import { MongoClient } from 'mongodb';


describe('UserController', () => {
  let userController: UserController;
  let client: MongoClient;
  let app: TestingModule;

  beforeAll(async () => {
    client = new MongoClient("mongodb://localhost:27017/test");
    await client.connect();

    app = await Test.createTestingModule({
      imports: [
        KindagooseModule.forRoot('mongodb://localhost:27017', {
          dbName: 'test',
        }),

        KindagooseModule.forFeature([
          User,
        ]),
      ],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  afterAll(async () => {
    await client.close();
  });

  describe('root', () => {
    it('should return user object', async () => {
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

      const obj = await userController.getUser(resp.insertedId.toString());
      expect(obj).toBeDefined();
      expect(obj.data[0]).toHaveProperty('email');
      expect(obj.data[0].email).toBe(user.email);

    });

    it('should throw user not found error', async () => {
      await expect(userController.getUser(faker.database.mongodbObjectId())).rejects.toThrow('User not found');
    });

    it("should throw 'Invalid user ID' error", async () => {
      await expect(userController.getUser('123')).rejects.toThrow('Invalid user ID');
    });
  });
});
