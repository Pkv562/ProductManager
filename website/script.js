document.addEventListener("DOMContentLoaded", () => {
    const addProductBtn = document.getElementById("add-product");
    const modal = document.getElementById("product-modal");
    const closeBtn = document.querySelector(".close");
    const submitBtn = document.getElementById("submitProduct");
    const showAllBtn = document.getElementById("show-all");
    const searchInput = document.getElementById("search");
    const productList = document.getElementById("product-list");

    const nameInput = document.getElementById("productName");
    const descriptionInput = document.getElementById("productDescription");
    const priceInput = document.getElementById("productPrice");

    let editingProductId = null; 
    let allUsers = []; 

    async function fetchUsers() {
        try {
            const response = await fetch("http://localhost:5000/users");
            allUsers = await response.json(); 
            updateProductList(allUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    document.getElementById("search").addEventListener("input", (event) => {
        const searchQuery = event.target.value.trim().toLowerCase();
    
        fetch("http://localhost:5000/users")
            .then(response => response.json())
            .then(users => {
                const filteredUsers = users.filter(user =>
                    user.id.toString().toLowerCase().includes(searchQuery) || 
                    user.firstName.toLowerCase().includes(searchQuery) 
                );
    
                updateProductList(filteredUsers);
            })
            .catch(error => console.error("Error fetching users:", error));
});

    addProductBtn.addEventListener("click", () => {
        editingProductId = null;
        clearForm();
        modal.style.display = "flex";
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    submitBtn.addEventListener("click", async () => {
        const name = nameInput.value.trim();
        const description = descriptionInput.value.trim();
        const price = priceInput.value.trim();

        if (!name && !description && !price) {
            alert("Please fill in at least one field.");
            return;
        }

        const userData = {};
        if (name) userData.firstName = name;
        if (description) userData.lastName = description;
        if (price) userData.Age = price;

        try {
            if (editingProductId) {
                await fetch(`http://localhost:5000/users/${editingProductId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
                });
                showSuccessMessage(`User with ID ${editingProductId} updated!`);
            } else {
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

        modal.style.display = "none";
        clearForm();
    });

    showAllBtn.addEventListener("click", fetchUsers);

    function updateProductList(users) {
        productList.innerHTML = ""; 

        users.forEach(user => {
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
            productList.appendChild(productItem);
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", async (event) => {
                const userId = event.target.getAttribute("data-id");
                try {
                    await fetch(`http://localhost:5000/users/${userId}`, { method: "DELETE" });
                    showSuccessMessage(`User with ID ${userId} deleted!`);
                    fetchUsers();
                } catch (error) {
                    console.error("Error deleting user:", error);
                }
            });
        });

        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", async (event) => {
                const userId = event.target.getAttribute("data-id");
                editingProductId = userId;

                try {
                    const response = await fetch(`http://localhost:5000/users/${userId}`);
                    const user = await response.json();

                    nameInput.value = user.firstName || "";
                    descriptionInput.value = user.lastName || "";
                    priceInput.value = user.Age || "";

                    modal.style.display = "flex";
                } catch (error) {
                    console.error("Error fetching user details:", error);
                }
            });
        });
    }

    function showSuccessMessage(message) {
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

        setTimeout(() => {
            successMessage.remove();
        }, 2000);
    }

    function clearForm() {
        nameInput.value = "";
        descriptionInput.value = "";
        priceInput.value = "";
    }

    fetchUsers(); 
});
