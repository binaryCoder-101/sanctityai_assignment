import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity/comment.entity';
import { differenceInMinutes } from 'date-fns';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
    private notificationsService: NotificationsService,
  ) {}

  async create(
  content: string,
  authorId: number,
  parentId?: number,
): Promise<Comment> {
  const comment = this.commentRepo.create({
    content,
    authorId,
    parentId,
  });

  const savedComment = await this.commentRepo.save(comment); // ✅ save first

  if (parentId) {
    const parent = await this.commentRepo.findOne({
      where: { id: parentId },
    });
    if (!parent) throw new NotFoundException('Parent comment not found');

    if (parent.authorId !== authorId) {
      await this.notificationsService.create(parent.authorId, savedComment.id); // ✅ use saved ID
    }
  }

  return savedComment;
}


  async getThread(commentId: number): Promise<any> {
    const root = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ['author', 'children'],
    });

    if (!root) throw new NotFoundException('Comment not found');

    return this.buildThread(root);
  }

  private async buildThread(comment: Comment): Promise<any> {
    const children = await this.commentRepo.find({
      where: { parentId: comment.id },
      relations: ['author'],
    });

    const nestedChildren = await Promise.all(
      children.map(async (child) => await this.buildThread(child)),
    );

    return {
      id: comment.id,
      content: comment.isDeleted ? '[deleted]' : comment.content,
      author: comment.author.username,
      createdAt: comment.createdAt,
      children: nestedChildren,
    };
  }

  async edit(commentId: number, authorId: number, newContent: string) {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
    });

    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.authorId !== authorId)
      throw new ForbiddenException('Not your comment');

    const ageInMinutes = differenceInMinutes(new Date(), comment.createdAt);
    if (ageInMinutes > 15) throw new ForbiddenException('Edit window expired');

    comment.content = newContent;
    return this.commentRepo.save(comment);
  }

  async delete(commentId: number, authorId: number) {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
    });

    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.authorId !== authorId)
      throw new ForbiddenException('Not your comment');

    comment.isDeleted = true;
    comment.deletedAt = new Date();
    return this.commentRepo.save(comment);
  }

  async restore(commentId: number, authorId: number) {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
    });

    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.authorId !== authorId)
      throw new ForbiddenException('Not your comment');

    if (!comment.isDeleted || !comment.deletedAt)
      throw new ForbiddenException('Comment is not deleted');
    const minutesSinceDelete = differenceInMinutes(
      new Date(),
      comment.deletedAt,
    );
    if (minutesSinceDelete > 15) {
      throw new ForbiddenException('Restore window expired');
    }

    comment.isDeleted = false;
    comment.deletedAt = null;
    return this.commentRepo.save(comment);
  }
}
