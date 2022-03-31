import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css'
import '../custom.scss'

function Login()
{

    var loginName;
    var loginPassword;
    
    const [message,setMessage] = useState('');

    const app_name = 'asobi-1'
    function buildPath(route)
    {   
        if (process.env.NODE_ENV === 'production') 
        {
            return 'https://' + app_name +  '.herokuapp.com/' + route;
        }
        else
        {        
            return 'http://localhost:5000/' + route;
        }
    }

    const doLogin = async event => 
    {
        event.preventDefault();

        var obj = {login:loginName.value,password:loginPassword.value};
        var js = JSON.stringify(obj);

        try
        {    
            const response = await fetch(buildPath('api/login'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
            
            var res = JSON.parse(await response.text());
            
            if( res.id <= 0 )
            {
                setMessage('User/Password combination incorrect');
            }
            else
            {
                var user = {firstName:res.firstName,lastName:res.lastName,id:res.id}
                localStorage.setItem('user_data', JSON.stringify(user));
                window.location.href = '/profile';
            }
        }
        catch(e)
        {
            console.log(e.toString());
            return;
        }    
    };

    return(
        <>
      {/* <div className="container h-100 p-5" id="loginDiv" >
        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-12 col-md-8 col-lg-6 col-xl-5">
            <Container className="bg-light rounded">
                <div className="mb-md-5 mt-md-4 pb-5">
                    <Form className="mx-5 px-5" onSubmit={doLogin}>
                        <span className="text-black" id="inner-title">PLEASE LOG IN</span><br />
                        
                        <Form.Control onSubmit="event.preventDefault()" autoFocus className="m-2" ref={(c) => loginName = c} type="text" placeholder="Username"/>
                        
                        <Form.Control className="m-2" type="password" ref={(c) => loginPassword = c} placeholder="Password"/>
                        
                        <Button className="m-3" onClick={doLogin}>Login</Button>
                        <Link to="/register">Register</Link>
                    </Form>
                </div>
                <span id="loginResult">{message}</span>
            </Container>
            </div>
        </div>
     </div> */}

<div class="container py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-12 col-md-8 col-lg-6 col-xl-5">
        <div class="card bg-light text-white" style={{borderRadius: "1rem"}}>
          <div class="card-body p-5 text-center">

            <div class="mb-md-5 mt-md-4">

              <h2 class="fw-bold mb-2 text-uppercase">Login</h2>
              <p class="text-white-50 mb-5">Please enter your login and password!</p>

              <form onSubmit={doLogin}>
                <div class="form-outline form-white mb-4">
                    <input type="username" ref={(c) => loginName = c} id="typeEmailX" class="form-control form-control-lg" />
                    <label class="form-label" >Username</label>
                </div>

                <div class="form-outline form-white mb-4">
                    <input type="password" ref={(c) => loginPassword = c} id="typePasswordX" class="form-control form-control-lg" />
                    <label class="form-label">Password</label>
                </div>

                

                <Button class="btn btn-outline-light btn-lg px-5" type="submit">Login</Button>
              </form>
            </div>
            <div>
              <p class="mb-0">Don't have an account? <a href="/register" class="text-white-50 fw-bold">Sign Up</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

     </>
    );
    <div>
        <Container>
            
        </Container>
    </div>
};

export default Login;