import mongoose from "mongoose";

const DatabaseConnection = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("🤝 DB Connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export { DatabaseConnection };