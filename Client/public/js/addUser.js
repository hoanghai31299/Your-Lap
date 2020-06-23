const regForm = document.querySelector('form#registerUser');
const errors_el = document.querySelector('form#registerUser .errors');

regForm.addEventListener('submit', validateRegisterForm);

function validateRegisterForm (e) {
    e.preventDefault();
    
    const cusIDUser = document.querySelector('#registerUser #cusIDUser');
    const cusNameUser = document.querySelector('#registerUser #cusNameUser');
    const phoneNumberUser = document.querySelector('#registerUser #phoneNumberUser');
    const addUser = document.querySelector('#registerUser #addUser');
    const dateRegister = document.querySelector('#registerUser #dateRegister');
    
    let errors = [];
 
    const email_reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const pass_reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    const num_reg= /^([0-9])/;
    
    if (cusIDUser.value == "") {
        errors.push({text: "Customer ID", el: cusIDUser});
    }
    
    if (cusNameUser.value == "") {
        errors.push({text: "customer name", el: cusNameUser});
    }

    if (phoneNumberUser.value == "") {
        errors.push({text: "phone number", el: phoneNumberUser});
    }

    if (addUser.value == "") {
        errors.push({text: "user address", el: addUser});
    }

    if (dateRegister.value == "") {
        errors.push({text: "date register", el: dateRegister});
    }
    
    if (errors.length > 0) {
        handle_errors(errors);
        return false;
    }
    
    alert('SUBMITTED');
        return true;
    }

    function handle_errors(errs) {
        let str = "You have not filled with the following fields: ";    
        errs.map((er) => {
        er.el.classList.add('error');
        str += er.text + ", ";
        });
    
        errs[0].el.focus();
        
        let error_el = document.createElement('div');
        error_el.classList.add('error');
        error_el.innerText = str;
        
        error_el.addEventListener('click', function () {
            errors_el.removeChild(error_el);
        });
        
        errors_el.appendChild(error_el);
    }