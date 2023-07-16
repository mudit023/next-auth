import nodemailer from "nodemailer"
import User from "@/models/userModal"
import bcryptjs from "bcryptjs"

interface emailType{
  email: string,
  emailType: string,
  userId: any
}

export const EMAIL_TYPE = {
  verify_account: "VERIFY",
  reset_password: "RESET"
}

export async function sendEmail({email, emailType, userId}: emailType){
  try {
    // create a hash token
    const hashToken = await bcryptjs.hash(userId.toString(), 10);

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
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.USER!,
        pass: process.env.PASS!
      }
    });

    const mailOptions = {
      from: "muditmishra023@gmail.com",
      to: email,
      subject: emailType===EMAIL_TYPE.verify_account?"Verify your email":"Reset your account password",
      html: `<p>Click on <a href="${process.env.DOMAIN}/verifyemail?token=${hashToken}">this link<a/> to ${emailType===EMAIL_TYPE.verify_account?"verify your email":"reset your account password"} or copy paste the following link in your browser <br> <i>${process.env.DOMAIN}/verifyemail?token=${hashToken}</i></p>`
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