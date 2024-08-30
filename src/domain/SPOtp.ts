interface SPOtp{
    name:string,
    email:string,
    phone:string,
    password:string,
    area: string,
    city: string,
    latitude: number,
    longitude: number,
    state: string,
    pincode: number,
    district: string,
    otp:number,
    otpGeneratedAt:Date
}

export default SPOtp ; 