import React from 'react';
import QAData from '../../data/content-detail.json';
import TextField from '@material-ui/core/TextField';
import {Button} from 'reactstrap';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';

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
                            <span>2d ago</span>
                        </div>
                        <h6>Q: {item.question}</h6>
                        <div className="QuestionAnswerUser">
                            {(item.admin.img) && <img alt="" src={item.admin.img} />}
                            <div className="userPostDate">
                                {(item.admin.name) && <a href="#/">{item.admin.name}</a>}
                                {/* <p>{item.updated}</p> */}
                            </div>
                        </div>
                        {(item.answer !== '') ? (
                            <div className="replyContent">
                                <p>{item.answer}</p>
                            </div>
                        ) : (
                                <div className="ansBtn">
                                    <a href="#/">Answer</a>
                                </div>
                            )}
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
