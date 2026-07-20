import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { RequestStatus, DocumentType } from './request-status.enum';

export type DocumentRequestDocument = HydratedDocument<DocumentRequest>;

@Schema({ timestamps: true })
export class DocumentRequest {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  expatId!: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false, index: true })
  runnerId?: string;

  @Prop({ type: String, enum: RequestStatus, default: RequestStatus.PENDING, index: true })
  status!: RequestStatus;

  @Prop({ required: true })
  wardCode!: string;

  @Prop({ type: String, enum: DocumentType, required: true })
  documentType!: DocumentType;

  @Prop({ required: true })
  poaUrl!: string;

  @Prop({ required: false })
  stripeIntentId?: string;

  @Prop({ required: true, default: 0 })
  escrowAmount!: number;

  @Prop({ required: false })
  scanUrl?: string;

  @Prop({ type: Boolean, default: false, index: true })
  isPaid!: boolean;

  @Prop({ type: Boolean, default: false, index: true })
  isEscalated!: boolean;

  @Prop({ type: String, enum: ['low', 'medium', 'high'], required: false })
  escalationLevel?: 'low' | 'medium' | 'high';

  @Prop({ type: String, required: false })
  escalationReason?: string;

  @Prop({ type: String, required: false })
  adminNote?: string;

  @Prop({ type: Date, required: false })
  escalatedAt?: Date;

  @Prop({ type: Date, required: false })
  resolvedAt?: Date;
}

export const DocumentRequestSchema = SchemaFactory.createForClass(DocumentRequest);