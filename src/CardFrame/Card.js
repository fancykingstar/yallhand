import React from 'react'
import { Icon, Label } from 'semantic-ui-react';
import './card-style.css'
import {withRouter} from "react-router-dom"
import {inject, observer} from "mobx-react"
import { AccountStore } from '../Stores/AccountStore';
import {adminsAbrev} from "../SharedCalculations/AdminsAbbrev"
import { UIStore } from '../Stores/UIStore';

const Card = inject("DataEntryStore", "PoliciesStore", "AccountStore")(observer((props) => {
        const {DataEntryStore} = props
        const {PoliciesStore} = props
        if(!props.data.admins) return <div/>
        const adminsList = props.data.admins.length > 3 ? adminsAbrev(props.data.admins) : props.data.admins
        const adminLabels = adminsList.map(admin => <Label 
            key={AccountStore._getDisplayName(admin)} color='blue' horizontal
            >
            {AccountStore._getDisplayName(admin)}
            </Label> )
        let automationstatus = false
        const automationLabel = automationstatus ? <Icon name='sync alternate' color='grey' size='large' /> : <Icon style={{visibility: 'hidden'}}name='sync alternate' color='grey' size='large' />;
        let counts = {"global": 0, "local": 0}
        props.data.variations.forEach(vari => {
            vari.teamID === 'global' ? counts["global"]++ : counts["local"]++ 
        })
        const conditions = {
            "ok": {iconName: "check circle", color: 'green'},
            "partial": {iconName: "check circle", color: 'orange'},
            "draft": {iconName: "ellipsis horizontal", color: 'grey'},
            "archived": {iconName: "ellipsis horizontal", color: 'grey'},
            "notOk": {iconName: "warning circle", color: 'red'},
        }
      
        const bgimg = props.img

        const handleClick = (e) => {
            e.preventDefault()
            UIStore.set("content", "policyID", props.data.policyID)
            UIStore.set("content", "variationID", PoliciesStore._toggleGlobalVariation(props.data.policyID))
            DataEntryStore.set("contentmgmt", "label", props.data.label)
            DataEntryStore.set("contentmgmt", "img", props.data.img)
            DataEntryStore.set("contentmgmt", "bundle", "queue")
            DataEntryStore.set("contentmgmt", "keywords", props.data.keywords)
            DataEntryStore.set("contentmgmt", "reviewAlert", props.data.reviewAlert)
            props.history.push("/panel/faqs/manage-policy/" + props.data.policyID)
        }

        return(
            
            <div className="CardContainerbg" style={{backgroundImage: `url(${bgimg})`, backgroundPosition: 'center', backgroundSize: 'cover'}}>
            <div className="CardContaineralpha"></div>
            <div className="Card" onClick={e => handleClick(e)}> 
                <div className="displayAdjust">
                <div className="Q">Q:</div>
                <div className="Question"><h4>{props.data.label}</h4></div>
                <div className="Owners">{adminLabels}</div>
                <div className="AtmnStatus">{automationLabel}</div>
                <div className="UsageStatus">
                   {counts.global} Global / {counts.local} Teams
                </div>
                <div className="CurrentStatus">
                {/* <Icon name={conditions[props.data.state]['iconName']} color={conditions[props.data.state]['color']} size='large' /> */}
                </div>
                <div className="Corner"></div>
               
                </div>
            </div>
            </div>
          
        )
    
}))
export default withRouter(Card)