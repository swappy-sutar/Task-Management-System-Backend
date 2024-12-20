import mongoose, { Schema } from "mongoose";

const OTPSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,  // otp expire in 5 Min
  },
});

export const OTP = mongoose.model("OTP", OTPSchema);
