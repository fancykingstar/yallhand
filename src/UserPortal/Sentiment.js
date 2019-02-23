import React from "react"
import { inject, observer} from "mobx-react"
import { Button, Icon, Transition } from "semantic-ui-react"
import { sentiment } from "../DataExchange/PayloadBuilder"
import { createSentiment } from "../DataExchange/Up"
 
export const Sentiment = inject("UIStore")(observer((props) => {
    const {UIStore} = props

    const handleClick = (val) => {
        UIStore.set("portal", "sentimentComplete", true)
        createSentiment( sentiment(val, props.type, props.ID, props.variationID) )
    }


    

    return(
        <React.Fragment>
              <Transition visible={UIStore.portal.sentimentComplete} animation='fade down' duration={500}>
              <div style={{paddingTop: 5}}><p>👍Thanks for your feedback</p></div>
            </Transition>
           
            <div style={UIStore.portal.sentimentComplete? {display: "none"} : null}>
                    <p style={{color: "#ABACAB",fontSize: ".8em", paddingBottom: 0, marginBottom: 0}}>This makes you feel...</p>
                    <Button.Group>
                    <Button onClick={e => handleClick(2)} icon> <Icon name='smile outline' /> </Button> 
                    <Button onClick={e => handleClick(1)} icon> <Icon name='meh outline' /> </Button> 
                    <Button onClick={e => handleClick(0)} icon> <Icon name='frown outline' /> </Button> 
                    </Button.Group>
                    </div>
      
        </React.Fragment>
    
    )
}))