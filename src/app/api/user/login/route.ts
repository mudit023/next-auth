import { connect } from "@/dbConfig/dbCongig";
import User from "@/models/userModal";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { log } from "console";

connect()

export async function POST(request: NextRequest){
  try {
    const reqBody = await request.json();
    const {email, password} = reqBody;


    // checking if the username exists in the DB
    const user = await User.findOne({email})
    if(!user)
      return NextResponse.json({error:"User does not exit", success:false}, {status:400})
      
    // Check if the password is correct
    const userPassword = user.password;
    const verifiedPassword = await bcryptjs.compare(password, userPassword)
    if(!verifiedPassword){
      console.log("password",verifiedPassword);
      return NextResponse.json({error:"Invalid Password!", success:false}, {status:400})
    }
      
    // Creating token and storing it in the user's cookies
    // Creating token data
      const tokenData = {
        id: user._id,
        username: user.username,
        email: user.email
      }
  
      // creating the JWT token
      const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d"})
  
      // creating the response
      const res = NextResponse.json({message: "Login successfully!", success:true})
  
      // setting the token in the cookie of the response
      res.cookies.set("token", token, {httpOnly:true})
  
      // return the response
      return res;
    
  } catch (error) {
    console.log("Something Went wrong in login");
    let message;
    if(error instanceof Error)
    message = NextResponse.json({error: error.message}, {status: 500})
    else
      message = String(error);
    return message;  
  }
}