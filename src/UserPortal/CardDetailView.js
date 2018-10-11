import React from "react"
import "./style.css"
import { inject, observer } from "mobx-react";
import { Item, Header, Container, Divider } from 'semantic-ui-react'
import UTCtoFriendly from '../SharedCalculations/UTCtoFriendly'

@inject("PoliciesStore")
@observer
export class CardDetailView extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {PoliciesStore} = this.props
        const toggledPolicy = this.props.policyID
        const policyData = PoliciesStore.allAnnoucements.filter(policy => policy.policyID === toggledPolicy)[0]
        

        return(
            <div className="Annoucements">
            
             {policyData.img.length !== 0 ?  <div className="imgBox"> <Item.Image size="medium" src={policyData.img}/> </div> : null}
                <div className={policyData.img.length !== 0 ? "contentBox" : "fullcontentBox"}>
                <Container>
                    <Header
                    as="h2"
                    content={policyData.label}
                    subheader={UTCtoFriendly(policyData.updated)}
                  />
                  <p>{policyData.content}</p>
                  </Container>
            
                </div>
                

            </div>

        )
    }
}




