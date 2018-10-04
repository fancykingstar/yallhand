import React from "react";
import {QLogo} from '../Assets/Graphics/QLogo'
import {Form, Button} from "semantic-ui-react"


import "./style.css";

export const Login = () => {
    return(
 
        <div className="LoginFrame">
        <div className="Login">
        <div className="LoginWorkspace">
        <div style={{float: 'left', paddingLeft: 170, paddingTop: 13, width: 30, position: 'absolute'}}><QLogo/></div>
                <div style={{paddingLeft: 210}}>QUADRANCE</div>
        </div>
        <Form >
       

    <Button fluid circular type='submit' primary>Login</Button>

        </Form>
        </div>
        </div>

    )
}