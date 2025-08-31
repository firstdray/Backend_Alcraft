import * as bcrypt from "bcryptjs";
import {ConfigService} from "@nestjs/config";

export class HashedHelper {
    private static configService: ConfigService;

    static async hashPassword(password: string) {
        return await bcrypt.hash(password, Number(this.configService.get<number>('SALT_ROUNDS')));
    }

    static async comparePassword(plainPass: string, hashedPass: string): Promise<boolean> {
        return await bcrypt.compare(plainPass, hashedPass);
    }
}