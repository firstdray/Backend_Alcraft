import {InjectRepository} from "@nestjs/typeorm";
import {UsersEntity} from "./users.entity";
import {FindOptionsWhere, Repository} from "typeorm";
import {CreateUserDTO} from "./DTO/create-user.dto";
import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from "@nestjs/common";
import {UpdateUserDTO} from "./DTO/update-user.dto";
import * as uuid from "uuid";
import {HashedHelper} from "../common/helpers/hashed.helper";
import {ResponseHelper} from "../common/helpers/response.helper";
import {UserWithoutDTO} from "./DTO/user-without.dto";
import {ErrorCodes} from "../common/enum/error-codes.enum";
import {UserJWT} from "./DTO/userJWTdto";

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    constructor(
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,

    ) {}

    public async addNewUser(createData: CreateUserDTO): Promise<UserWithoutDTO> {
        const exUser = await this.usersRepository.findOne({
            where: {email: createData.email},
        })

        if (exUser) {
            this.logger.warn(`Failed to create: user already with: ${createData.email}`);
            throw new Error(ErrorCodes.USER_ALREADY_EXISTS)
        }

        try {
            const hashedPassword = await HashedHelper.hashPassword(createData.pass);
            const newUser = this.usersRepository.create({
                userId: uuid.v4(),
                pass: hashedPassword,
                name: createData.name,
                surname: createData.surname,
                patronymic: createData.patronymic || '',
                phone: createData.phone,
                email: createData.email,
            })

            const saved = await this.usersRepository.save(newUser);
            this.logger.log(`User with ID: ${saved.id} created successfully`);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {pass, email, phone, ...userPublic} = newUser;
            return userPublic;
        } catch (error) {
            if (error.message === ErrorCodes.USER_ALREADY_EXISTS) {
                throw error;
            }

            throw new InternalServerErrorException(ResponseHelper.internalError());
        }
    }

    public async updateUser(id: string, updateData: UpdateUserDTO): Promise<UserWithoutDTO> {
        this.logger.log(`Updating User with ID: ${id}`);
        try {
            const user = await this.usersRepository.findOneBy({
                userId: id,
            })

            if (!user) {
                this.logger.warn(`User with ID: ${id} not found`)
                throw new Error(ErrorCodes.USER_NOT_FOUND);
            }

            this.usersRepository.merge(user, updateData);
            const updatedUser = await this.usersRepository.save(user);

            this.logger.log(`User with ID ${id} updated successfully`)

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {pass, email, phone, id: DBid, ...userPublic} = updatedUser;

            return userPublic;
        }catch (err) {
            this.logger.error(`Failed to update user with ID: ${id}`);

            if (err.message === ErrorCodes.USER_NOT_FOUND) {
                throw err;
            }

            throw new InternalServerErrorException(ResponseHelper.internalError());
        }
    }

    public async getUser(email?: string, phone?: string): Promise<UsersEntity> {
        const whereCondition: FindOptionsWhere<UsersEntity> = {};
        if (email) whereCondition.email = email
        if (phone) whereCondition.phone = phone

        const user = await this.usersRepository.findOne({where: whereCondition})

        if (!user) {
            throw new Error(ErrorCodes.USER_NOT_FOUND)
        }

        return user;
    }

    public async getUserById(id: string): Promise<UserWithoutDTO> {
        this.logger.log(`Fetching user with ID: ${id}`);

        try {
            const user =  await this.usersRepository.findOneBy({
                 userId: id
            })


            if (!user) {
                this.logger.warn(`User with ID: ${id} not found`)
                throw new Error(ErrorCodes.USER_NOT_FOUND);
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {pass, email, phone, id: DBid, ...userPublic} = user;
            return userPublic;
        } catch (err) {
            this.logger.error(`User with ID ${id} not found`)

            if (err.message === ErrorCodes.USER_NOT_FOUND) {
                throw err;
            }

            throw new InternalServerErrorException(ResponseHelper.internalError());
        }
    }

    public async deleteUser(id: string): Promise<boolean> {
        try {
            const result = await this.usersRepository.delete(id);

            if (result.affected === 0) {
                this.logger.warn(`User with ID: ${id} not found`)
                throw new Error(ErrorCodes.USER_NOT_FOUND);
            }

            this.logger.log(`User with ID ${id} deleted successfully`);
            return true;
        } catch (err) {
            this.logger.error(`Failed to delete User with ID: ${id}`);

            if (err.message === ErrorCodes.USER_NOT_FOUND) {
                throw err;
            }

            throw new InternalServerErrorException(ResponseHelper.internalError());
        }
    }

    public async getUserByJWT(id: string): Promise<UserJWT> {
        const user =  await this.usersRepository.findOneBy({
            userId: id
        })


        if (!user) {
            this.logger.warn(`User with ID: ${id} not found`)
            throw new Error(ErrorCodes.USER_NOT_FOUND);
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {pass, ...userPublic} = user;
        return userPublic;
    }
}