import {SuccessCodes} from "../enum/success-codes.enum";
import {ErrorCodes} from "../enum/error-codes.enum";
import {TShirtEntity} from "../../t-shirt/t-shirt.entity";
import {ErrorResponse, SuccessResponse} from "../interface/api-response.interface";

export class ResponseHelper {
    static success<T>(message: string, code: SuccessCodes, data: T ): SuccessResponse<T> {
        return {
            success: true,
            message,
            code,
            data,
            timestamp: new Date().toISOString(),
        }
    }

    static error(message: string, code: ErrorCodes): ErrorResponse {
        return {
            success: false,
            message,
            code,
            timestamp: new Date().toISOString(),
        }
    }

    static tShirtsFound(tShirts: TShirtEntity[]): SuccessResponse<TShirtEntity[]> {
        return this.success('T-shirts retrieved successfully', SuccessCodes.DATA_RETRIEVED, tShirts);
    }

    static tShirtCreated(tShirt: TShirtEntity): SuccessResponse<TShirtEntity> {
        return this.success('T-shirt created successfully', SuccessCodes.TSHIRT_CREATED, tShirt);
    }

    static tShirtUpdated(tShirt: TShirtEntity): SuccessResponse<TShirtEntity> {
        return this.success('T-shirt updated successfully', SuccessCodes.TSHIRT_UPDATED, tShirt);
    }

    static tShirtDeleted(): SuccessResponse<null> {
        return this.success('T-shirt deleted successfully', SuccessCodes.TSHIRT_DELETED, null);
    }

    static tShirtNotFound(): ErrorResponse {
        return this.error('T-shirt not found', ErrorCodes.TSHIRT_NOT_FOUND);
    }

    static tShirtAlreadyExists(): ErrorResponse {
        return this.error('T-shirt already exists', ErrorCodes.TSHIRT_ALREADY_EXISTS);
    }

    static internalError(): ErrorResponse {
        return this.error('Internal server error', ErrorCodes.INTERNAL_SERVER_ERROR);
    }
}