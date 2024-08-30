import nodemailer from "nodemailer";
import Nodemailer from "../../useCase/interface/nodemailerInterface";
import dotenv from 'dotenv'
dotenv.config()

class sendOtp implements Nodemailer{
    private transporter : nodemailer.Transporter
    constructor(){
        this.transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'muhammedijas793@gmail.com',
                pass:process.env.MAILER,
            },
        }) 
    }

    sendMail(email:string,otp:number):void{
        const mailOptions :nodemailer.SendMailOptions = {
            from:'muhammedijas793@gmail.com',
            to:email,
            subject:'MEDILINK Email Verification',
            text: `${email},your verification code is: ${otp}`
        }
        this.transporter.sendMail(mailOptions,(err)=>{
            if(err){
                console.log(err)
            }else{
                console.log('verification code sent successfully')
            }
        })
    }

    sendConfirmation(email:string){
        const mailOptions :nodemailer.SendMailOptions = {
            from:'muhammedijas793@gmail.com',
            to:email,
            subject:'Your service provider Request Has Been Approved',
            text: `We are pleased to inform you that your request to become a service provider of our company has been approved. Congratulations!`
        }
        this.transporter.sendMail(mailOptions,(err)=>{
            if(err){
                console.log(err)
            }else{
                console.log('Confirmation email sent successfully')
            }
        })

    }
    sendRejection(email: string,reason:string): void {
        const mailOptions :nodemailer.SendMailOptions = {
            from:'muhammedijas793@gmail.com',
            to:email,
            subject:'Your  Request Has Been Rejected',
            text: `${reason}`
        }
        this.transporter.sendMail(mailOptions,(err)=>{
            if(err){
                console.log(err)
            }else{
                console.log('Confirmation email sent successfully')
            }
        })
    }
}

export default sendOtp

