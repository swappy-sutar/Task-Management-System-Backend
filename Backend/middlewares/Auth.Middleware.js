import jwt from "jsonwebtoken";
import { User } from "../Models/User.Model.js";

const auth = async (req, res, next) => {
  try {
    const token =
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.body?.token ||
      req.header("token") ||
      req.cookies?.token;

    if (!token) {
      return res.status(400).json({
        status: false,
        message: "Token is missing",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      req.user = {
        id: decoded.id || decoded.user,
        firstname: decoded.firstname,
        lastname: decoded.lastname,
        email: decoded.email,
        role: decoded.role,
      };

      next();
    } catch (error) {
      console.log("Token is expire", error);

      return res.status(400).json({
        status: false,
        message: "Your session is expire, Please Login Again",
      });
    }
  } catch (error) {
    console.log("Auth middleware error:", error);
    return res.status(400).json({
      status: false,
      message: "Something went wrong while validating the token",
    });
  }
};


const checkRole = async (req, res, next, expectedrole) => {
  try {
    const user = await User.findById(req.user.id).select("role");

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    if (user.role === expectedrole) {
      return next();
    } else {
      return res.status(400).json({
        status: false,
        message: `You are not a ${expectedrole.toLowerCase()}`,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong while validating the user",
    });
  }
};


const isManager = (req, res, next) => checkRole(req, res, next, "Manager");

const isAdmin = (req, res, next) => checkRole(req, res, next, "Admin");

const isEmployee = (req, res, next) => checkRole(req, res, next, "Employee");

const isTeamLeader = (req, res, next) => checkRole(req, res, next, "Team Leader");


export { auth, isManager, isAdmin, isEmployee, isTeamLeader };
