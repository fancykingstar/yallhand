import React from "react";
import { Input as SemanticInput} from "semantic-ui-react";

export const Input = (props) =>  
    <>
    <div style={{marginBottom: 7, marginTop: 0}}> <span>{props.label}</span></div>
    <SemanticInput fluid placeholder={props.placeholder} onChange={props.onChange}/>
    </>