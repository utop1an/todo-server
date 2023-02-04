import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';


export class DeleteCompletedTodos {
    @IsNotEmpty()
    @IsNumber({}, {each: true})
    todos : number[];

}
