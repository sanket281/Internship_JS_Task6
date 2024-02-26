document.addEventListener("DOMContentLoaded", function () {
    const plusButton = document.getElementById("extraField");
    const minusButton = document.getElementById("removeField");
    const extraSection = document.getElementById("extraRow");
    const tableBody = document.querySelector("tbody");

    plusButton.addEventListener("click", function () {
        event.preventDefault();
        const cloned = extraSection.cloneNode(true); //clonning the row
        const clonedInputs = cloned.querySelectorAll(
            'input[type="text"], input[type="date"]'
        ); //new input field will have no value
        clonedInputs.forEach(function (input) {
            input.value = "";
        });
        const clonedButton = cloned.querySelector(".removeField");
        clonedButton.style.display = "block";
        document.getElementById("inputFields").appendChild(cloned);
        cloned.style.opacity = "1"; //apppending the row with the child of parent conatiner
    });

    document.addEventListener("click", function (event) {
        if (
            event.target.classList.contains("removeField") ||
            event.target.tagName === "SPAN"
        ) {
            //id of minus button
            event.preventDefault();
            const rowToRemove = event.target.closest(".education"); //will remove the closest section
            rowToRemove.remove();
        }
    });

    let storedData = [];
 

    // Add event listener for the form submission
    const form = document.getElementById("submitForm");
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Check if the form is for adding or editing
        const isEditing = form.classList.contains("editing-mode");

        if (!isEditing) {
            // Handle form submission for adding new entries
            handleFormSubmitForAdding();
        } else {
            // Handle form submission for editing existing entries
            handleFormSubmitForEditing(event);
        }
    });

    // Function to handle form submission for adding new entries
    function handleFormSubmitForAdding(event) {
        // event.preventDefault();
        const firstName = document.querySelector('input[name="firstName"]').value;
        const lastName = document.querySelector('input[name="lastName"]').value;
        const dob = document.querySelector('input[name="dob"]').value;
        const email = document.querySelector('input[name="email"]').value;
        const address = document.querySelector('input[name="address"]').value;
        const graduateYear = document.querySelector('input[name="graduateYear"]').value;

        //education form
        const degreeInputs = document.querySelectorAll('input[name="degree"]');
        const schoolInputs = document.querySelectorAll('input[name="school"]');
        const startDateInputs = document.querySelectorAll(
            'input[name="startDate"]'
        );
        const passoutYearInputs = document.querySelectorAll(
            'input[name="passoutYear"]'
        );
        const percentageInputs = document.querySelectorAll(
            'input[name="percentage"]'
        );
        const backlogInputs = document.querySelectorAll('input[name="backlog"]');

        const educationData = [];
        for (let i = 0; i < degreeInputs.length; i++) {
            const educationItem = {
                degree: degreeInputs[i].value,
                school: schoolInputs[i].value,
                startDate: startDateInputs[i].value,
                passoutYear: passoutYearInputs[i].value,
                percentage: percentageInputs[i].value,
                backlog: backlogInputs[i].value,
            };
            educationData.push(educationItem);
        }

        const formData = {
            firstName: firstName,
            lastName: lastName,
            dob: dob,
            email: email,
            address: address,
            graduateYear: graduateYear,
            education: educationData,
        };

        storedData.push(formData);

        console.log(storedData);

        populateTable();

        const require = form.querySelectorAll("input[required]");
        let empty = false;

        require.forEach(function (field) {
            if (field.value.trip() === "") {
                empty = true;
                return;
            }
        });

        if (empty) {
            alert("Please fill out all the required fields");
        }

        // Close the Bootstrap modal using jQuery
        $('#exampleModal').modal('hide');
    }

    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("edit-button") || event.target.tagName === "I") {
        
            const editButton = event.target.closest(".edit-button");

            if (editButton) {
                // Set the form to editing mode
                form.classList.add("editing-mode");
    
                // Retrieve the index from the data-index attribute of the clicked edit button
                const index = parseInt(editButton.getAttribute("data-index"));
    
                // Retrieve the data of the item to be edited from storedData array
                const itemToEdit = storedData[index];
    
                // Populate the input fields in the edit form with the data of the item to be edited
                document.querySelector('input[name="firstName"]').value = itemToEdit.firstName;
                document.querySelector('input[name="lastName"]').value = itemToEdit.lastName;
                document.querySelector('input[name="dob"]').value = itemToEdit.dob;
                document.querySelector('input[name="email"]').value = itemToEdit.email;
                document.querySelector('input[name="address"]').value = itemToEdit.address;
                document.querySelector('input[name="graduateYear"]').value = itemToEdit.graduateYear;
    
                // Pass the index to the form submission handler
                form.setAttribute("data-index", index);
            }
        }
    });
    // Function to handle form submission for editing existing entries
    function handleFormSubmitForEditing(event) {
        // Retrieve the index from the form data attribute
        const index = parseInt(form.getAttribute("data-index"));
        console.log(index)

        storedData[index] = {
            firstName: document.querySelector('input[name="firstName"]').value,
            lastName: document.querySelector('input[name="lastName"]').value,
            dob: document.querySelector('input[name="dob"]').value,
            email: document.querySelector('input[name="email"]').value,
            address: document.querySelector('input[name="address"]').value,
            graduateYear: document.querySelector('input[name="graduateYear"]').value,
        };

        populateTable();
        form.classList.remove("editing-mode");
        console.log(storedData);

        // Close the Bootstrap modal using jQuery
         $('#exampleModal').modal('hide');
       
    }

    // Function to populate table
    function populateTable() {
        // Clear existing table rows
        tableBody.innerHTML = "";

        // Iterate over storedData array
        storedData.forEach((person) => {
            // Extract personal information
            const { firstName, lastName, dob, email, address, graduateYear } = person;

            // Insert a new row into the table for each person
            const newRow = tableBody.insertRow();
            newRow.innerHTML = `
                <td class="fn">${firstName}</td>
                <td class="ln">${lastName}</td>
                <td class="dob">${dob}</td>
                <td class="mail">${email}</td>
                <td class="addr">${address}</td>
                <td class="gy">${graduateYear}</td>
                <td style="background: transparent; outline: none; border:none;">
                    <button class="edit-button btn btn-primary" data-index="${storedData.indexOf(person)}" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-pen-to-square" id="icon"></i></button>   
                    <button class="delete-button btn btn-red" data-index="${storedData.indexOf(person)}"><i class="fa-solid fa-trash delete-button"></i></button>   
                </td>
            `;
        });
    }

    document.addEventListener('click',function(event){
        if(event.target.classList.contains('delete-button'))
        {
        // Ask for confirmation before deleting
        const confirmation = confirm('Are you sure you want to delete this entry?');
        console.log(confirmation)
        // If the user confirms the deletion, proceed with deletion
        if (confirmation) {
            const index = parseInt(event.target.getAttribute('data-index'));
            storedData.splice(index, 1);
            populateTable();
            console.log(storedData);
        }
        }
    })

})

