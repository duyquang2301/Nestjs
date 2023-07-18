import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { async } from "rxjs";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        configServer: ConfigService,
        public prismaService: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configServer.get('JWT_SECRET')
        });
    }

    async validate(payload: { sub: number, email: string }) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: payload.sub
            }
        })
        delete user.hashedPassword
        return user
    }
}