import { Module } from '@nestjs/common';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentRequest, DocumentRequestSchema } from 'src/procurement/entities/document-request-schema';
import { User, UserSchema } from 'src/identity/entities/user.schema';
import { ProcurementModule } from 'src/procurement/procurement.module';
import { RequestStateService } from 'src/procurement/request-state.service';

@Module({
    imports: [
        ProcurementModule,
        MongooseModule.forFeature([
            { name: DocumentRequest.name, schema: DocumentRequestSchema },
            { name: User.name, schema: UserSchema },
        ]),

    ],
    providers: [MarketplaceService, RequestStateService],
    controllers: [MarketplaceController],
})
export class MarketplaceModule { }
