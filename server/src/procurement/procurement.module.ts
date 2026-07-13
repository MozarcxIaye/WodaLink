import { Module } from '@nestjs/common';
import { ProcurementService } from './procurement.service';
import { ProcurementController } from './procurement.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentRequest, DocumentRequestSchema } from './entities/document-request-schema';

@Module({
  imports: [
    // 💡 This line registers DocumentRequestModel inside this module!
    MongooseModule.forFeature([
      { name: DocumentRequest.name, schema: DocumentRequestSchema },
    ]),
  ],
  controllers: [ProcurementController],
  providers: [ProcurementService],
  exports: [MongooseModule]
})
export class ProcurementModule {}
