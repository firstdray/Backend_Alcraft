import {InjectRepository} from "@nestjs/typeorm";
import {UsersEntity} from "./users.entity";
import {Repository} from "typeorm";
import {CreateUserDTO} from "./DTO/create-user.dto";
import {ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException,} from "@nestjs/common";
import {UpdateUserDTO} from "./DTO/update-user.dto";
import * as uuid from "uuid";
import {HashedHelper} from "../common/helpers/hashed.helper";
import {ResponseHelper} from "../common/helpers/response.helper";
import {UserWithoutDTO} from "./DTO/user-without.dto";
import {ErrorCodes} from "../common/enum/error-codes.enum";

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
            throw new ConflictException(ResponseHelper.alreadyExists('User', ErrorCodes.USER_ALREADY_EXISTS))
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
            const {pass, ...userWithoutPass} = newUser;
            return userWithoutPass;
        } catch (error) {
            this.logger.error(`Failed to create user ${createData.email}`, error.stack);
            throw new InternalServerErrorException(ResponseHelper.internalError());
        }
    }

    public async updateUser(id: string, updateData: UpdateUserDTO): Promise<UsersEntity> {
        this.logger.log(`Updating User with ID: ${id}`);
        try {
            const user = await this.usersRepository.findOneBy({
                userId: id,
            })

            if (!user) {
                throw new NotFoundException(ResponseHelper.notFound('User', ErrorCodes.USER_NOT_FOUND));
            }

            this.usersRepository.merge(user, updateData);
            const updatedUser =  this.usersRepository.save(user);

            this.logger.log(`User with ID ${id} updated successfully`)
            return updatedUser;
        }catch (err) {
            this.logger.error(`Failed to update user with ID: ${id}`, err.stack);
            throw new InternalServerErrorException(ResponseHelper.internalError());
        }
    }

    public async getUser(criteria: {email?: string; phone?: string}) {
        return this.usersRepository.findOne({
            where: criteria
        })
    }

    public async getUserById(id: string): Promise<UserWithoutDTO> {
        this.logger.log(`Fetching user with ID: ${id}`);

        try {
            const user =  await this.usersRepository.findOneBy({
                 userId: id
            })


            if (!user) {
                throw new NotFoundException(ResponseHelper.notFound('User', ErrorCodes.USER_NOT_FOUND));
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {pass, ...userWithoutPass} = user;
            return userWithoutPass;
        } catch (err) {
            this.logger.error(`User with ID ${id} not found`, err.stack)
            throw new InternalServerErrorException(ResponseHelper.internalError());
        }
    }

    public async deleteUser(id: string): Promise<boolean> {
        try {
            const result = await this.usersRepository.delete(id);

            if (result.affected === 0) {
                this.logger.warn(`User with ID: ${id} not found`)
                throw new NotFoundException(ResponseHelper.notFound('User', ErrorCodes.USER_NOT_FOUND));
            }

            this.logger.log(`User with ID ${id} deleted successfully`);
            return true;
        } catch (err) {
            this.logger.error(`Failed to delete User with ID: ${id}`, err.stack);
            throw new InternalServerErrorException(ResponseHelper.internalError());
        }
    }
}