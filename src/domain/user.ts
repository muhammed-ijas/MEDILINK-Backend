interface User{
    _id:string,
    name:string,
    email:string,
    phone:string,
    password:string,
    isBlocked:boolean,
    fromGoogle:boolean,
    isAdmin:boolean,
};

export default User;