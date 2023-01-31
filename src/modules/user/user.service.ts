import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where:{
        id,
      }
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user){
      throw new BadRequestException('User not found');
    }
    if (updateUserDto.username){
      user.username = updateUserDto.username;
    }
    if (updateUserDto.password){
      user.password = updateUserDto.password;
    }
    if (updateUserDto.loginCount){
      user.loginCount = updateUserDto.loginCount;
    }
    if (updateUserDto.createTodoCount){
      user.createTodoCount = updateUserDto.createTodoCount;
    }
    if (updateUserDto.completeTodoCount){
      user.completeTodoCount = updateUserDto.completeTodoCount;
    }
    if (updateUserDto.translateTodoCount){
      user.translateTodoCount = updateUserDto.translateTodoCount;
    }
    return this.userRepository.save(user);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
