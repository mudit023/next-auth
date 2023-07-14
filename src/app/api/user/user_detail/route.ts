import {getTokenData} from "@/helpers/getTokenData"
import { NextRequest, NextResponse } from "next/server"
import User from "@/models/userModal"
import { connect } from "@/dbConfig/dbCongig"

connect();

export async function GET(request: NextRequest){
  try {
    const userId = await getTokenData(request);
    const user = await User.findOne({_id:userId}).select("-password");
    if(!user){
      return NextResponse.json({error: "Unable to find user!", success:false})
    }
    return NextResponse.json({message: "User found!", data:user, success:true})
  } catch (error) {
    if(error instanceof Error)
      return NextResponse.json({error: error.message}, {status:400})
    else
      return NextResponse.json({error: String(error)}, {status:400})
  }
}