// Function that load items asynchronously from JSON data and populate the items list
async function loadItems() {
    try {
        const response = await fetch('models/items.json');
        const data = await response.json();
        populateItems(data);
    } catch (error) {
        console.error("Failed to load items:", error);
        showError("Failed to load items.");
    }
}

// Populate items into the list
function populateItems(data) {
    const itemList = document.getElementById('itemList');
    data.items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.name;
        li.draggable = true;
        li.dataset.id = item.id;
        li.dataset.category = item.category;
        li.ondragstart = drag;
        itemList.appendChild(li);
    });
}

// Function to show error messages
function showError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.style.visibility = 'visible';
    setTimeout(() => {
        errorMessage.style.visibility = 'hidden';
    }, 3000);
}

// Function to allow drop if dragging item over a valid drop area
function allowDrop(event) {
    event.preventDefault();
    const containerType = event.currentTarget.dataset.type;
    const itemCategory = event.dataTransfer.getData("category");
    if (containerType === itemCategory) {
        event.currentTarget.classList.add("dragover");
    }
}

// Function to remove dragover class when leaving a drop area
function dragLeave(event) {
    event.currentTarget.classList.remove("dragover");
}

// Function that handles drag event and temporarily mark item for moving
function drag(event) {
    event.dataTransfer.setData("text", event.target.textContent);
    event.dataTransfer.setData("category", event.target.dataset.category);
    event.target.classList.add('dragging'); // mark element as being dragged
}

// Function that asyncronously handles drop event with validation and single-drop restriction
async function drop(event) {
    event.preventDefault();
    const containerType = event.currentTarget.dataset.type;
    const itemName = event.dataTransfer.getData("text");
    const itemCategory = event.dataTransfer.getData("Category");
    const itemId = event.dataTransfer.getData("id");

    // Validate/check if the drop is valid into the correct container
    if (containerType === itemCategory) {
        // Find and remove the dragged item from the list
        const draggedItem = document.querySelector(`.list li.dragging`);
        if (draggedItem) {
            draggedItem.remove(); // Remove from the original list

            // Add the item to the drop container
            const li = document.createElement("li");
            li.textContent = itemName;
            event.currentTarget.querySelector("ul").appendChild(li);
        }
    } else {
        // If drop is invalid, show error message
        showError(`Dropping a ${itemCategory} into the ${containerType} container is not allowed!`);
    }
    event.currentTarget.classList.remove("dragover");
}

// Remove 'dragging' class after drag ends
document.addEventListener('dragend', () => {
    const draggedItem = document.querySelector('.list li.dragging');
    if (draggedItem) {
        draggedItem.classList.remove('dragging');
    }
});

// Load items on page load
document.addEventListener('DOMContentLoaded', loadItems);
