import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Param, Get } from '@nestjs/common';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get(':id/thread')
  async getThread(@Param('id') id: string) {
    return this.commentsService.getThread(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @Body() body: { content: string; parentId?: number },
    @Request() req: any,
  ) {
    const authorId = req.user.userId;
    return this.commentsService.create(body.content, authorId, body.parentId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async editComment(
    @Param('id') id: string,
    @Body() body: { content: string },
    @Request() req: any,
  ) {
    return this.commentsService.edit(Number(id), req.user.userId, body.content);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/delete')
  async softDelete(@Param('id') id: string, @Request() req: any) {
    return this.commentsService.delete(Number(id), req.user.userId);
  }
  
  @UseGuards(JwtAuthGuard)
  @Patch(':id/restore')
  async restore(@Param('id') id: string, @Request() req: any) {
    return this.commentsService.restore(Number(id), req.user.userId);
  }
}
