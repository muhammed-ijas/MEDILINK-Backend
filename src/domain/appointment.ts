
export interface Appointment {
    _id?: string;
    userId: string;       // Reference to the user who made the appointment
    providerId: string;   // Reference to the service provider (hospital, clinic)
    department: string;   // Department where the appointment is made (e.g., Cardiology)
    doctorId: string;     // Reference to the doctor the appointment is with
    date: string;         // Date of the appointment
    slot: string;         // Time slot selected by the user
    patientDetails: {
      name: string;
      age: number;
      email: string;
      phone: string;
    };
    paymentStatus: string;      
    paymentIntentId?: string; // Reference to the Stripe payment intent
    createdAt?: Date;
    bookingStatus:string;
    qrCode:string;
  }
  