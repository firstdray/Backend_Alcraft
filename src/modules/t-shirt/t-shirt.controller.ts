import { Controller, Get } from '@nestjs/common';
import {TShirtService} from "./t-shirt.service";
import {TShirtEntity} from "./t-shirt.entity";

@Controller('t-shirt')
export class TShirtController {
    constructor(private readonly tShirtService: TShirtService) {}

    @Get()
    getTShirt(): Promise<TShirtEntity[]> {
        return this.tShirtService.getTShirt();
    }
}
