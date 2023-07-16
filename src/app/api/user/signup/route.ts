import { connect } from "@/dbConfig/dbCongig";
import User from "@/models/userModal";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs"
import { sendEmail, EMAIL_TYPE } from "@/helpers/mailer";

connect()

export async function POST(request: NextRequest){
  try {
    const reqBody = await request.json();
    const {username, email, password} = reqBody;


    // checking if the useremail or username already exists in the DB
    const userEmail =  await User.findOne({email})
    const userName = await User.findOne({username})
    if(userEmail)
      return NextResponse.json({error: "Email already exists"}, {status:400})
    if(userName)
      return NextResponse.json({error:"username already taken"}, {status:400})
      
    // hashing the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    })

    const savedUser = await newUser.save()
    // send verification email
    await sendEmail({email, emailType:EMAIL_TYPE.verify_account, userId:savedUser._id})

    return NextResponse.json({message:"User created successfully", success:true, savedUser})
    
  } catch (error) {
    console.log("Something Went wrong in signup");
    let message;
    if(error instanceof Error)
    message = NextResponse.json({error: error.message}, {status: 500})
    else
      message = String(error);
    return message;  
  }
}