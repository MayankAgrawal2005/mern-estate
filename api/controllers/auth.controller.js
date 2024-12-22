import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
export const signup = async(req,res,next)=>{
 
    const {username,email,password} = req.body; 
     const hashedPassword = bcryptjs.hashSync(password,10);
    const newUser = new User({username,email,password:hashedPassword});

    try{
        await newUser.save(); // save it inside  a database 
        res.status(201).json({
            message:"Signup successfully",
        });

    }
    catch(err){
        // res.status(500).json({
        //     message:err.message || "Some error occurred while creating a create operation",
        // });
        next(err);
    }
   

 


};