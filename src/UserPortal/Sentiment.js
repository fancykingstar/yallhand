import React from "react"
import { inject, observer} from "mobx-react"
import { Button, Icon, Transition } from "semantic-ui-react"
import { sentiment } from "../DataExchange/PayloadBuilder"
import { createSentiment } from "../DataExchange/Up"
 
export const Sentiment = inject("UIStore", "AccountStore", "UserStore")(observer((props) => {
    const {UIStore, AccountStore, UserStore} = props

    const handleClick = (val) => {
        UIStore.set("portal", "sentimentComplete", true)
        // if(!UserStore.user.isAdmin){
            createSentiment( sentiment(val, props.type, props.ID, props.variationID) ).then(r =>  r.json().then(data => AccountStore.loadSentiments([...AccountStore.sentiments, ...[data]])))
        // }

    }


    

    return(
        <React.Fragment>
              <Transition visible={UIStore.portal.sentimentComplete} animation='fade down' duration={500}>
              <div style={{paddingTop: 5}}><p>👍Thanks for your feedback</p></div>
            </Transition>
           
            <div style={UIStore.portal.sentimentComplete? {display: "none"} : {marginTop: -10}}>
                    <p style={{color: "#ABACAB",fontSize: ".1.2em", paddingBottom: 0, marginBottom: 0}}>This makes you feel...</p>
                    <Button.Group>
                    <Button  onClick={e => handleClick(2)} icon> <Icon name='smile outline' size="large"/> </Button> 
                    <Button  onClick={e => handleClick(1)} icon> <Icon name='meh outline' size="large" /> </Button> 
                    <Button  onClick={e => handleClick(0)} icon> <Icon name='frown outline' size="large" /> </Button> 
                    </Button.Group>
                    </div>
      
        </React.Fragment>
    
    )
}))