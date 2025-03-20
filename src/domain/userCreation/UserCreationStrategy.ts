import { CreateUser } from './CreateUser';

export interface UserCreationStrategy {
    validateAndProcess(userData: CreateUser): Promise<string>;
}
