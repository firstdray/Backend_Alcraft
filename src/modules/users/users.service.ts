import {InjectRepository} from "@nestjs/typeorm";
import {UsersEntity} from "./users.entity";
import {Repository} from "typeorm";
import {CreateUserDTO} from "./DTO/create-user.dto";
import {UnauthorizedException} from "@nestjs/common";
import {UpdateUserDTO} from "./DTO/update-user.dto";

export class UsersService {

    constructor(
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
    ) {}

    public async addNewUser(createData: CreateUserDTO): Promise<UsersEntity> {
        const exUser = await this.usersRepository.findOne({
            where: {user_id: createData.userId},
        })

        if (exUser) {
            throw new UnauthorizedException("User already exists");
        }

        try {
            const newUser = this.usersRepository.create({
                user_id: createData.userId,
                pass: createData.pass,
                name: createData.name,
                surname: createData.surname,
                patronymic: createData.patronymic || '',
                phone: createData.phone,
                email: createData.email,
            })

            return this.usersRepository.save(newUser);
        } catch (error) {
            console.error('Error adding new user', error);
        }
    }

    public async updateUser(id: string, updateData: UpdateUserDTO): Promise<UsersEntity> {
        const user = await this.usersRepository.findOneBy({
            user_id: id,
        })

        if (!user) {
            new Error(`User with id ${id} not found`);
        }

        Object.assign(user, updateData);

        return this.usersRepository.save(user);
    }

    public async getUserById(id: string) {
        return await this.usersRepository.findOneBy({
            user_id: id
        })
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