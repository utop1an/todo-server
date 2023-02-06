import { Translate } from '@google-cloud/translate/build/src/v2';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoIDsDTO } from './dto/deleteCompletedTodos.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';


@Injectable()
export class TodoService {

  constructor(
    @InjectRepository(Todo) private todoRepository: Repository<Todo>,
    @InjectRepository(User) private userRepository: Repository<User>,

    ) {}

  

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

    // count create
    if (!user){
      throw new BadRequestException("Invalid user")
    }

    user.createTodoCount +=1
    this.userRepository.save(user);
    
    return this.todoRepository.save(todo);
  }


  findAll() {
    // not implemented
    return `This action returns all todo`;
  }

  findByUserId(userId: number){
    return this.todoRepository.find({
      where:{
        userId,
      }
    });
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
    if (updateTodoDto.completed!=null){
      todo.completed = updateTodoDto.completed;
      if (updateTodoDto.completed){
        
        // count complete
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
    }
    return this.todoRepository.save(todo);
  }

  async translate(userId: number){
    const todos = this.todoRepository.find({
      where:{
        userId,
      }
    });
    const translating = (await todos).map(todo => todo.title)
    
    

    const googleTranslate = new Translate({
      projectId: "todo-app-376115",
      key: "AIzaSyDL3FDCSFLMJXypdEKcr1JY2pEP3RCfmnw"
    })
    
    const target = "zh"
    let [translations] = await googleTranslate.translate(translating, target);
    
    // count translate
    const user = await this.userRepository.findOne({
      where:{
        id: userId,
      }
    });

    if (!user){
      throw new BadRequestException("Invalid user")
    }

    user.translateTodoCount +=1
    this.userRepository.save(user);
    const translated = (await todos).map((todo, currentindex)=> {
      return {
        id : todo.id,
        title: translations[currentindex],
        completed: todo.completed,
        userId: todo.userId
      }
    })
    return translated
  }

  remove(id: number) {
    return this.todoRepository.delete(id);
    
  }

  removeCompleted(todoids: TodoIDsDTO) {
    
    for (var id of todoids.todos){
      this.todoRepository.delete(id)
    }
    return {
      "statuscode": 200,
      "message": "OK"
    };
  }
}
