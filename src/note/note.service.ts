import { ForbiddenException, Injectable } from "@nestjs/common";
import { InsertNoteDTO, UpdateNoteDTO } from "./dto";
import { PrismaService } from "src/prisma/prisma.service";



@Injectable()
export class NoteService {
    constructor(private prismaService: PrismaService) {

    }
    async getNote(userId: number) {
        const notes = await this.prismaService.note.findMany({
            where: {
                userId
            }
        })
        return notes
    }
    getNoteById(noteId: number) { }
    async insertNote(userId: number, insertNoteDTO: InsertNoteDTO) {
        const note = await this.prismaService.note.create({
            data: {
                ...insertNoteDTO,
                userId
            }
        })
        return note
    }
    async updateNoteById(noteId: number, updateNoteDTO: UpdateNoteDTO) {
        const note = await this.prismaService.note.findUnique({
            where: {
                id: noteId
            }
        })
        if (!note) {
            throw new ForbiddenException('Cannot find note to update')
        }

        return this.prismaService.note.update({
            where: {
                id: noteId
            },
            data: { ...updateNoteDTO }
        })
    }
    async deleteNoteById(noteId: number) {
        const note = await this.prismaService.note.findUnique({
            where: {
                id: noteId
            }
        })
        if (!note) {
            throw new ForbiddenException('Cannot find note to update')
        }

        return this.prismaService.note.delete({
            where: {
                id: noteId
            }
        })
    }
}   