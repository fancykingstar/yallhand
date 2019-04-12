import React from 'react';
import { InviteUser } from './InviteUser'

export const Invite = () => {
    return(
    <div>
    <InviteUser isAdmin={false}/>
    <InviteUser isAdmin={true}/>
    </div>)
} 