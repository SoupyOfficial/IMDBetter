import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import emailjs from 'emailjs-com';

emailjs.init("hEbhp0TDCQpMccQ5c");

function Register()
{

    var login;
    var password;
    var firstName;
    var lastName;
    var email;
    var phoneNumber;
    
    const [message,setMessage] = useState('');

    let bp = require('./Path.js'); 

    const doRegister = async event => 
    {
        event.preventDefault();

        var ID = uuid();

        var obj = {userId:ID,login:login.value,password:password.value,firstName:firstName.value,lastName:lastName.value,email:email.value,phoneNumber:phoneNumber.value};
        var js = JSON.stringify(obj);

        console.log(email.value);
        emailjs.send("service_f0xdcct","template_9zrlzdr",{
            firstName: firstName.value,
            email: email.value,
            code: ID,
            });

        try
        {    
            const response = await fetch(bp.buildPath('api/register'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
            
            var res = JSON.parse(await response.text());

           
            
            if( res.error.length > 0 )
            {
                setMessage("API Error:" + res.error );
            }
            else
            {
                var user = {userId:ID,firstName:firstName.value,lastName:lastName.value}
                console.log(ID)
                localStorage.setItem('user_data', JSON.stringify(user));
                window.location.href = '/profile';
            }
        }
        catch(e)
        {
            setMessage(e.toString());
        }    
    };

    return(
        <>
    <div class="row d-flex justify-content-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
            <div class="card-body bg-light mt-5 py-5 px-md-5" style={{borderRadius: "1rem"}}>
                <h2 class="fw-bold mb-5">Sign up now</h2>
                    <form onSubmit={doRegister}>
                    {/* <!-- 2 column grid layout with text inputs for the first and last names --> */}
                    <div class="row">
                        <div class="col-md-6 mb-4">
                        <div class="form-outline">
                            <input
                                type="text"
                                id="form3Example1"
                                class="form-control"
                                ref={(c) => firstName = c}
                                placeholder="John"
                                />
                            <label class="form-label" for="form3Example1"
                                >First name</label>
                        </div>
                        </div>
                        <div class="col-md-6 mb-4">
                        <div class="form-outline">
                            <input
                                type="text"
                                id="form3Example2"
                                class="form-control"
                                ref={(c) => lastName = c}
                                placeholder="Smith"
                                />
                            <label class="form-label" for="form3Example2"
                                >Last name</label>
                        </div>
                        </div>
                    </div>

                    {/* <!-- Email input --> */}
                    <div class="form-outline mb-4">
                        <input
                            type="email"
                            id="form3Example3"
                            class="form-control"
                            ref={(c) => email = c}
                            placeholder="JohnSmith@email.com"
                            />
                        <label class="form-label" for="form3Example3"
                            >Email address</label>
                    </div>

                    {/* <!-- Username input --> */}
                    <div class="form-outline mb-4">
                        <input
                            type="username"
                            id="form3Example4"
                            class="form-control"
                            ref={(c) => login = c}
                            placeholder="Johnny123"
                            />
                        <label class="form-label" for="form3Example4"
                            >Username</label>
                    </div>

                    {/* <!-- Phone Number input --> */}
                    <div class="form-outline mb-4">
                        <input
                            type="username"
                            id="form3Example4"
                            class="form-control"
                            ref={(c) => phoneNumber = c}
                            placeholder="321-555-5555"
                            />
                        <label class="form-label" for="form3Example4"
                            >Phone Number</label>
                    </div>

                    {/* <!-- Password input --> */}
                    <div class="form-outline mb-4">
                        <input
                            type="password"
                            id="form3Example4"
                            class="form-control"
                            ref={(c) => password = c}
                            placeholder="********"
                            />
                        <label class="form-label" for="form3Example4"
                            >Password</label>
                    </div>

                    {/* <!-- Checkbox --> */}
                    <div class="form-check d-flex justify-content-center mb-4">
                        <input
                            class="form-check-input me-2"
                            type="checkbox"
                            value=""
                            id="form2Example33"
                            checked
                            />
                        <label class="form-check-label" for="form2Example33">
                        Subscribe to our newsletter
                        </label>
                    </div>

                    {/* <!-- Submit button --> */}
                    <button
                            type="submit"
                            id="registerButton"
                            class="btn btn-primary btn-block mb-4"
                            onClick={doRegister}>
                        Sign up
                    </button>
                    <br/>
                    <span id="registerResult">{message}</span>
                    </form>
            </div>
        </div>
    </div>

     </>
    );
};

export default Register;