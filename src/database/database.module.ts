import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      url: process.env.MYSQL_URL, // Gunakan variabel ini
      autoLoadEntities: true,
      synchronize: true, // Gunakan false di production
    }),
    // TypeOrmModule.forRootAsync({
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'mysql',
    //     url: process.env.DATABASE_URL,
    //     host: configService.getOrThrow('MYSQL_HOST'),
    //     port: configService.get('MYSQL_PORT'),
    //     database: configService.getOrThrow('MYSQL_DATABASE'),
    //     username: configService.getOrThrow('MYSQL_USERNAME'),
    //     password: configService.getOrThrow('MYSQL_PASSWORD'),
    //     autoLoadEntities: true,
    //     synchronize: configService.getOrThrow('MYSQL_SYNCHRONIZE'),
    //   }),
    //   inject: [ConfigService],
    // }),
  ],
})
export class DatabaseModule {}
