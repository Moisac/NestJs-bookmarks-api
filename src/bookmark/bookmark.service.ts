import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'
import { CreateBookmarkDto, EditBookmarkDto } from './dto'

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService){}

    getBookmarks(userId: number) {
        return this.prisma.bookmark.findMany({
            where: {
                userId
            }
        });
    }

    getBookmarkById(userId: number, bookmarkId: number) {
        return this.prisma.bookmark.findFirst({
            where: {
                id: bookmarkId,
                userId
            }
        });
    }

    createBookmark(userId: number, dto: CreateBookmarkDto) {
        return this.prisma.bookmark.create({
            data: {
                ...dto,
                userId
            }
        });
    }

    async editBookmark(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
        const bookmark = await this.prisma.bookmark.findFirst({
            where: {
                id: bookmarkId,
            }
        })
       
        if(!bookmark || bookmark.userId !== userId) 
            throw new ForbiddenException('Bookmark not found')
        
        return this.prisma.bookmark.update({
            where: {
                id: bookmarkId,
            },
            data: {
                ...dto,
            }
        });
        
    }

    async deleteBookmark(userId: number, bookmarkId: number) {
        const bookmark = await this.prisma.bookmark.findFirst({
            where: {
                id: bookmarkId,
            }
        })
        if(!bookmark || bookmark.userId !== userId) 
            throw new ForbiddenException('Bookmark not found')

        return this.prisma.bookmark.delete({
            where: {
                id: bookmarkId,
            }
        })
    }
}
