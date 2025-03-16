import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique IDs

let users = []; // Array to store users

export const createUser = (req, res) => { // Create a new user
    const user = req.body;
  
    users.push({ ...user, id: uuidv4() });
  
    res.send(`User with the name ${user.firstName} added to the database!`);
};

export const getUser = (req, res) => { // Get a user by ID
    const { id } = req.params;
  
    const foundUser = users.find((user) => user.id === id);
  
    res.send(foundUser);
};

export const deleteUser = (req, res) => { // Delete a user by ID
    const { id } = req.params;
  
    users = users.filter((user) => user.id !== id);
  
    res.send(`User with the id ${id} deleted from the database.`);
};

export const updateUser = (req, res) => { //  Update a user by ID
    const { id } = req.params; // Get the ID from the request parameters
    const { firstName, lastName, Age } = req.body; // Get the updated user data from the request body
  
    const user = users.find((user) => user.id === id); // Find the user in the array by ID
  
    if (firstName) { // If the first name is provided, update the user's first name
      user.firstName = firstName;
    }
  
    if (lastName) { // If the last name is provided, update the user's last name
      user.lastName = lastName;
    }
  
    if (Age) { // If the Age is provided, update the user's Age
      user.Age = Age;
    }
  
    res.send(`User with the id ${id} has been updated.`); // Send a response to the client
};

export const getUsers = (req, res) => { // Get all users
    res.send(users);
}
