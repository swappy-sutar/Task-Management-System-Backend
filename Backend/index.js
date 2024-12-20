import dotenv from "dotenv";
import { DatabaseConnection } from "./Config/DatabaseConnection.js";
import { app } from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

DatabaseConnection()
  .then(
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    })
  )
  .catch((err) => console.error(err));
