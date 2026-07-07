import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { UserRole } from "./user-role.enum";


export type UserDocument = HydratedDocument<User>

@Schema({ _id: false })
class RunnerMetada {
    @Prop({
        required: true,
        index: true
    })
    municipalityId!: string

    @Prop({
        default: 5.0
    })
    rating!: number
}


@Schema({
    timestamps: true,
})
export class User {
    @Prop({
        required: true,
        unique: true,
        lowercase: true,
        index: true
    })
    email!: string

    @Prop({
        required: true
    })
    passwordHash!: string

    @Prop({
        required: true,
    })
    name!: string

    @Prop({
        type: String,
        enum: UserRole,
        required: true
    })
    role!: UserRole

    @Prop({
        required: true
    })
    isVerified!: boolean

    @Prop({
        type: RunnerMetada,
        required: false
    })
    runnerMetadata!: RunnerMetada

}

export const UserSchema = SchemaFactory.createForClass(User)