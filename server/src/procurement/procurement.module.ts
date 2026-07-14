import { Module } from '@nestjs/common';
import { ProcurementService } from './procurement.service';
import { ProcurementController } from './procurement.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentRequest, DocumentRequestSchema } from './entities/document-request-schema';
import { RequestStateService } from './request-state.service';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    // 💡 This line registers DocumentRequestModel inside this module!
    MongooseModule.forFeature([
      { name: DocumentRequest.name, schema: DocumentRequestSchema },
    ]),
  ],
  controllers: [ProcurementController],
  providers: [ProcurementService, RequestStateService, PaymentsService],
  exports: [MongooseModule, RequestStateService]
})
export class ProcurementModule {}
