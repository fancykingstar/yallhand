import React from 'react'
import { Icon, Label } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import Style from 'style-it';
import './card-style.css'

export const Card = (props) => {
        const adminsAbrev = (admins) => {
            let firstfew = admins.slice(0,3)
            firstfew.push({displayName: "..."})
            return firstfew
        }
        const adminsList = props.data.admins.length > 3 ? adminsAbrev(props.data.admins) : props.data.admins
        const adminLabels = adminsList.map(admin => <Label key={admin.displayName} color='blue' horizontal>{admin.displayName}</Label> )
        let automationstatus = false
        for (let vari in props.data.variations) {
            if (props.data.variations[vari].automation === true) {automationstatus = true}
        } 
        const automationLabel = automationstatus ? <Icon name='sync alternate' color='grey' size='large' /> : <Icon style={{visibility: 'hidden'}}name='sync alternate' color='grey' size='large' />;
        let counts = {"global": 0, "local": 0}
        for (let vari in props.data.variations) {
            counts[props.data.variations[vari].type]++
        }
        const conditions = {
            "ok": {iconName: "check circle", color: 'green'},
            "partial": {iconName: "check circle", color: 'orange'},
            "draft": {iconName: "ellipsis horizontal", color: 'grey'},
            "archived": {iconName: "ellipsis horizontal", color: 'grey'},
            "notOk": {iconName: "warning circle", color: 'red'},
        }
      
        const bgimg = props.data.img
      

        return(
            <div>
            <Style>
                {`
                    .Card:before {
                        background-image: url('${bgimg}'); 
                    }
                `}
            </Style>
           
            <div className="Card">
            
             <Link to={"/panel/manage-policy/" + props.data.policyID} style={{color: "rgb(45, 45, 45)"}}>
                <div className="displayAdjust">
                <div className="Q">Q:</div>
                <div className="Question"><h4>{props.data.label}</h4></div>
                <div className="Owners">{adminLabels}</div>
                <div className="AtmnStatus">{automationLabel}</div>
                <div className="UsageStatus">
                   {counts.global} Global / {counts.local} Teams
                </div>
                <div className="CurrentStatus"><Icon name={conditions[props.data.condition]['iconName']} color={conditions[props.data.condition]['color']} size='large' /></div>
                <div className="Corner"></div>
                </div>
                </Link>
            </div>
            </div>
        )
    
}