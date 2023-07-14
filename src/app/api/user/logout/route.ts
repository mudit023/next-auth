import { NextResponse } from "next/server";

export async function GET(){
  try {
    const res = NextResponse.json({message: "Logout Successfully!", success:true})
    res.cookies.set("token", "",{httpOnly:true,expires:new Date(0)})
    return res;
  } catch (error) {
    console.log("Something went wrong while loging out");
    let message;
    if(error instanceof Error)
    message = NextResponse.json({error: error.message}, {status: 500})
    else
      message = String(error);
    return message;  
  }
}