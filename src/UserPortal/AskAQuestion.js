import React from "react"
import { inject, observer } from "mobx-react"
import {ItsLog} from "../DataExchange/PayloadBuilder"
import { log } from "../DataExchange/Up"
import { Button, Modal, Header, Icon} from "semantic-ui-react"
import { DraftFormField } from "../SharedUI/DraftFormField"


@inject("UIStore")
@observer
export class AskAQuestion extends React.Component {
    render(){
        const { UIStore } = this.props
    const handleClick = () => {
    //   log(ItsLog(true,{"event": "click", "type":"ask"}))
    UIStore.set("modal", "askQuestion", false) 
    }

    const header =  {"anonymous": "Make an anonymous tip or suggestion", "general": "Ask a general question", "specific": "Ask a question"}[UIStore.ask.type]   

    return(
        <div style={{paddingTop: 10}}>

        <Modal open={UIStore.modal.askQuestion} onClose={() => UIStore.set("modal", "askQuestion", false) }>
            <Modal.Header>{header}</Modal.Header>
            <Modal.Content image>
           
            <Modal.Description>
                {UIStore.ask.type === "specific"? <Header as="h4">Re: {UIStore.ask.content.variations[0].label === ""? UIStore.ask.content.label: UIStore.ask.content.variations[0].label}</Header>: null }
               <DraftFormField
               border
               minimal
               loadContent={null}
               />
               <br/>
               {UIStore.ask.type !== "anonymous"?
            <p>Yallhands will forward this query for you and any replies will come to your email address directly.</p>
            : <p>Yallhands will forward this message without including your contact information.🤫</p>}
            </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
            <Button primary onClick={e => handleClick()}>
                <Icon name='checkmark' /> Submit
            </Button>
            <Button onClick={e => handleClick()}>
                <Icon name='x' /> Cancel
            </Button>
        </Modal.Actions>
        </Modal>

        </div>
    )
}}