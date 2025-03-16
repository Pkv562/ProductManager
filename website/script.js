document.addEventListener("DOMContentLoaded", () => { // Wait for the page to load
    const addProductBtn = document.getElementById("add-product"); // Get the "Add Product" button
    const modal = document.getElementById("product-modal"); // Get the modal
    const closeBtn = document.querySelector(".close"); // Get the close button
    const submitBtn = document.getElementById("submitProduct"); // Get the submit button
    const showAllBtn = document.getElementById("show-all"); // Get the "Show All" button
    const searchInput = document.getElementById("search"); // Get the search input
    const productList = document.getElementById("product-list"); // Get the product list

    const nameInput = document.getElementById("productName"); // Get the name input
    const descriptionInput = document.getElementById("productDescription"); // Get the description input
    const priceInput = document.getElementById("productPrice"); // Get the price input

    let editingProductId = null; // Variable to store the ID of the product being edited
    let allUsers = [];  // Array to store all users

    async function fetchUsers() { // Function to fetch all users from the server
        try {
            const response = await fetch("http://localhost:5000/users");
            allUsers = await response.json(); 
            updateProductList(allUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    document.getElementById("search").addEventListener("input", (event) => { // Listen for input events on the search input
        const searchQuery = event.target.value.trim().toLowerCase(); // Get the search query and convert it to lowercase
    
        fetch("http://localhost:5000/users") // Fetch all users from the server
            .then(response => response.json()) // Parse the JSON response
            .then(users => {
                const filteredUsers = users.filter(user =>
                    user.id.toString().toLowerCase().includes(searchQuery) || // Check if the ID includes the search query 
                    user.firstName.toLowerCase().includes(searchQuery)  // Check if the name includes the search query
                );
    
                updateProductList(filteredUsers); // Update the product list with the filtered users
            })
            .catch(error => console.error("Error fetching users:", error));
});

    addProductBtn.addEventListener("click", () => { // Listen for click events on the "Add Product" button
        editingProductId = null;
        clearForm();
        modal.style.display = "flex"; // Display the modal
    });

    closeBtn.addEventListener("click", () => { // Listen for click events on the close button
        modal.style.display = "none"; // Hide the modal
    });

    window.addEventListener("click", (event) => { // Listen for click events on the window
        if (event.target === modal) { // If the click event is on the modal
            modal.style.display = "none"; // Hide the modal
        }
    });

    submitBtn.addEventListener("click", async () => { // Listen for click events on the submit button
        const name = nameInput.value.trim(); // Get the value of the name input and remove whitespace
        const description = descriptionInput.value.trim(); // Get the value of the description input and remove whitespace
        const price = priceInput.value.trim(); // Get the value of the price input and remove whitespace

        if (!name && !description && !price) { // If all fields are empty
            alert("Please fill in at least one field.");
            return;
        }

        const userData = {}; // Create an empty object to store user data
        if (name) userData.firstName = name;
        if (description) userData.lastName = description;
        if (price) userData.Age = price;

        try { // Try to add/update the user
            if (editingProductId) {
                await fetch(`http://localhost:5000/users/${editingProductId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
                });
                showSuccessMessage(`User with ID ${editingProductId} updated!`);
            } else { // If no product ID is set, add a new user
                const response = await fetch("http://localhost:5000/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
                });
                const result = await response.text();
                showSuccessMessage(result);
            }
            fetchUsers(); 
        } catch (error) {
            console.error("Error adding/updating user:", error);
        }

        modal.style.display = "none"; // Hide the modal
        clearForm(); // Clear the form fields
    });
 
    showAllBtn.addEventListener("click", fetchUsers); // Listen for click events on the "Show All" button

    function updateProductList(users) { // Function to update the product list with the given users
        productList.innerHTML = ""; 

        users.forEach(user => { // Loop through each user
            const productItem = document.createElement("div");
            productItem.classList.add("product-item");
            productItem.innerHTML = ` 
                <div style="margin-top: 18px;">
                    <strong>ID:</strong> ${user.id} <br>
                    <strong>Name:</strong> ${user.firstName} <br>
                    <strong>Price:</strong> $${user.Age} <br>
                    <strong>Description:</strong> ${user.lastName}
                </div>
                <div>
                    <button class="edit-btn" data-id="${user.id}">Edit</button>
                    <button class="delete-btn" data-id="${user.id}">Delete</button>
                </div>
            `;
            productList.appendChild(productItem); // Append the product item to the product list
        });

        document.querySelectorAll(".delete-btn").forEach(button => { // Listen for click events on the delete buttons
            button.addEventListener("click", async (event) => { // Listen for click events on the delete buttons
                const userId = event.target.getAttribute("data-id"); // Get the ID of the user to delete
                try {
                    await fetch(`http://localhost:5000/users/${userId}`, { method: "DELETE" }); // Delete the user
                    showSuccessMessage(`User with ID ${userId} deleted!`);
                    fetchUsers();
                } catch (error) {
                    console.error("Error deleting user:", error);
                }
            });
        });

        document.querySelectorAll(".edit-btn").forEach(button => { // Listen for click events on the edit buttons
            button.addEventListener("click", async (event) => { // Listen for click events on the edit buttons
                const userId = event.target.getAttribute("data-id");
                editingProductId = userId;

                try {
                    const response = await fetch(`http://localhost:5000/users/${userId}`); // Fetch the user details
                    const user = await response.json(); // Parse the JSON response

                    nameInput.value = user.firstName || "";
                    descriptionInput.value = user.lastName || "";
                    priceInput.value = user.Age || "";

                    modal.style.display = "flex"; // Display the modal
                } catch (error) {
                    console.error("Error fetching user details:", error);
                }
            });
        });
    }

    function showSuccessMessage(message) { // Function to show a success message
        const successMessage = document.createElement("div");
        successMessage.textContent = message;
        successMessage.style.position = "fixed";
        successMessage.style.top = "20px";
        successMessage.style.right = "20px";
        successMessage.style.backgroundColor = "#28a745";
        successMessage.style.color = "#fff";
        successMessage.style.padding = "10px 15px";
        successMessage.style.borderRadius = "5px";
        successMessage.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
        document.body.appendChild(successMessage);

        setTimeout(() => { // Hide the success message after 2 seconds
            successMessage.remove();
        }, 2000);
    }

    function clearForm() { // Function to clear the form fields
        nameInput.value = "";
        descriptionInput.value = "";
        priceInput.value = "";
    }

    fetchUsers(); // Fetch all users when the page loads
});
