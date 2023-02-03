import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;
  const mockUserRepository = {
    save: jest.fn().mockImplementation((dto: CreateUserDto) => {
      return Promise.resolve({
        id: Math.ceil(Math.random() * 10),
        ...dto,
      });
    }),
  };

  const mockTodoRepository = {
    save: jest.fn().mockImplementation((dto: CreateTodoDto) => {
      return Promise.resolve({
        id: Math.ceil(Math.random() * 10),
        ...dto,
      });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        },
        {
          provide: getRepositoryToken(Todo),
          useValue: mockTodoRepository
        }
      ],

    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
