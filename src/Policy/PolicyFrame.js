import React from 'react';
import './style.css'
import { ManagePolicy } from './ManagePolicy'
import { QFields } from './QFields'
import { AFields } from './AFields'
import { PubControls } from './PubControls';


export class PolicyFrame extends React.Component {
    render() {
        return(
            <div className="PolicyFrame">
                {/* <ManagePolicy/> */}
                <PubControls/>
                <QFields/>
                <AFields/>
      
            </div>
        )
    }
}