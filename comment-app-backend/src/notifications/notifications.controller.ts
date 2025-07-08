import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async getMyNotifications(@Request() req: any) {
    return this.notificationsService.findAllForUser(req.user.userId);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    await this.notificationsService.markAsRead(Number(id));
    return { message: 'Marked as read' };
  }

  @Patch(':id/unread')
async markAsUnread(@Param('id') id: string) {
  await this.notificationsService.markAsUnread(Number(id));
  return { message: 'Marked as unread' };
}

}
