import { User } from "../Models/User.Model.js";
import { mailSender } from "../utils/MailSender.js";
import { OTP } from "../Models/Otp.Model.js";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    let otp = otpGenerator.generate(6, {
      digits: true,
      upperCase: false,
      lowercase: false,
      specialChars: false,
    });

    while (await OTP.findOne({ otp })) {
      otp = otpGenerator.generate(6, {
        digits: true,
        upperCase: false,
        lowercase: false,
        specialChars: false,
      });
    }

    const optPayload = { email, otp };

    await OTP.create(optPayload);

    const mailRes = await mailSender(
      email,
      "Your Verification OTP - Task-Management",
      `
        <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; max-width: 600px; margin: auto;">
          <h2 style="color: #4CAF50;">Welcome to Task-Management</h2>
          <p>Dear User,</p>
          <p>Your One-Time Password (OTP) for verification is:</p>
          <h3 style="background-color: #f8f8f8; padding: 10px; text-align: center; border: 1px dashed #ccc; color: #333;">${otp}</h3>
          <p>Please use this OTP within 10 minutes.</p>
          <p>Best Regards,<br>Task-Management Team</p>
        </div>
      `
    );

    if (mailRes && mailRes.accepted && mailRes.accepted.includes(email)) {
      return res.status(201).json({
        success: true,
        message: "OTP sent successfully. Please check your email.",
      });
    } else {
      return res.status(500).json({
        success: false,
        message:
          "OTP generated, but we could not send the email. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Error sending OTP",
    });
  }
};

const signup = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      confirmPassword,
      phoneNumber,
      role,
      department,
      position,
      otp,
    } = req.body;

    if (
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNumber ||
      !role ||
      !department ||
      !position ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const lastUser = await User.findOne().sort({ employeeId: -1 });

    const nextEmployeeId =  lastUser 
        && lastUser.employeeId  != null 
        ? lastUser.employeeId + 1 : 1;

    if (nextEmployeeId == null) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate a unique employee ID",
      });
    }

    const user = await User.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashedPassword,
      phoneNumber: phoneNumber,
      role: role,
      department: department,
      position: position,
      employeeId: nextEmployeeId,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.error("Failed to create user", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter both email and password.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const payload = {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "2d",
    });

    user.password = undefined;

    const cookieOptions = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res.status(200).cookie("token", token, cookieOptions).json({
      success: true,
      message: "Logged in successfully",
      data: user,
      token: token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again later.",
    });
  }
};

export { sendOTP, signup, login };
