document.addEventListener('DOMContentLoaded', function(){
    


    const plusButton = document.getElementById('extraField');
    const minusButton = document.getElementById('removeField');
    const extraSection = document.getElementById('extraRow');
    const tableBody = document.querySelector('tbody');

    plusButton.addEventListener('click',function(){
        event.preventDefault();
        const cloned = extraSection.cloneNode(true);  //clonning the row
        const clonedInputs = cloned.querySelectorAll('input[type="text"], input[type="date"]'); //new input field will have no value
        clonedInputs.forEach(function(input) {
            input.value = ''; 
        });
        const clonedButton = cloned.querySelector('.removeField');
        clonedButton.style.display = 'block';
        document.getElementById('inputFields').appendChild(cloned);
        cloned.style.opacity = '1';  //apppending the row with the child of parent conatiner
    });

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('removeField') || event.target.tagName === 'SPAN') {  //id of minus button
            event.preventDefault();
            const rowToRemove = event.target.closest('.education'); //will remove the closest section
            rowToRemove.remove();
        }
    });

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    

    //event listener which is called after clicking submit button

    const form = document.getElementById('submitForm');
    form.addEventListener('submit',function(event){
        event.preventDefault();
        const firstName = document.querySelector('input[name="firstName"]').value;
        const lastName = document.querySelector('input[name="lastName"]').value;
        const dob = document.querySelector('input[name="dob"]').value;
        const email = document.querySelector('input[name="email"]').value;
        const address = document.querySelector('input[name="address"]').value;
        const graduateYear = document.querySelector('input[name="graduateYear"]').value;
    
        //Personal Information

        console.log("First Name:" + firstName);
        console.log("Last Name:" + lastName);
        console.log("Date of Birth:" + dob);
        console.log("Email:" + email);
        console.log("Address:" + address);
        console.log("Graduation Year:" + graduateYear);

        //education form
       
        const degreeInputs = document.querySelectorAll('input[name="degree"]');
        const schoolInputs = document.querySelectorAll('input[name="school"]');
        const startDateInputs = document.querySelectorAll('input[name="startDate"]');
        const passoutYearInputs = document.querySelectorAll('input[name="passoutYear"]');
        const percentageInputs = document.querySelectorAll('input[name="percentage"]');
        const backlogInputs = document.querySelectorAll('input[name="backlog"]');

        const degreeValues = makeInputValueArray(degreeInputs);
        const schoolValues = makeInputValueArray(schoolInputs);
        const startDateValues = makeInputValueArray(startDateInputs);
        const passoutYearValues = makeInputValueArray(passoutYearInputs);
        const percentageValues = makeInputValueArray(percentageInputs);
        const backlogValues = makeInputValueArray(backlogInputs);

        // console values
        console.log('Degree Values:', degreeValues);
        console.log('School Values:', schoolValues);
        console.log('Start Date Values:', startDateValues);
        console.log('Passout Year Values:', passoutYearValues);
        console.log('Percentage Values:', percentageValues);
        console.log('Backlog Values:', backlogValues);

        // table-values
        for (let i = 0; i < degreeValues.length; i++) {
            const newRow = tableBody.insertRow();
            newRow.innerHTML = `
                <td class="dg">${degreeValues[i]}</td>
                <td class="sc">${schoolValues[i]}</td>
                <td class="sd">${startDateValues[i]}</td>
                <td class="py">${passoutYearValues[i]}</td>
                <td class="p">${percentageValues[i]}</td>
                <td class="bv">${backlogValues[i]}</td>
                <td style="background: transparent; outline: none; border:none;">
                <button class="edit-button btn btn-primary" id="edit-button${i}"><i class="fa-solid fa-pen-to-square" id="icon"></i></button>
                <button class="delete-button btn btn-primary" id="delete-button${i}"><i class="fa-solid fa-trash"></i></button>
                </td>

            `;
        }

        // submit the form only if all the required fields are given input style="border: 0px;
        const require = form.querySelectorAll('input[required]');
        let empty = false;

        require.forEach(function(field){
            if(field.value.trip()===''){
                empty = true;
                return;
            }
        })
        if(empty){
            alert('Please fill out all the required fields');
        }
        else{
            form.onsubmit();
        }
    })

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //To edit table row

    const editbtns = document.querySelectorAll('.edit-button');
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('edit-button') || event.target.tagName === 'I') {  //id of minus button
            event.preventDefault();
            const editButton = event.target;
            const row = editButton.closest('tr');
            const cells = row.querySelectorAll('td');
            if (!row.classList.contains('edit-mode')) {
                // Iterate through each cell in the row except the last one
                cells.forEach(function(cell, index) {
                    if (index < cells.length - 1) { // Exclude the last cell with the edit button
                        const cellText = cell.innerText;
                        const inputField = document.createElement('input');
                        inputField.style.width = '8rem';
                        inputField.setAttribute('type', 'text');
                        inputField.setAttribute('value', cellText);
                        cell.innerText = ''; // Clear the cell
                        cell.appendChild(inputField);
                    }
                });
    
                // Add the edit mode class to the row to indicate it is in edit mode
                row.classList.add('edit-mode');
    
                // Hide the edit button
                event.target.closest('.edit-button').style.display = 'none'; 
                
         
    
                // Create and append the save button
                const saveButton = document.createElement('button');
                saveButton.classList.add('save-btn');
                saveButton.classList.add('btn');
                saveButton.classList.add('btn-primary');
                saveButton.innerText = 'Save';
                saveButton.addEventListener('click', function() {
                    cells.forEach(function(cell, index) {
                        if (index < cells.length - 1) { // Exclude the last cell with the edit button
                            const inputValue = cell.querySelector('input').value;
                            cell.innerText = inputValue;
                        }
                    });
                    saveButton.style.display = 'none'; // Hide the save button after saving
                    event.target.closest('.edit-button').style.display = 'inline'; // Show the edit button
                    
                    row.classList.remove('edit-mode'); // Remove the edit mode class from the row
                });
                const saveButtonCell = cells[cells.length - 1]; // Last cell of the row
                saveButtonCell.appendChild(saveButton);// Append the save button to the row
            }
        }
    });
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //To delete a table row

    document.addEventListener('click', function(event){
        if(event.target.classList.contains('delete-button') || event.target.tagName === "I"){
            event.preventDefault();
            const dltbtn = event.target;
            const row  = dltbtn.closest('tr');
            row.remove();
        }
    })

});

//funtion to process multiple values

function makeInputValueArray(inputs) {
    const values = [];
    inputs.forEach(function(input) {
        values.push(input.value);
    });
    return values;
}