import express from "express"; // Import Express framework
import { v4 as uuidv4 } from "uuid"; // Import UUID for unique IDs
import { createUser, deleteUser, getUser, updateUser, getUsers } from "../controllers/users.js"; // Import user-related controllers

const router = express.Router(); // Create a new router

router.get("/", getUsers); // Handle GET requests to /users endpoint

router.post("/", createUser); //    Handle POST requests to /users endpoint

router.get("/:id", getUser); // Handle GET requests to /users/:id endpoint

router.delete("/:id", deleteUser); // Handle DELETE requests to /users/:id endpoint

router.patch("/:id", updateUser); // Handle PATCH requests to /users/:id endpoint

export default router; // Export router for use in other files

