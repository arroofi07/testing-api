import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// @Module({
//   imports: [
//     TypeOrmModule.forRootAsync({
//       useFactory: (configService: ConfigService) => ({
//         type: 'mysql',
//         url: process.env.DATABASE_URL,
//         host: configService.getOrThrow('MYSQL_HOST'),
//         port: configService.get('MYSQL_PORT'),
//         database: configService.getOrThrow('MYSQL_DATABASE'),
//         username: configService.getOrThrow('MYSQL_USERNAME'),
//         password: configService.getOrThrow('MYSQL_PASSWORD'),
//         autoLoadEntities: true,
//         synchronize: configService.getOrThrow('MYSQL_SYNCHRONIZE'),
//       }),
//       inject: [ConfigService],
//     }),
//   ],
// })
// export class DatabaseModule {}
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // Memuat file .env
    TypeOrmModule.forRoot({
      type: 'mysql',
      url: process.env.MYSQL_URL, // Menggunakan MYSQL_URL dari .env
      autoLoadEntities: true, // Menyesuaikan entitas otomatis
      synchronize: true, // Jangan gunakan di production (akan memodifikasi struktur DB)
    }),
  ],
})
export class DatabaseModule {}
