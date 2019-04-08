import React from "react"
import { inject, observer } from "mobx-react"
import {ItsLog} from "../DataExchange/PayloadBuilder"
import { log } from "../DataExchange/Up"
import { Button, Modal, Header, Icon} from "semantic-ui-react"
import { DraftFormField } from "../SharedUI/DraftFormField"
import { sendQuery } from "../DataExchange/Up"


@inject("UIStore", "DataEntryStore", "UserStore", "AccountStore")
@observer
export class AskAQuestion extends React.Component {
    render(){
    const { UIStore, DataEntryStore, UserStore, AccountStore } = this.props
    const handleClick = () => {
    //   log(ItsLog(true,{"event": "click", "type":"ask"}))
    UIStore.set("modal", "askQuestion", false) 
    }

    const header =  {"anonymous": "Make an anonymous tip or suggestion", "general": "Ask a general question", "specific": "Ask a question"}[DataEntryStore.ask.type]   

    const send = () => {
        sendQuery({
            to: AccountStore.account.generalEmail,
            user: UserStore.user,
            type: DataEntryStore.ask.type,
            content: DataEntryStore.ask.type !== "specific"? {"variations": [{"label": ""}]} : DataEntryStore.ask.content,
            message: DataEntryStore.draftContentHTML
        })
        UIStore.set("modal", "askQuestion", false) 
    }



    return(
        <div style={{paddingTop: 10, position: "absolute"}}>

        <Modal open={UIStore.modal.askQuestion} onClose={() => UIStore.set("modal", "askQuestion", false) }>
            <Modal.Header>{header}</Modal.Header>
            <Modal.Content image>
           
            <Modal.Description>
                {DataEntryStore.ask.type === "specific"? <Header as="h4">Re: {DataEntryStore.ask.content.variations[0].label === ""? DataEntryStore.ask.content.label: DataEntryStore.ask.content.variations[0].label}</Header>: null }
               <DraftFormField
               border
               minimal
               loadContent={null}
               />
               <br/>
               {DataEntryStore.ask.type !== "anonymous"?
            <p>Yallhands will forward this query for you and any replies will come to your email address directly.</p>
            : <p>Yallhands will forward this message without including your contact information.🤫</p>}
            </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
            <Button disabled={DataEntryStore.draftContentHTML === "" || DataEntryStore.draftContentHTML === "<p><br></p>"} primary onClick={e => send()}>
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