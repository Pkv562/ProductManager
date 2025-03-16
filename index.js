import express from "express"; // Import Express framework
import cors from "cors"; // Import CORS for cross-origin requests
import usersRoutes from "./routes/users.js"; // Import user-related routes

const app = express();
const PORT = 5000;

app.use(cors()); // enable the server to accept requests from the client
app.use(express.json()); // Parse JSON bodies
app.use(express.static("website")); // Serve static files from "website" folder
app.use("/users", usersRoutes); // Use user routes for "/users" endpoint

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`)); // Start server
