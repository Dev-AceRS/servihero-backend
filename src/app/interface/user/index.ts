import {
    Schema as MongooseSchema,
    FilterQuery,
    Document,
} from 'mongoose';
import { GenericAbstractRepository } from 'src/app/interface/generic.abstract.repository';
import { User } from 'src/app/models/user/user.schema';
import {
    UserRegisterDTO,
} from 'src/app/dto/user';

export abstract class AbstractUserRepository {
    abstract createUser(
        userRegisterDto: UserRegisterDTO,
    ): Promise<RegisterResponseData | null>;
}

export abstract class AbstractUserService {
    abstract createUser(
        userRegisterDto: UserRegisterDTO,
    ): Promise<RegisterResponseData | null>;
}
export interface RegisterResponseData {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    status: string;
}

export interface LoginResponseData {
    _id: string;
    first_name: string;
    last_name: string;
    access_token: string;
    email?: string;
    status?: string;
}