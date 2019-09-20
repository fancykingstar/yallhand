import React from "react";

export class SurveyBox extends React.Component {
    render(){
        const style = {
            inner: {
            width: 240,
            height: 150,
            borderRadius: 5,
            backgroundColor: "violet"
            },
            outer: {
                padding: 10,
                margin: 10
            }
        }
        return(
            <div style={style.outer}>
                     <div style={style.inner}/>
            </div>
       
        )
    }
}