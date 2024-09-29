import express from "express";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const port = 3000;

app.use('/api/v1/auth', authRoutes);

app.listen(port, () => {
  console.log("Server running on port 3000");
}); 