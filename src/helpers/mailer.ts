import nodemailer from "nodemailer"
import User from "@/models/userModal"
import bcryptjs from "bcryptjs"
import { randomInt } from "crypto"

interface emailType{
  email: string,
  emailType: string,
  userId: any
}

export const EMAIL_TYPE = {
  verify_account: "VERIFY",
  reset_password: "RESET"
}

// create a random token string
function generateRandomString(length:number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = randomInt(0, characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

export async function sendEmail({email, emailType, userId}: emailType){
  try {
    
    const hashToken = generateRandomString(20);

    if(emailType===EMAIL_TYPE.verify_account){
      await User.findOneAndUpdate(userId, {
        verifyToken: hashToken,
        verifyTokenExpiry: Date.now()+3600000
      }) 
    } else if(emailType===EMAIL_TYPE.reset_password){
      await User.findOneAndUpdate(userId, {
        forgotPasswordToken: hashToken,
        forgotPasswordTokenExpiry: Date.now()+3600000
      })
    }

    // create a transporter
    const transport = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL!,
        pass: process.env.PASSWORD!,
  },
});

    const mailOptions = {
      from: "muditmishra023@gmail.com",
      to: email,
      subject: emailType===EMAIL_TYPE.verify_account?"Verify your email":"Reset your account password",
      html: `<p>Click on <a href="https://secure-next-auth.vercel.app/verifyemail?token=${hashToken}">this link<a/> to ${emailType===EMAIL_TYPE.verify_account?"verify your email":"reset your account password"} or copy paste the following link in your browser <br> <i>https://secure-next-auth.vercel.app//verifyemail?token=${hashToken}</i></p>`
    }

    const mailRes = await transport.sendMail(mailOptions)

    return mailRes;
    
  } catch (error) {
    if(error instanceof Error)
      throw new Error(error.message)
    else
      throw new Error(String(error))
  }
}