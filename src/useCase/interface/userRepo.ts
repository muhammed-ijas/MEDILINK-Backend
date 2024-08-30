import User from "../../domain/user";
import Otp from '../../domain/otp';


interface UserRepo {

    save(user:User):Promise<User>;
    findByEmail(email:string): Promise<User | null>;
    findById(_id:string): Promise<User | null>
    saveOtp(email:string,otp:number,name:string,phone:string,password:string):Promise<any>
    findOtpByEmail(email:string):Promise<any>
    deleteOtpByEmail(email:string):Promise<any>
}

export default UserRepo;