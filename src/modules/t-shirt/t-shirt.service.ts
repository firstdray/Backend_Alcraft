import {Injectable, InternalServerErrorException, Logger} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {TShirtEntity} from "./t-shirt.entity";
import {Repository} from "typeorm";
import {UpdateTShirtDto} from "./DTO/update-t-shirt.dto";
import {CreateTShirtDTO} from "./DTO/create-t-shirt.dto";
import {ResponseHelper} from "../common/helpers/response.helper";
import {ErrorCodes} from "../common/enum/error-codes.enum";

@Injectable()
export class TShirtService {
    private readonly logger = new Logger(TShirtService.name);

    constructor(
        @InjectRepository(TShirtEntity)
        private readonly tShirtRepository: Repository<TShirtEntity>,
    ) {}

    public async getTShirt(): Promise<TShirtEntity[]> {
        this.logger.log('Fetching all T-Shirts');

        try {
            const tShirts = await this.tShirtRepository.find();

            if(tShirts.length === 0) {
                this.logger.warn('No T-Shirts');
                throw new Error(ErrorCodes.TSHIRT_NOT_FOUND)
            }

            this.logger.log(`Found ${tShirts.length} T-Shirts`);
            return tShirts;
        } catch (error) {
            this.logger.error('Failed to fetch T-Shirts');

            if(error.message === ErrorCodes.TSHIRT_NOT_FOUND) {
                throw error;
            }

            throw new InternalServerErrorException(ResponseHelper.internalError());
        }
    }

    public async addTShirt(createData: CreateTShirtDTO): Promise<TShirtEntity> {
        this.logger.log(`Adding new T-Shirt with ID: ${createData.tShirtId}`);
        const exTShirt = await this.tShirtRepository.findOne({
            where: { tShirtId: createData.tShirtId },
        });

        if (exTShirt) {
            this.logger.warn(`T-Shirt with ID: ${createData.tShirtId} already exists`);
            throw new Error(ErrorCodes.TSHIRT_ALREADY_EXISTS)
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

            const saved =  await this.tShirtRepository.save(newTShirt);
            this.logger.log(`T-Shirt with ID ${createData.tShirtId} created successfully`)

            return saved;
        } catch (error) {
            this.logger.error(`Failed to create T-Shirt ${createData.tShirtId}`);

            if (error.message === ErrorCodes.TSHIRT_ALREADY_EXISTS) {
                throw error;
            }

            throw new InternalServerErrorException(ResponseHelper.internalError());
        }
    }

    public async updateTShirt(id: string, updateData: UpdateTShirtDto): Promise<TShirtEntity> {
        this.logger.log(`Updating T-Shirt with ID: ${id}`);


        try {
            const tShirt = await this.tShirtRepository.findOneBy({
                tShirtId: id
            });

            if (!tShirt) {
                this.logger.warn(`T-Shirt with ID ${id} not found`);
                throw new Error(ErrorCodes.TSHIRT_NOT_FOUND);
            }

            this.tShirtRepository.merge(tShirt, updateData);
            const updatedTShirt = await this.tShirtRepository.save(tShirt);

            this.logger.log(`T-Shirt with ID ${id} updated successfully`);
            return updatedTShirt;
        } catch (error) {
            this.logger.error(`Failed to update T-Shirt ${id}`);

            if (error.message === ErrorCodes.TSHIRT_NOT_FOUND) {
                throw error;
            }

            throw new InternalServerErrorException(ResponseHelper.internalError());
        }

    }

    public async deleteTShirt(id: string): Promise<boolean> {
        this.logger.log(`Deleting T-Shirt with ID: ${id}`);
        try {
            const result = await this.tShirtRepository.delete({
                tShirtId: id
            });

            if (result.affected === 0) {
                this.logger.warn(`T-Shirt with ID: ${id} not found`);
                throw new Error(ErrorCodes.TSHIRT_NOT_FOUND);
            }

            this.logger.log(`T-Shirt with ID: ${id} deleted successfully`);
            return true;

        } catch (error) {
            this.logger.error(`Failed to delete T-Shirt ${id}`);

            if (error.message === ErrorCodes.TSHIRT_NOT_FOUND) {
                throw error;
            }

            throw new InternalServerErrorException(ResponseHelper.internalError());
        }
    }
}
