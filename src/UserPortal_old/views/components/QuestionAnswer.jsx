import React from 'react';
import QAData from '../../data/content-detail.json';

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
        // const { QuestionAnswer } = this.state;
        return (
            <div className="QuestionAnswer">
                <div className="QuestionAnswerTitle">
                    <p>Question and Answer</p>
                </div>
                <div className="QuestionAnswerBox">
                    <div className="QuestionAnswerBoxTop">
                        <p>Promoted by Carta</p>
                        <span>2d ago</span>
                    </div>
                    <h6>Does this benefit apply to all employees, even those who work part-time?</h6>
                    <div className="QuestionAnswerUser">
                        <img alt="" src="/static/media/user.4f017f0f.jpg" />
                        <div className="userPostDate">
                            <a href="#/">Joshua Lawrence</a>
                            <p>Aug 4, 2016 </p>
                        </div>
                    </div>
                    <div className="replyContent">
                        <p>For this benefit, you need to be a full time employee</p>
                    </div>
                </div>
                <div className="QuestionAnswerBox">
                    <div className="QuestionAnswerBoxTop">
                        <p>Promoted by Carta</p>
                        <span>2d ago</span>
                    </div>
                    <h6>Does this benefit apply to all employees, even those who work part-time?</h6>
                    <div className="ansBtn">
                        <a href="#/">Answer</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default QuestionAnswer;
