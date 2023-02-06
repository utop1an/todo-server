import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';


export class TodoIDsDTO {
    @IsNotEmpty()
    @IsNumber({}, {each: true})
    todos : number[];

}
