// interface Doctor {
//     _id: string;
//     name: string;
//     specialization: string;
//     availableFrom: string; 
//     availableTo: string;   
//     department: string; 
//     contact: string;
//     timeSlots: TimeSlot[];

//   }


//   interface TimeSlot {
//     slot: string; // e.g., "10:10 - 10:30"
//     status: 'occupied' | 'not occupied';
//   }

interface TimeSlot {
  slot: string;
  status: 'occupied' | 'not occupied';
  user?: string; // Reference to the user who booked the slot (optional)
}

interface AvailableDate {
  date: Date;
  timeSlots: TimeSlot[];
}

interface Doctor {
  _id?: string; // _id is optional because new doctors won't have one initially
  name: string;
  specialization: string;
  availableFrom: string;
  availableTo: string;
  contact: string;
  dateFrom: Date; // New fields for date range
  dateEnd: Date;   // New fields for date range
  availableDates: AvailableDate[]; // Array of available dates, each containing time slots
}

  
  export default Doctor;
