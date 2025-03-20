import { Schema, model, InferSchemaType, ObjectId } from 'mongoose';

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            sparse: true,
        },
        firstName: {
            type: String,
            required: false,
            trim: true,
        },
        lastName: {
            type: String,
            required: false,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, 'is invalid'],
        },
        phoneNumber: {
            type: String,
            required: false,
            trim: true,
            match: [/^\+?[1-9]\d{1,14}$/, 'is invalid'],
        },
        profilePictureKey: {
            type: String,
            default: '',
            required: false,
        },
        passwordHash: {
            type: String,
            required: false,
        },
        googleId: {
            type: String,
            required: false,
            unique: true,
            sparse: true,
        },
        role: {
            type: String,
            required: true,
            enum: ['user', 'admin'],
            default: 'user',
        },
        lastLogin: {
            type: Date,
            required: false,
        },
        loginAttempts: {
            type: Number,
            required: false,
            default: 0,
        },
        lockUntil: {
            type: Date,
            required: false,
        },
    },
    {
        timestamps: true,
    },
);

type User = InferSchemaType<typeof UserSchema> & { _id: ObjectId };
const UserModel = model<User>('User', UserSchema);

export { UserModel, User };
