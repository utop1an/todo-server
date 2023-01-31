import { IsNotEmpty } from "class-validator";

export class AdminRegisterDto {
    
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    admin_secret: string;
}
