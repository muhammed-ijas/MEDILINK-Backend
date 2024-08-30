interface SessionData {
    userData?: {
      name:string
      email: string;
      password:string;
      phone:string
    };
    email?:string | null
    otp?: number | null;
    otpGeneratedAt?: number | null;
  }
  
  export default SessionData;