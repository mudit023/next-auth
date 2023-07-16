import { connect } from "@/dbConfig/dbCongig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModal";

connect()

export async function POST(request: NextRequest){
  try {
    const reqBody = await request.json()
    const {token} = reqBody;

    const user = await User.findOne({
      verifyToken:token,
      verifyTokenExpiry:{$gt: Date.now()}
    })

    if(!user){
      return NextResponse.json({error:"User not found!", success:false}, {status:400})
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({message:"Email verified!", success:true})

  } catch (error) {
      if(error instanceof Error)
        return NextResponse.json({error: error.message, success:false}, {status:500})
      else
        return NextResponse.json({error:String(error), success:false}, {status:500})
  }
}