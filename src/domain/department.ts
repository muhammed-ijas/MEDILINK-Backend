interface Department {
    _id: string;
    name: string;
    description?: string;
    serviceProvider: string; 
    doctors: string[]; 
  }
  
  export default Department;
  