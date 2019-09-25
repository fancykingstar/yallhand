import React from 'react';
import Layout from '../../layouts/DefaultLayout';

import { Row } from 'reactstrap';

import ImageBox from "../components/ImageBox";
import PostDetails from '../components/PostDetails';
import QuestionAnswer from '../components/QuestionAnswer';
import ContentData from '../../data/content-detail.json';

class ContentDetail extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         Announcements: [],
         PostData: ''
      }
   }
   componentDidMount() {
      this.setState({
         Announcements: ContentData.suggested,
         PostData: ContentData.post
      });

      document.body.classList.add('page_content_white');
      document.body.classList.remove('page_content_bg');
   }
   render() {
      const { PostData, Announcements } = this.state;
      return (
         <Layout>
            <div className="">
               <div className="">
                  <PostDetails post={PostData} />

                  <div className="page_content_bg">
                     <div className="smallContainer">
                        <QuestionAnswer />
                     </div>
                  </div>
                  <div className="announcements-wrap">
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
                  </div>


               </div>
            </div>
         </Layout>
      );
   }
}

export default ContentDetail;
