import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { schemaOptions } from '.';

export type TPortfolioStockDocument = HydratedDocument<PortfolioStock> & {
  id: string;
};

@Schema(schemaOptions)
export class PortfolioStock {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, uppercase: true })
  symbol: string;

  @Prop({ required: true, min: 0 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  averagePrice: number;

  @Prop({ type: Date, default: Date.now })
  addedAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const PortfolioStockSchema = SchemaFactory.createForClass(PortfolioStock);

PortfolioStockSchema.virtual('id').get(function () {
  return this._id.toString();
});

PortfolioStockSchema.index({ userId: 1, symbol: 1 }, { unique: true });
