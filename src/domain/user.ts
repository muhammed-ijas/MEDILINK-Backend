interface WalletEntry {
    appointmentId: string; 
    date: Date;
    amount: number;
    isPlus: boolean;
}



interface User{
    _id:string,
    name:string,
    email:string,
    phone:string,
    password:string,
    isBlocked:boolean,
    fromGoogle:boolean,
    isAdmin:boolean,
    wallet: WalletEntry[];  

};

export default User;