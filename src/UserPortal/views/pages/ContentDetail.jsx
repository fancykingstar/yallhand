import React from 'react';
import Layout from '../../layouts/DefaultLayout';
import { inject, observer } from "mobx-react";

import { Row } from 'reactstrap';

import ImageBox from "../components/ImageBox";
import PostDetails from '../components/PostDetails';
import QuestionAnswer from '../components/QuestionAnswer';
import ContentData from '../../data/content-detail.json';

import {apiCall_noBody }from "../../../DataExchange/Fetch";
import {ItsLog} from "../../../DataExchange/PayloadBuilder";
import {log} from "../../../DataExchange/Up";


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

   updatePost = (payload) => this.setState(payload);

   async load() {
      const {AnnouncementsStore, PoliciesStore} = this.props;
      const urlData = await {path:  this.props.match.url, id: this.props.match.params.id};
      const mode = await urlData.path.includes("announcement")? "announcement" : "policy";
      const content = await urlData.path.includes("announcement")? AnnouncementsStore._getAnnouncement(urlData.id) : PoliciesStore._getPolicy(urlData.id)
      await this.setState(content);
      return await this.setState({
         PostData: content,
         qaData: ContentData.questionAnswer,
         contentID: content[`${mode}ID`],
         mode
      });
   }

   componentDidMount() {
      const {AnnouncementsStore, PoliciesStore, UserStore} = this.props;
      this.load()
      .then(r => {
         apiCall_noBody(
            `sentiments/usersentiment/${UserStore.user.userID}/${this.state.contentID}/${this.state.mode}ID`, "GET")
            .then(result => {
               this.setState({sentiment: Boolean(result.length)})});
               if(!UserStore.user.isAdmin){ 
                  log(ItsLog(false, {"type": this.state.mode, "contentID": this.state.contentID, "variationID": this.state.PostData.variations[0].variationID})) 
                     }
            });

      document.body.classList.add('page_content_white');
      document.body.classList.remove('page_content_bg');

         


      
      // if(UIStore.portal.viewedContent.includes(content[this.props.mode + "ID"]) === false){
      //    UIStore.set("portal", "viewedContent", [...UIStore.portal.viewedContent, content[this.props.mode + "ID"]])
      //    }
   }

   render() {
      const { PostData } = this.state;
      return (
         <Layout>
            <div className="">
               <div className="">
                  {PostData ? (<PostDetails data={this.state} update={payload=>this.updatePost(payload)}/>) : ("")}
             
                  {/* <div className="page_content_bg">
                     <div className="smallContainer">
                        <QuestionAnswer qaData={this.state.qaData} />
                     </div>
                  </div>  */}
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
