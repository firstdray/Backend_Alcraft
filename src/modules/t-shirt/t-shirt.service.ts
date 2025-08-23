import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {TShirtEntity} from "./t-shirt.entity";
import {Repository} from "typeorm";
import {UpdateTShirtDto} from "./DTO/update-t-shirt.dto";
import {CreateTShirtDTO} from "./DTO/create-t-shirt.dto";

@Injectable()
export class TShirtService {

    constructor(
        @InjectRepository(TShirtEntity)
        private readonly tShirtRepository: Repository<TShirtEntity>,
    ) {}

    public async getTShirt(): Promise<TShirtEntity[]> {
        return this.tShirtRepository.find();
    }

    public async addTShirt(createData: CreateTShirtDTO): Promise<TShirtEntity> {

        const exTShirt = await this.tShirtRepository.findOne({
            where: { tShirtId: createData.tShirtId },
        });

        if (exTShirt) {
            throw new NotFoundException(`T-shirt with ID ${createData.tShirtId} already exists`);
        }

        try {
            const newTShirt = this.tShirtRepository.create({
                tShirtId: createData.tShirtId,
                tShirtName: createData.tShirtName,
                nameCollection: createData.nameCollection,
                collectionID: createData.collectionID,
                color: createData.color,
                cut: createData.cut,
                price: createData.price,
                picturePath: createData.picturePath || [],
                discount: createData.discount || 0,
                techInfo: createData.techInfo || [],
                size: createData.size || [],
                density: createData.density || [],
                description: createData.description || '',
            })

            return this.tShirtRepository.save(newTShirt);
        } catch (error) {
            console.error('Error adding TShirt', error);
        }
    }

    public async updateTShirt(id: string, updateData: UpdateTShirtDto): Promise<TShirtEntity> {
        const tShirt = await this.tShirtRepository.findOneBy({
            tShirtId: id
        });

        if (!tShirt) {
            new Error(`TShirt with id ${id} not found`);
        }

        Object.assign(tShirt, updateData);

        return this.tShirtRepository.save(tShirt);
    }

    public async deleteTShirt(id: string) {
        const tShirt = await this.tShirtRepository.delete({
            tShirtId: id
        })

        if (!tShirt) {
            new NotFoundException(`TShirt with ID ${id} not found`);
        }
    }
}
