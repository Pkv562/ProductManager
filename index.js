import express from "express";
import cors from "cors";
import usersRoutes from "./routes/users.js";

const app = express();
const PORT = 5000;

app.use(cors()); 
app.use(express.json()); 
app.use(express.static("website")); 
app.use("/users", usersRoutes);

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
