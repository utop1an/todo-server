import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    id : number;

    loginCount: number;
  
    createTodoCount: number;
  
    completeTodoCount: number;
  
    translateTodoCount: number;
}
