const User = require('../models/usermodel')

exports.getAllUsers = async(req,res) => {
    try{
        const users = await User.findAll();
        res.json(users);
    }catch (error){
        res.status(500).json({message:'伺服器錯誤',error})
    }
}

exports.createUser = async(req,res) => {
    try{
        const newUser = await User.create(req.body);
        res.json({message:'使用者已建立',user:newUser})
    }catch(error){
        res.status(500).json({message:'伺服器錯誤',error})
    }
}