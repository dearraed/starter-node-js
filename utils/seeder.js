require("dotenv").config();
const { connect } = require("../db/connectDB");
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const { seeder } = require("./../config");
const userModel = require("./../db/models/userModel");


let seedDelete = async () => {
    const collections = mongoose.modelNames();
    const deletedCollections = collections.map((collection) =>
     mongoose.models[collection].deleteMany({})
    );
    await Promise.all(deletedCollections);
    console.log("Collections empty successfuly !");
}


let seedAdmin = async () => {
      let admins = await userModel.find({ role: "admin"});
      if(admins.length > 0){
         console.log("Admin user exist");
      } else {
        try{
          let admin = { name: seeder.adminName, lastName: seeder.adminLastName, email: seeder.adminEmail, password : seeder.adminPass, passwordConfirm: seeder.adminPass, role: "admin", createdAt: new Date(), updatedAt: new Date()  };
                
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
      process.exit(1);
  }

  seed();

