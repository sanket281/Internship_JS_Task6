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

    //array to store personal and education data
    let storedData = [];
    let submit = true;
 
    // Add event listener for the form submission
    const form = document.getElementById("submitForm");
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Check if the form is for adding or editing
        const isEditing = form.classList.contains("editing-mode");

        if (!isEditing) {
            // Handle form submission for adding new entries
            handleFormSubmitForAdding(event);
        } else {
            // Handle form submission for editing existing entries
            handleFormSubmitForEditing(event);
        }
    });

    // Function to handle form submission for adding new entries
    function handleFormSubmitForAdding(event) {
        resetBorderColors()
        event.preventDefault();
        const firstName = document.querySelector('input[name="firstName"]').value;
        const lastName = document.querySelector('input[name="lastName"]').value;
        const dob = document.querySelector('input[name="dob"]').value;
        
        const email = document.querySelector('input[name="email"]').value;
        const address = document.querySelector('textarea[name="address"]').value;
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

        percentageInputs.forEach(percentageInput => {
            const percentage = parseInt(percentageInput.value);
           
            // Check if the percentage is between 1 and 100
            if (percentage > 100 || percentage<33) {
                alert('backlog should be between 33 to 100')
                percentageInput.style.borderColor = 'red';
                const error = document.createElement('SPAN');
                error.innerText = "backlog should be between 33 to 100";
                error.style.color = 'red';
                percentageInput.parentNode.appendChild(error);
                // Set a timeout to remove the error message after a certain period
                setTimeout(() => {
                    percentageInput.style.border = ''; // Reset border color
                    percentageInput.parentNode.removeChild(error); // Remove the error span
                }, 3000); // Remove the error after 3 seconds (adjust as needed) 
                preventSubmission = true;
                
            } else {
                percentageInput.style.borderColor = '';
            }
        });

       

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

        if(submit===true)
        {
            storedData.push(formData);
    
            console.log(storedData);
    
            populateTable();
        }
        else
        {
            alert('Fill all the details correctly')
            return;
        }

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

    //common error span for all the inputs
    let error = document.createElement('SPAN');
    error.style.color = 'red';

    //event listener for Date of Berth field
    const dobInput = document.querySelector('input[name="dob"]');
    dobInput.addEventListener('change',function(){
        const dobValue = dobInput.value;
        const dobDate = new Date(dobValue);
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const monthDiff = today.getMonth() - dobDate.getMonth();
        
        // If the birthday hasn't occurred yet this year, subtract one year
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
            age--;
        }
        
        // Check if the age is greater than or equal to 18
        if (age < 18 || age=='') {
            
            
            // Display an alert message indicating that the age must be 18 or older
            dobInput.style.border = '2px solid red';
            error.innerText = "Age should be greater than 18";
            if (!dobInput.parentNode.contains(error)) {
                dobInput.parentNode.appendChild(error);
            }           
             // alert('You must be at least 18 years old to submit this form.');
            // // Set a timeout to remove the error message after a certain period
            // setTimeout(() => {
            //     dobInput.style.border = ''; // Reset border color
            //     dobInput.parentNode.removeChild(error); // Remove the error span
            // }, 3000); // Remove the error after 3 seconds (adjust as needed)
            // return;
            submit=false; 
        }
        else
        {
            dobInput.style.border = '';
            if (dobInput.parentNode.contains(error)) {
                dobInput.parentNode.removeChild(error);
            }
            submit=true;
        }
        
    })

    //event listner for passout year
    const passoutYearInputs = document.querySelectorAll('input[name="passoutYear"]');
    passoutYearInputs.forEach(passoutYearInput=>{
        passoutYearInput.addEventListener('change',function(){
            // Check if the passout year is greater than the start date
            const passoutYear = parseInt(passoutYearInput.value); 
            const startDate = parseInt(document.querySelector('input[name="startDate"]').value);
    
            console.log(startDate)
              if (passoutYear <= startDate) {
                passoutYearInput.style.borderColor = 'red';
                error.innerText = "Passout year must be greater than the start date";     
                if (!passoutYearInput.parentNode.contains(error)) {
                    passoutYearInput.parentNode.appendChild(error);
                }           
                // // Set a timeout to remove the error message after a certain period
                // setTimeout(() => {
                //     passoutYearInput.style.border = ''; // Reset border color
                //     passoutYearInput.parentNode.removeChild(error); // Remove the error span
                // }, 3000); // Remove the error after 3 seconds (adjust as needed) 
                // preventSubmission = true;
                submit = false;
                
            } else {
                passoutYearInput.style.borderColor = '';
                if (passoutYearInput.parentNode.contains(error)) {
                    passoutYearInput.parentNode.removeChild(error);
                }
                submit = true;
            }
        })
    })

    //event listner for backlog value
    const backlogInputs = document.querySelectorAll('input[name="backlog"]');
    backlogInputs.forEach(backlogInput=>{
        backlogInput.addEventListener('change',function(){
            // Check if the passout year is greater than the start date
            const backlogValue = parseInt(backlogInput.value); 

              if (backlogValue>20 || backlogValue<0) {
                backlogInput.style.borderColor = 'red';
                error.innerText = "Backlog value must be between 0 and 20";     
                if (!backlogInput.parentNode.contains(error)) {
                    backlogInput.parentNode.appendChild(error);
                }           
                // // Set a timeout to remove the error message after a certain period
                // setTimeout(() => {
                //     passoutYearInput.style.border = ''; // Reset border color
                //     passoutYearInput.parentNode.removeChild(error); // Remove the error span
                // }, 3000); // Remove the error after 3 seconds (adjust as needed) 
                // preventSubmission = true;
                submit = false;
                
            } else {
                backlogInput.style.borderColor = '';
                if (backlogInput.parentNode.contains(error)) {
                    backlogInput.parentNode.removeChild(error);
                }
                submit = true;
            }
        })
    })    

        //event listner for percentage value
        const percentageInputs = document.querySelectorAll('input[name="percentage"]');
        percentageInputs.forEach(percentageInput=>{
            percentageInput.addEventListener('change',function(){
                // Check if the passout year is greater than the start date
                const percentageValue = parseInt(percentageInput.value); 
    
                  if (percentageValue>100 || percentageValue<33) {
                    percentageInput.style.borderColor = 'red';
                    error.innerText = "percentage value must be between 33 and 100";     
                    if (!percentageInput.parentNode.contains(error)) {
                        percentageInput.parentNode.appendChild(error);
                    }           
                    // // Set a timeout to remove the error message after a certain period
                    // setTimeout(() => {
                    //     passoutYearInput.style.border = ''; // Reset border color
                    //     passoutYearInput.parentNode.removeChild(error); // Remove the error span
                    // }, 3000); // Remove the error after 3 seconds (adjust as needed) 
                    // preventSubmission = true;
                    submit = false;
                    
                } else {
                    percentageInput.style.borderColor = '';
                    if (percentageInput.parentNode.contains(error)) {
                        percentageInput.parentNode.removeChild(error);
                    }
                    submit = true;
                }
            })
        }) 

    //event listener to edit button
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
                document.querySelector('textarea[name="address"]').value = itemToEdit.address;
                document.querySelector('input[name="graduateYear"]').value = itemToEdit.graduateYear;
    
                // Pass the index to the form submission handler
                form.setAttribute("data-index", index);
            }
        }
    });

    // Function to handle form submission for editing existing entries
    function handleFormSubmitForEditing(event) {
        resetBorderColors()
        // Retrieve the index from the form data attribute
        const index = parseInt(form.getAttribute("data-index"));
        console.log(index)

        storedData[index] = {
            firstName: document.querySelector('input[name="firstName"]').value,
            lastName: document.querySelector('input[name="lastName"]').value,
            dob: document.querySelector('input[name="dob"]').value,
            email: document.querySelector('input[name="email"]').value,
            address: document.querySelector('textarea[name="address"]').value,
            graduateYear: document.querySelector('input[name="graduateYear"]').value,
            education: []
        };

        // Retrieve education data
        const degreeInputs = document.querySelectorAll('input[name="degree"]');
        const schoolInputs = document.querySelectorAll('input[name="school"]');
        const startDateInputs = document.querySelectorAll('input[name="startDate"]');
        const passoutYearInputs = document.querySelectorAll('input[name="passoutYear"]');
        const percentageInputs = document.querySelectorAll('input[name="percentage"]');
        const backlogInputs = document.querySelectorAll('input[name="backlog"]');

        for (let i = 0; i < degreeInputs.length; i++) {
            const educationItem = {
                degree: degreeInputs[i].value,
                school: schoolInputs[i].value,
                startDate: startDateInputs[i].value,
                passoutYear: passoutYearInputs[i].value,
                percentage: percentageInputs[i].value,
                backlog: backlogInputs[i].value,
            };
            storedData[index].education.push(educationItem);
        }

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

    //function to reset border
    function resetBorderColors() {
        const allInputs = document.querySelectorAll('input');
        allInputs.forEach(input => {
            input.style.borderColor = ''; // Reset border color
        });
    }

    //function to delete single person data
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

