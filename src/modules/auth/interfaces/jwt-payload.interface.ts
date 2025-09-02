export interface JwtPayload {
    userId: string;
    email: string;
    phone: string;
}

export interface RefreshTokenPayload {
    userId: string;
}

export interface ValidateResult {
    userId: string;
    email: string;
    phone: string;
}