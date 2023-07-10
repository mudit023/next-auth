import mongoose from "mongoose";

export async function connect(){
  try {
    mongoose.connect(process.env.MONGO_URL!);
    const connection = mongoose.connection;

    connection.on('connected', ()=>{
      console.log("MongoDB connected successfully");
    })

    connection.on('error', (err)=>{
      console.log("MongoDB connection error.", err);
      process.exit();
    })

  } catch (error) {
      console.log("Something Went wrong in DB");
      let message;
      if(error instanceof Error)
        message = error.message;
      else
        message = String(error);
      console.log("error: ",message);   
  }
}