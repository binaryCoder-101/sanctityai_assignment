import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity/user.entity';
import { Comment } from './comments/comment.entity/comment.entity';
import { CommentsModule } from './comments/comments.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'comment_app',
      entities: [User, Comment],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    CommentsModule,
    NotificationsModule,
  ],
})
export class AppModule {}

