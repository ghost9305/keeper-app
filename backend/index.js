import "dotenv/config";
import express from "express";
import cors from "cors";
import noteRoutes from "./route/note.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/notes", noteRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "internal server error" });
});

app.listen(Number(process.env.PORT), () => {
  console.log(`Server is running on port ${Number(process.env.PORT)}`);
});
