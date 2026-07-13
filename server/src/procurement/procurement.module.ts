import { Module } from '@nestjs/common';
import { ProcurementService } from './procurement.service';
import { ProcurementController } from './procurement.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentRequest, DocumentRequestSchema } from './entities/document-request-schema';
import { RequestStateService } from './request-state.service';

@Module({
  imports: [
    // 💡 This line registers DocumentRequestModel inside this module!
    MongooseModule.forFeature([
      { name: DocumentRequest.name, schema: DocumentRequestSchema },
    ]),
  ],
  controllers: [ProcurementController],
  providers: [ProcurementService, RequestStateService],
  exports: [MongooseModule, RequestStateService]
})
export class ProcurementModule {}
