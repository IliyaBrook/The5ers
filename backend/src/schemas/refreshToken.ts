import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { User } from './user';
import { ObjectId } from '@/types';

@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({
    type: ObjectId,
    ref: 'User',
    required: true,
  })
  user: User;

  @Prop({ required: true })
  refreshToken: string;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);


const days30 = 30 * 24 * 60 * 60;
RefreshTokenSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: days30,
  }
);


RefreshTokenSchema.index({ user: 1 }, { unique: true });

export type TRefreshTokenDocument = HydratedDocument<RefreshToken>;
