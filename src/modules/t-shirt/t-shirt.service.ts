import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {TShirtEntity} from "./t-shirt.entity";
import {DeleteResult, Repository} from "typeorm";
import {UpdateTShirtDto} from "./DTO/update-t-shirt.dto";

@Injectable()
export class TShirtService {

    constructor(
        @InjectRepository(TShirtEntity)
        private readonly tShirtRepository: Repository<TShirtEntity>,
    ) {}

    public async getTShirt(): Promise<TShirtEntity[]> {
        return this.tShirtRepository.find();
    }

    public async updateTShirt(id: string, updateData: UpdateTShirtDto): Promise<TShirtEntity> {
        const tShirt = await this.tShirtRepository.findOne({
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
