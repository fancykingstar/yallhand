import React, {useState}from "react"
import {inject, observer} from "mobx-react"
import {Modal, Button} from "semantic-ui-react"



export const ConfirmDelete = inject("UIStore")((observer((props) => {

    const [isopen, notOpened] = useState(false);

    const toggleOpen = () => {
      notOpened(!isopen)
    };


    const term = props.deleteLabel === undefined ? "Delete" : props.deleteLabel;
    const size = props.size === undefined ? "medium" : props.size;

    return(
        <Modal
        basic={props.basic === undefined ? false : true}
        open={isopen}
        size="small"
        trigger={

          
        <Button size={size} basic={props.basic !== undefined} disabled={props.disabled} onClick={toggleOpen} >{term}</Button>
     
        }
      >
        <Modal.Content>
          Are you absolutely sure that you want to {term.toLowerCase()} this  <span style={{fontWeight: 800}}>{props.label}</span>? This cannot be undone 🗑. 
        </Modal.Content>
        <Modal.Actions>
          <Button
            icon="remove circle"
            negative
            content={term}
            onClick={toggleOpen}
          />
            <Button
            content="Cancel"
            onClick={toggleOpen}
          />
        </Modal.Actions>
      </Modal>
    )
    })));
