import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Public } from 'src/utils/decorators/public.decorator';
import { AuthService } from './auth.service';
import { AdminRegisterDto } from './dto/admin.register.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/register')
  async register(@Body() data: RegisterDto ){
    return this.authService.register(data);
  }

  @Public()
  @Post('/login')
  async login(@Body() data:LoginDto){
    return this.authService.login(data);

  }

  @Public()
  @Post('/admin/register')
  async adminRegister(@Body() data: AdminRegisterDto ){
    return this.authService.adminRegister(data);
  }

  @Public()
  @Post('/admin/login')
  async adminLogin(@Body() data:LoginDto){
    return this.authService.adminLogin(data);

  }

}