//funtion to process multiple values

function makeInputValueArray(inputs) {
    const values = [];
    inputs.forEach(function (input) {
        values.push(input.value);
    });
    return values;
}

//function to validate input
function validateInput(inputValue,event, condition, errorMeassage)
{
    const parentElement = event.target.parentNode;
    if(!condition(inputValue))
    {
        parentElement.style.borderColor = 'red';

        //display the error message
        const errorElement = document.createElement('span');
        errorElement.textContent = errorMeassage;
        errorElement.style.color = 'red';

        //add error message below input field
        parentElement.appendChild(errorElement);
    }
    else
    {
        parentElement.style.borderColor = '';
        const errorElement = parentElement.querySelector('span');
        if(errorElement)
        {
            parentElement.removeChild(errorElement);
        }
    }
}

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//     //To edit table row

//     const editbtns = document.querySelectorAll('.edit-button');
//     document.addEventListener('click', function(event) {
//         if (event.target.classList.contains('edit-button') || event.target.tagName === 'I') {  //id of minus button
//             event.preventDefault();
//             const editButton = event.target;
//             const row = editButton.closest('tr');
//             const cells = row.querySelectorAll('td');
//             if (!row.classList.contains('edit-mode')) {
//                 // To make input fields inside the table cells of the row
//                 // Iterate through each cell in the row except the last one
//                 cells.forEach(function(cell, index) {
//                     if (index < cells.length - 1) { // Exclude the last cell with the edit button
//                         const cellText = cell.innerText;
//                         const inputField = document.createElement('input');
//                         inputField.style.width = '8rem';
//                         inputField.setAttribute('type', 'text');
//                         inputField.setAttribute('value', cellText);
//                         cell.innerText = ''; // Clear the cell
//                         cell.appendChild(inputField);
//                     }
//                 });

//                 //Add the edit mode class to the row to indicate it is in edit mode
//                 row.classList.add('edit-mode');

//                 //Hide the edit button
//                 event.target.closest('.edit-button').style.display = 'none';

//                 // Create and append the save button
//                 const saveButton = document.createElement('button');
//                 saveButton.classList.add('save-btn');
//                 saveButton.classList.add('btn');
//                 saveButton.classList.add('btn-primary');
//                 saveButton.innerText = 'Save';
//                 //Finally saving the values from input fields into the table row(cells)
//                 saveButton.addEventListener('click', function() {
//                     cells.forEach(function(cell, index) {
//                         if (index < cells.length - 1) { // Exclude the last cell with the edit button
//                             const inputValue = cell.querySelector('input').value;
//                             cell.innerText = inputValue;
//                         }
//                     });
//                     saveButton.style.display = 'none'; // Hide the save button after saving
//                     event.target.closest('.edit-button').style.display = 'inline'; // Show the edit button

//                     row.classList.remove('edit-mode'); // Remove the edit mode class from the row
//                 });
//                 const saveButtonCell = cells[cells.length - 1]; // Last cell of the row
//                 saveButtonCell.appendChild(saveButton);// Append the save button to the row
//             }
//         }
//     });
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//     //To delete a table row

// <td style="background: transparent; outline: none; border:none;">
// <button class="edit-button btn btn-primary" id="edit-button${i}"><i class="fa-solid fa-pen-to-square" id="icon"></i></button>
// <button class="delete-button btn btn-primary" id="delete-button${i}"><i class="fa-solid fa-trash"></i></button>
// </td>

// <button class="delete-button btn btn-primary" data-index="${storedData.indexOf(person)}"><i class="fa-solid fa-trash"></i></button>
