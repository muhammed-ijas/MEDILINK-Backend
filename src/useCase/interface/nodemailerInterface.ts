interface Nodemailer{
    sendConfirmation(email:string):void
    sendRejection(email:string,reason:string):void
    sendMail(email:string,otp:number):void
}
export default Nodemailer