const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role = 'customer' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with role
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};



exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token with user ID and role
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
 


exports.logoutUser = async(req, res) => {
  try{
    res.status(200).json({message:"Logout successful"});
  }catch(err){
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.forgotPassword = async(req,res) => {
  try{
    const {email} = req.body;
    const user = await User.findOne({where:{email}});
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    const resetToken = jwt.sign({userId:user.id},process.env.JWT_SECRET,{expiresIn:"1h"});
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      from: "no-reply@eazycart.com",
      to: user.email,
      subject: "Password Reset Request",
      text: `Click the link to reset your password: ${resetLink}`,
    });
    res.json({message:"Password reset link sent to your email"});
  }catch(err){
    res.status(400).json({message:"Internal Server Error"});
  }
}


exports.resetPassword = async(req,res) => {
  try{
    const {token,password} = req.body;
    const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
    const user = await User.findOne({where:{id:decodedToken.userId}});
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    const hashedPassword = await bcrypt.hash(password,10);
    await user.update({password:hashedPassword});
    res.json({message:"Password reset successful"});
  }catch(err){
    res.status(400).json({message:"Invalid or expired token"});
  }
}

exports.getUserDetails = async(req,res) => {
  try{
    const user = req.user;
    res.json({
      id:user.userid,
      name:user.name,
      email:user.email,
    });
  }catch(err){
    res.status(500).json({message:"Internal Server Error"});
  }
};

exports.getAllUsers = async (req,res) => {
  try{
    const users = await User.findAll({
      attributes:["id","name","email"]
    });
    res.status(200).json(users);
  }catch(err){
    res.status(500).json({message:"Internal Server Error"});
  }
}


exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the user exists before deletion
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user
    await User.destroy({ where: { id } });
    res.status(200).json({ message: "User deleted successfully" });

  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

