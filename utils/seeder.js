import connect from "../db/connectDB.js";
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { seeder } from "./../config";
import userModel from "./../db/models/userModel"


seed();

let seedDelete = async () => {
    const collections = mongoose.modelNames();
    const deletedCollections = collections.map((collection) =>
     mongoose.models[collection].deleteMany({})
    );
    await Promise.all(deletedCollections);
    console.log("Collections empty successfuly !");
}


let seedAdmin = async () => {
      if(admins.length > 0){
         console.log("Admin user exist");
      } else {
        try{
          let password = await bcryptjs.hash(seeder.adminPass, 12);
          let admin = { name: seeder.adminName, lastname: seeder.adminLastName, email: seeder.adminEmail, password : password, passwordConfirm: password, role: "admin", createdAt: new Date(), updatedAt: new Date()  };
                
          await userModel.create(admin);
          
          console.log("Admin user added sucessfuly !");
        }catch(error){
          console.log("error : ", error);
        }
   }

  }

  let seed = async() => {
      await connect();
      await seedDelete();
      await seedAdmin();
  }

