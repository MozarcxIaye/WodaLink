import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { IdentityModule } from './identity/identity.module';
import { ProcurementModule } from './procurement/procurement.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),

        onConnectionCreate: (connection) => {
          console.log("Connecting to MongoDB...");

          connection.on("connected", () => {
            console.log("MongoDB Connected");
          });

          connection.on("error", (err) => {
            
            console.log("Mongo Error:", err.message);
          });

          connection.on("disconnected", () => {
            console.log("MongoDB Disconnected");
          });

          return connection;
        },
      }),
    }),
    
    IdentityModule,
    
    ProcurementModule,
    
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
