import React from "react"
import {inject, observer} from "mobx-react"
import {Modal, Button} from "semantic-ui-react"
import {SaysGenerator} from "../SharedCalculations/SaysGenerator"


const says = {0: "absolutely, positively, and most definitely", 1: "confident about pressing the big and scarry red button and", 2: "unconditionally and unquestionably"}
   


export const ConfirmDelete = inject("UIStore")((observer((props) => {
    const {UIStore} = props
    const handleOpen = () => {
        UIStore.set("modal", "confirmDelete", true)
    }
    const handleClose = () => {
       UIStore.set("modal", "confirmDelete", false) 
    }

    const handleClick = () => {
      props.confirm()
      UIStore.set("modal", "confirmDelete", false) 
    }

    const term = props.deleteLabel === undefined ? "Delete" : props.deleteLabel
    const size = props.size === undefined ? "medium" : props.size
    return(
        <Modal
        basic={props.basic === undefined ? false : true}
        open={UIStore.modal.confirmDelete}
        size="small"
        trigger={
          <div style={{ float: "left" }}>
            {" "}
            <Button size={size} basic={props.basic !== undefined} disabled={props.disabled} onClick={e => handleOpen(e)} negative>{term}</Button>
          </div>
        }
      >
        <Modal.Content>
          Are you {says[SaysGenerator(3)]} sure that you want to {term.toLowerCase()} <span style={{fontWeight: 800}}>{props.label}</span>? This cannot be undone 🗑. 
        </Modal.Content>
        <Modal.Actions>
          <Button
            icon="remove circle"
            negative
            content={term}
            onClick={e => handleClick(e)}
          />
            <Button
            content="Cancel"
            onClick={e => handleClose(e)}
          />
        </Modal.Actions>
      </Modal>
    )
    })));
