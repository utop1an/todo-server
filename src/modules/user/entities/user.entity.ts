import { Role } from 'src/utils/enums/role.enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude} from 'class-transformer'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({nullable:true, name: 'login_count', default: 0})
  loginCount: number;

  @Column({nullable:true, name: 'create_todo_count', default: 0})
  createTodoCount: number;

  @Column({nullable:true, name: 'complete_todo_count', default: 0})
  completeTodoCount: number;

  @Column({nullable:true, name: 'translate_todo_count', default: 0})
  translateTodoCount: number;

  @Column("text", {array:true})
  roles: Role[]
}