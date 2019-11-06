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
        const { qaData } = this.props;

        return (
            <div className="QuestionAnswer">
                <div className="QuestionAnswerTitle">
                    <p>Question and Answer</p>
                </div>
                {(qaData) ? (qaData.map((item, index) => {
                    return <div key={index} className="QuestionAnswerBox">
                        <div className="QuestionAnswerBoxTop">
                            <p>Promoted by Carta</p>
                            <span>2d ago</span>
                        </div>
                        <h6>{item.question}</h6>
                        <div className="QuestionAnswerUser">
                            {(item.admin.img) && <img alt="" src={item.admin.img} />}
                            <div className="userPostDate">
                                {(item.admin.name) && <a href="#/">{item.admin.name}</a>}
                                <p>{item.updated}</p>
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
