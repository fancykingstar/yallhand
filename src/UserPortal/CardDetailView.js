import React from "react"
import "./style.css"
import { inject, observer } from "mobx-react";
import {  Header, Container, Image } from 'semantic-ui-react'
import UTCtoFriendly from '../SharedCalculations/UTCtoFriendly'

@inject("PoliciesStore")
@observer
export class CardDetailView extends React.Component {
    render() {
        const {PoliciesStore} = this.props
        const toggledPolicy = this.props.policyID
        const policyData = PoliciesStore.allPolicies.filter(policy => policy.policyID === toggledPolicy)[0]
        
        return(
            <div className="Annoucements">
            
             
               
                <Container>
                {policyData.img.length !== 0 ?  <Image size="medium" src={policyData.img}/> : null}
                    <Header
                    as="h2"
                    content={policyData.label}
                    subheader={UTCtoFriendly(policyData.updated)}
                  />
                  <p>{policyData.variations.content.blocks[0].text}</p>
                  </Container>
            
                </div>
                

       

        )
    }
}




