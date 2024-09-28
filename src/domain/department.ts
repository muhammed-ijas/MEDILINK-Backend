interface Department {
    _id: string;
    name: string;
    description?: string;
    avgTime:string;
    serviceProvider: string; 
    doctors: string[]; 
  }
  
  export default Department;
  