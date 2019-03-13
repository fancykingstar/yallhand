import React from 'react';
import { InviteAdmin } from './InviteAdmin'
import { InviteUser } from './InviteUser'

export const Invite = () => {
    return(
    <div style={{overflowY: "auto"}}>
    <InviteUser/>
    <InviteAdmin/>
    </div>)
} 