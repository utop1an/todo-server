import { Injectable } from "@nestjs/common/decorators";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from "./auth.service";
import { jwtConstants } from './jwt.constants';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
          });
      }
    
    async validate(payload: any) {
        return payload;
    }
}