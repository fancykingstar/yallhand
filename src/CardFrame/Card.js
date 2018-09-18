import React from 'react'
import { Icon, Label } from 'semantic-ui-react'
import './card-style.css'

export class Card extends React.Component {
    render() {
        return(
            <div className="Card">
                <div className="Q">Q:</div>
                <div className="Question"><h4>How do I do something really cool that wraps?</h4></div>
                <div className="Owners"><Label color='blue' horizontal>Mark Z.</Label><Label color='blue' horizontal>Someone E.</Label><Label color='blue' horizontal>Mark Z.</Label><Label color='blue' horizontal>Someone E.</Label></div>
                <div className="AtmnStatus"><Icon name='sync alternate' color='grey' size='large' /></div>
                <div className="UsageStatus">
                    1 Global / 3 Teams
                </div>
                <div className="CurrentStatus"><Icon name='check circle' color='green' size='large' /></div>
                <div className="Corner"></div>
            
            </div>
        )
    }
}