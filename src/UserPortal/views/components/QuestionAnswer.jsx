import React from 'react';
import QAData from '../../data/content-detail.json';
import TextField from '@material-ui/core/TextField';
import {Button} from 'reactstrap';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import {AccountStore} from "../../../Stores/AccountStore";
import TimeAgo from 'react-timeago'

class QuestionAnswer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            QuestionAnswer: [],
        }
    }
    componentDidMount() {
        this.setState({
            QuestionAnswer: QAData.suggested,
        })
    }
    render() {
        const { qaData } = this.props;
        console.log("qadata", qaData)
        return (
            <div className="QuestionAnswer">
                <div className="QuestionAnswerTitle">
                    <p>Question and Answer</p>
                </div>
                {/* <div className="page_content shadow">
                <TextField
        id="standard-textarea"
        label="Ask a question"
        placeholder="Ask a question about this content"
        multiline
        fullWidth
        margin="normal"
      />
         <Button outline color="primary" size="sm">
        Submit <DoneRoundedIcon fontSize="small"/>
      </Button></div> */}
                {(qaData) ? (qaData.map((item, index) => {
                    return <div key={index} className="QuestionAnswerBox">
                        <div className="QuestionAnswerBoxTop">
                            <span><TimeAgo date={item.updated} /></span>
                        </div>
                        <h6>Q: {item.q}</h6>
                        <div className="QuestionAnswerUser">
                            {(AccountStore._getUser(item.adminID).img) && <img alt="" src={AccountStore._getUser(item.adminID).img} />}
                            <div className="userPostDate">
                                <a href="#/">{AccountStore._getUser(item.adminID).displayName}</a>
                                {/* <p>{item.updated}</p> */}
                            </div>
                        </div>
                        {/* {(item.answer !== '') ? ( */}
                            <div className="replyContent">
                                <p>{item.a}</p>
                            </div>
                        {/* ) : (
                                <div className="ansBtn">
                                    <a href="#/">Answer</a>
                                </div>
                            )} */}
                    </div>
                })) : ('')} 

                 {/* <div className="QuestionAnswerBox">
                    <div className="QuestionAnswerBoxTop">
                        <span>2d ago</span>
                    </div>
                    <h6>Does this benefit apply to all employees, even those who work part-time?</h6>
                    <div className="ansBtn">
                        <a href="#/">Answer</a>
                    </div>
                </div> */}
            </div>
        )
    }
}

export default QuestionAnswer;
