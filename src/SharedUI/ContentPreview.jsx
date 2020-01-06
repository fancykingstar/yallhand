import React from "react";
import {Modal} from "semantic-ui-react";

import PostDetails from '../UserPortal/views/components/PostDetails';
import QuestionAnswer from '../UserPortal/views/components/QuestionAnswer';

export const ContentPreview = (props) => {

    return(
        <Modal open={props.open} closeIcon onClose={()=>props.onClose()}>
            <Modal.Header>Preview</Modal.Header>
            <Modal.Content>

            <div className="">
               <div className="">
                
                <PostDetails preview data={props.data} update={payload=>{}}/>

           
                  <div className="page_content_bg">
                  {props.data.variations[0].qanda.length? 
                     <div className="smallContainer">
                        <QuestionAnswer qaData={props.data.variations[0].qanda} />
                     </div>:""}
               
                  </div>  
                  
                     {/* <div className="smallContainer">
                        <div className="title-box">More from Announcements</div>
                        <div className="slider_wrap announce_main_box">
                           <Row>{Announcements.map((item, index) => {
                              return <ImageBox
                                 main_class={"col col-sm-4"}
                                 user_img={item.img}
                                 title={item.label}
                                 key={`post-list-key ${index}`} />
                           })}
                           </Row>
                        </div>
                     </div>
                  </div>  */}


               </div>
            </div>
                
            

            </Modal.Content>
        </Modal>
    )
}