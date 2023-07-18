import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(configService: ConfigService) {
        super({
            datasources: {
                db: {
                    url: configService.get('DATABASE_URL')
                }
            }
        })
        console.log('Connected DB')
    }
    async cleanDatabase() {
        return await this.$transaction([
            this.note.deleteMany(),
            this.user.deleteMany()
        ])

    }
}
