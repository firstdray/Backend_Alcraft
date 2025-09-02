import {InjectRepository} from "@nestjs/typeorm";
import {UsersEntity} from "./users.entity";
import {Repository} from "typeorm";
import {CreateUserDTO} from "./DTO/create-user.dto";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {UpdateUserDTO} from "./DTO/update-user.dto";
import * as uuid from "uuid";
import {HashedHelper} from "../common/helpers/hashed.helper";
import {SuccessCodes} from "../common/enum/success-codes.enum";
import {UserWithoutDTO} from "./DTO/user-without.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,

    ) {}

    public async addNewUser(createData: CreateUserDTO){
        const exUser = await this.usersRepository.findOne({
            where: {email: createData.email},
        })

        if (exUser) {
            throw new UnauthorizedException("User already exists");
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

            await this.usersRepository.save(newUser);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {pass, ...userWithoutPass} = newUser;
            return {
                success: true,
                message: 'Created User Success',
                user: userWithoutPass,
                code: SuccessCodes.USER_CREATED,
            };
        } catch (error) {
            console.error('Error adding new user', error);
        }
    }

    public async updateUser(id: string, updateData: UpdateUserDTO): Promise<UsersEntity> {
        const user = await this.usersRepository.findOneBy({
            userId: id,
        })

        if (!user) {
            new Error(`User with id ${id} not found`);
        }

        Object.assign(user, updateData);

        return this.usersRepository.save(user);
    }

    public async getUser(criteria: {email?: string; phone?: string}) {
        return this.usersRepository.findOne({
            where: criteria
        })
    }

    public async getUserById(id: string) {
        const user =  await this.usersRepository.findOne({
            where: { userId: id},
            select: ['userId', 'email', 'name', 'surname', 'patronymic', 'phone']
        })

        if (!user) {
            new Error(`User with id ${id} not found`);
        }

        return user;
    }

    public async deleteUser(id: string): Promise<boolean> {
        const user = await this.usersRepository.delete(id);

        if (!user) {
            new Error(`User with id ${id} not found`);
            return false;
        }

        return true;
    }
}