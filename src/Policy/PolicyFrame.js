import React from 'react';
import './style.css'
import { ManagePolicy } from './ManagePolicy'



export class PolicyFrame extends React.Component {
    render() {
        return(
            <div className="PolicyFrame">
                <ManagePolicy/>
                
      
            </div>
        )
    }
}