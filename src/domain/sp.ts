interface sp {
    _id:string
    name: string;
    email: string;
    password: string;
    phone: string;
    area:string;
    district: string;
    city: string;
    pincode: string;
    latitude: number;
    longitude: number;
    state: string;
    isBlocked:boolean;
    isVerified:boolean;
    openingTime:string;
    closingTime:string;
    serviceType:string;
    profileImage: string;
    departments: string[];
  }
 
  
  export default sp;
  