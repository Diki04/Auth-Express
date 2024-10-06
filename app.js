import express from "express";
import authRoutes from "./routes/authRoutes.js";
import 'dotenv/config';
import mongoose from "mongoose";

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRoutes);

// Koneksi DB
try {
  await mongoose.connect(process.env.DATABASE);
  console.log("Database connected");
} catch (error) {
  console.log("Database not connected");
}

app.listen(port, () => {
  console.log("Server running on port 3000");
}); 