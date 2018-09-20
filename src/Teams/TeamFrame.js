import React from 'react'
import "./style.css";
import { TeamMenu } from './TeamMenu';
import { InviteUser } from './InviteUser';
import { InviteAdmin } from './InviteAdmin';
import { TeamControls } from './TeamControls';

export const TeamFrame = () => {
    return(
        <div>
        <TeamMenu/>
        <div className="TeamActionFrame">
        <TeamControls/>

        <InviteUser/>
        <InviteAdmin/>
        </div>
        </div>
    )
}