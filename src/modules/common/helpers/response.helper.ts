import {SuccessCodes} from "../enum/success-codes.enum";
import {ErrorCodes} from "../enum/error-codes.enum";
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

    // Success
    static created<T>(entity: string, data: T, code: SuccessCodes): SuccessResponse<T> {
        return this.success(`${entity} created successfully`, code, data)
    }

    static updated<T>(entity: string, data: T, code: SuccessCodes): SuccessResponse<T> {
        return this.success(`${entity} updated successfully`, code, data)
    }

    static retrieved<T>(entity: string, data: T, code: SuccessCodes): SuccessResponse<T> {
        return this.success(`${entity} retrieved successfully`, code, data)
    }

    static delete<T>(entity: string, data: T, code: SuccessCodes): SuccessResponse<T> {
        return this.success(`${entity} deleted successfully`, code, data)
    }

    static found<T>(entity: string, data: T, code: SuccessCodes): SuccessResponse<T> {
        return this.success(`${entity} found successfully`, code, data)
    }

    // Error
    static notFound(entity: string, code: ErrorCodes): ErrorResponse {
        return this.error(`${entity} not found`, code);
    }

    static alreadyExists(entity: string, code: ErrorCodes): ErrorResponse {
        return this.error(`${entity} already exists`, code)
    }

    static invalidPassword(entity: string, code: ErrorCodes): ErrorResponse {
        return this.error(`${entity} invalid password`, code)
    }

    static internalError(): ErrorResponse {
        return this.error('Internal server error', ErrorCodes.INTERNAL_SERVER_ERROR);
    }
}