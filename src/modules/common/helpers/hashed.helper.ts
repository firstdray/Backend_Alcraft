import * as bcrypt from "bcryptjs";
import * as process from "node:process";

export class HashedHelper {

    static async hashPassword(password: string) {
        return await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
    }

    static async comparePassword(plainPass: string, hashedPass: string): Promise<boolean> {
        return await bcrypt.compare(plainPass, hashedPass);
    }
}