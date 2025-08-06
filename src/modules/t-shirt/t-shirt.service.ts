import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {TShirtEntity} from "./t-shirt.entity";
import {Repository} from "typeorm";

@Injectable()
export class TShirtService {

    constructor(
        @InjectRepository(TShirtEntity)
        private readonly tShirtRepository: Repository<TShirtEntity>,
    ) {}

    getTShirt(): Promise<TShirtEntity[]> {
        return this.tShirtRepository.find();
    }
}
