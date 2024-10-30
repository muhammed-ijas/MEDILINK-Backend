import SP from "../../domain/sp";


interface SPRepo {

    save(sp:SP):Promise<SP>;
    findByEmail(email:string): Promise<SP | null>;
    findById(_id:string): Promise<SP | null>
    saveOtp(email:string,otp:number,name:string,phone:string,password:string,area:string,city:string,latitude:number,longitude:number,state:string,pincode:number,district:string):Promise<any>
    findOtpByEmail(email:string):Promise<any>
    deleteOtpByEmail(email:string):Promise<any>
}

export default SPRepo;