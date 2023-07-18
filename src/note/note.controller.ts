import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { MyJwtGuard } from '../auth/guard';
import { NoteService } from './note.service';
import { GetUser } from '../auth/decorator';
import { InsertNoteDTO, UpdateNoteDTO } from './dto';


@UseGuards(MyJwtGuard)
@Controller('notes')
export class NoteController {
    constructor(private noteService: NoteService) {

    }
    @Get()
    getNote(@GetUser('id') userId: number) {
        return this.noteService.getNote(userId)
    }

    @Get(':id')
    getNoteById(@Param() noteId: number) {
        return this.noteService.getNoteById(noteId)
    }

    @Post()
    insertNote(
        @GetUser('id') userId: number,
        @Body() insertNoteDTO: InsertNoteDTO
    ) {
        console.log('insertnote')
        console.log(`userId : ${userId}, noteId: ${JSON.stringify(insertNoteDTO)}`)
        return this.noteService.insertNote(userId, insertNoteDTO)
    }

    @Patch(':id')
    updateNoteById(
        @Param('id', ParseIntPipe) noteId: number,
        @Body() updateNoteDTO: UpdateNoteDTO
    ) {
        return this.noteService.updateNoteById(noteId, updateNoteDTO)
    }

    @Delete()
    deleteNoteById(@Query('id', ParseIntPipe) noteId: number) {
        return this.noteService.deleteNoteById(noteId)
    }

}
