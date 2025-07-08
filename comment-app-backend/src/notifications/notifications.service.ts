import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notifRepo: Repository<Notification>,
  ) {}

  async create(recipientId: number, commentId: number): Promise<Notification> {
    const notif = this.notifRepo.create({ recipientId, commentId });
    return this.notifRepo.save(notif);
  }

  async findAllForUser(userId: number): Promise<Notification[]> {
    return this.notifRepo.find({
      where: { recipientId: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: number): Promise<void> {
    await this.notifRepo.update(id, { isRead: true });
  }

  async markAsUnread(id: number): Promise<void> {
  await this.notifRepo.update(id, { isRead: false });
}

}