import React from "react";
import {Modal} from "semantic-ui-react";

import PostDetails from '../UserPortal/views/components/PostDetails';

export const ContentPreview = (props) => {

    return(
        <Modal open={props.open} closeIcon onClose={()=>props.onClose()}>
            <Modal.Header>Preview</Modal.Header>
            <Modal.Content>
                
            <PostDetails preview data={props.data} update={payload=>{}}/>

            </Modal.Content>
        </Modal>
    )
}