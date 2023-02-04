import { BadRequestException, Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AdminRegisterDto } from './dto/admin.register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'
import { Role } from 'src/utils/enums/role.enum';

const ADMIN_SECRET = "V5|zrtR{?d}sF(j%Q>^<"

@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(User) private userRepository:Repository<User>,
    private jwtService: JwtService,
    ){}

  async register(data: RegisterDto){
    const {username, password} =data;
    const found = await this.userRepository.findOne({
      where: {
        username,
      }
    });
    if (found){
      throw new BadRequestException('User already exists');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    
    const user = this.userRepository.create({
      username,
      password: hash,
      roles: [Role.User]
    });
    await this.userRepository.save(user)
    return {
      "statuscode": 200,
      "message": "OK"
    };
  };

  async login(data: LoginDto){
    const {username, password} =data;
    const found = await this.userRepository.findOne({
      where: {
        username,
      }
    });
    if (!found){
      throw new BadRequestException('Invalid username or password');
    }

    const {password: hash, id} = found;
    const isMatch = await bcrypt.compare(password, hash);

    if (!isMatch){
      throw new BadRequestException('Invalid username or password');
    }
    // login count
    found.loginCount+=1;
    this.userRepository.save(found);

    const token = this.jwtService.sign({
      id,
      username,
    });
    return {
      "statuscode": 200,
      "message": "OK",
      "token": token
    }
  }

  async adminRegister(data: AdminRegisterDto){
    const {username, password, admin_secret} =data;
    if (admin_secret != ADMIN_SECRET){
      throw new ForbiddenException('Invalid Secret')
    }
    const found = await this.userRepository.findOne({
      where: {
        username,
      }
    });
    if (found){
      throw new BadRequestException('User already exists');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    
    const user = this.userRepository.create({
      username,
      password: hash,
      roles: [Role.Admin, Role.User],
    });
    await this.userRepository.save(user)
    return {
      "statuscode": 200,
      "message": "OK"
    };
  }

  async adminLogin(data: LoginDto){
    const {username, password} =data;
    const found = await this.userRepository.findOne({
      where: {
        username,
      }
    });
    if (!found){
      throw new BadRequestException('Invalid username or password');
    }

    const {password: hash, id, roles} = found;
    const isMatch = await bcrypt.compare(password, hash);

    if (!isMatch){
      throw new BadRequestException('Invalid username or password');
    }
    const isAdmin = found.roles.includes(Role.Admin)
    if (!isAdmin) {
      throw new ForbiddenException("Invalid access")
    }
    const token = this.jwtService.sign({
      id,
      username,
    });
    return {
      "statuscode": 200,
      "message": "OK",
      "token": token
    }

  
  }

}
