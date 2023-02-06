import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoIDsDTO} from './dto/deleteCompletedTodos.dto'


@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  @Get('/user:userId')
  findByUserId(@Param('userId') userId: string){
    return this.todoService.findByUserId(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(+id, updateTodoDto);
  }

  @Post('/translate')
  translate(@Body('userId') userId: string){
    return this.todoService.translate(+userId)
  }

  @Delete(':id')
  remove(@Param('id') id: string) { 
    return this.todoService.remove(+id);
  }

  @Post('/deleteCompleted')
  @UsePipes(new ValidationPipe({ transform: true }))
  deleteCompelted(@Body() todoids: TodoIDsDTO){
    console.log(todoids)
    return this.todoService.removeCompleted(todoids);
  }
}
