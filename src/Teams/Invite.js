import React from 'react';
import { InviteUser } from './InviteUser'

export const Invite = () => {
    return(
    <div style={{overflowY: "auto"}}>
    <InviteUser isAdmin={false}/>
    <InviteUser isAdmin={true}/>
    </div>)
} 