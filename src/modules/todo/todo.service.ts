import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {

  constructor(
    @InjectRepository(Todo) private todoRepository: Repository<Todo>,
    @InjectRepository(User) private userRepository: Repository<User>) {}

  async create(createTodoDto: CreateTodoDto) {
    const todo = this.todoRepository.create(createTodoDto);
    todo.completed = false;
    // count create
    // const user = await this.userService.findOne(todo.userId);
    const user = await this.userRepository.findOne({
      where:{
        id: todo.userId,
      }
    });
    if (!user){
      throw new BadRequestException("Invalid user")
    }

    user.createTodoCount +=1
    this.userRepository.save(user);
    
    return this.todoRepository.save(todo);
  }


  findAll() {
    return `This action returns all todo`;
  }

  findOne(id: number) {
    return this.todoRepository.findOne({
      where:{
        id,
      }
    });
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    const todo = await this.findOne(id);
    if (!todo){
      throw new BadRequestException('Todo not found');
    }
    if (updateTodoDto.title){
      todo.title = updateTodoDto.title;
    }
    if (updateTodoDto.completed){
      todo.completed = updateTodoDto.completed;
      const user = await this.userRepository.findOne({
        where:{
          id: todo.userId,
        }
      });

      if (!user){
        throw new BadRequestException("Invalid user")
      }
  
      user.completeTodoCount +=1
      this.userRepository.save(user);
    }
    return this.todoRepository.save(todo);
  }

  async countTranslate(id: number){
    const todo = await this.findOne(id);
    if (!todo){
      throw new BadRequestException('Todo not found');
    }
    const user = await this.userRepository.findOne({
      where:{
        id: todo.userId,
      }
    });

    if (!user){
      throw new BadRequestException("Invalid user")
    }

    user.translateTodoCount +=1
    this.userRepository.save(user);
  }

  remove(id: number) {
    return this.todoRepository.delete(id);
    
  }
}