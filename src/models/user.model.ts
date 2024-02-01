import { modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { collection: 'Users' } })
export class User {
  @prop()
  firstName: string;

  @prop()
  lastName: string;

  @prop({ unique: true })
  email: string;

  @prop()
  password: string;

  @prop({ type: () => Date })
  createdAt: Date;

  @prop({ type: () => Date })
  updatedAt: Date;
}
