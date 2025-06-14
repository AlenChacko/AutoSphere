import handler from 'express-async-handler'

import User from "../../models/user/userModel.js";

export const registerUser = handler(async(req,res)=>{
    const {firstName,lastName,email,password} = req.body;
    console.log(req.body)
})

export const loginUser = handler(async(req,res)=>{
    
})