import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { swaggerServe, swaggerSetup } from "./Config/Swagger.config.js";

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:4000"],
  methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));
app.options("*", cors());

import Auth from "./Routes/Auth.Routes.js";
import Task from "./Routes/Task.routes.js";

app.use("/api/v1/auth", Auth);
app.use("/api/v1/Task", Task);

app.use("/api-docs", swaggerServe, swaggerSetup);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is running...",
  });
});

export { app };
