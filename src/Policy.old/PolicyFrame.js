import React from 'react';
import './style.css'
import { BackToChan } from './BackToChan'
import { QFields } from './QFields'
import { ARouting} from './ARouting'

export class PolicyFrame extends React.Component {
    render() {
        return(
            <div className="PolicyFrame">
                <BackToChan/>
                <ARouting/>
                <QFields/>
               
            </div>
        )
    }
}