import { Model } from 'mongoose';
import { User } from '../../models/User';
import { CreateUser } from './CreateUser';
import { UserCreationStrategy } from './UserCreationStrategy';
import { LocalSignupStrategy } from './LocalSignupStrategy';
import { GoogleSignupStrategy } from './GoogleSignupStrategy';

class UserCreationProcessor {
    private localSignupStrategy: UserCreationStrategy;
    private googleSignupStrategy: UserCreationStrategy;

    constructor({ UserModel }: { UserModel: Model<User> }) {
        this.localSignupStrategy = new LocalSignupStrategy({ UserModel });
        this.googleSignupStrategy = new GoogleSignupStrategy({ UserModel });
    }

    async process(userData: CreateUser): Promise<string> {
        if (userData.googleId) {
            return this.googleSignupStrategy.validateAndProcess(userData);
        } else {
            return this.localSignupStrategy.validateAndProcess(userData);
        }
    }
}

export { UserCreationProcessor };
