import React from 'react';
import Layout from '../../layouts/DefaultLayout';
import {inject, observer} from "mobx-react";

import { Row } from 'reactstrap';

import ImageBox from "../components/ImageBox";
import PostDetails from '../components/PostDetails';
import QuestionAnswer from '../components/QuestionAnswer';
import ContentData from '../../data/content-detail.json';

import {apiCall_noBody }from "../../../DataExchange/Fetch";
import {ItsLog} from "../../../DataExchange/PayloadBuilder";
import {log} from "../../../DataExchange/Up";

// import { AnnouncementsStore } from "../../../Stores/AnnouncementsStore";
// import { PoliciesStore} from "../../../Stores/PoliciesStore";

@inject("AnnouncementsStore", "PoliciesStore", "UserStore")
@observer
class ContentDetail extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         Announcements: [],
         PostData: '',
         qaData: [],
         mode: "",
         sentiment: false
      }
   }
   componentDidMount() {
      const {AnnouncementsStore, PoliciesStore, UserStore} = this.props;
      const urlData = {path:  this.props.match.url, id: this.props.match.params.id}
      const content = urlData.path.includes("announcement")? AnnouncementsStore._getAnnouncement(urlData.id) : PoliciesStore._getPolicy(urlData.id)
      this.setState({
         Announcements: ContentData.suggested,
         PostData: content,
         qaData: ContentData.questionAnswer,
         mode: urlData.path.includes("announcement")? "announcement" : "policy"
      });

      document.body.classList.add('page_content_white');
      document.body.classList.remove('page_content_bg');

         // if(!UserStore.user.isAdmin){ 
      log(ItsLog(false, {"type": this.props.mode, "contentID": this.props.match.params.id, "variationID": content.variations[0].variationID})) 
            // }

      apiCall_noBody(`sentiments/usersentiment/${UserStore.user.userID}/${this.state.mode === "policy"? content.policyID : content.announcementID}/${this.state.mode === "policy"? "policyID":"announcementID"}`, "GET")
      .then(result => this.setState({sentiment: result.length}));
      
      // if(UIStore.portal.viewedContent.includes(content[this.props.mode + "ID"]) === false){
      //    UIStore.set("portal", "viewedContent", [...UIStore.portal.viewedContent, content[this.props.mode + "ID"]])
      //    }
   }

   render() {
      const { PostData, Announcements, qaData, mode, sentiment } = this.state;
      return (
         <Layout>
            <div className="">
               <div className="">
                  <PostDetails post={PostData} mode={mode} sentiment={sentiment} update={(e)=>this.setState(e)}/>
{/* 
                  <div className="page_content_bg">
                     <div className="smallContainer">
                        <QuestionAnswer qaData={qaData} />
                     </div>
                  </div> */}
                  {/* <div className="announcements-wrap">
                     <div className="smallContainer">
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
                  </div> */}


               </div>
            </div>
         </Layout>
      );
   }
}

export default ContentDetail;
