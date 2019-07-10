import React from 'react';
import {inject, observer} from 'mobx-react';
import { user } from "../DataExchange/PayloadBuilder"

export const UserInvite = inject("AccountStore")(observer((props) => {
  const getDataNewUser =  () => {
    // const { AccountStore} = this.props;
    const { teamID, teamName, tagID, email, isAdmin, boss } = props.info;
    const userData = user()

    console.log('info', teamID, teamName, tagID, email, isAdmin, boss  )
    console.log(userData)
  }
  getDataNewUser()
  return( 
    <div>
      hi
    </div>
  )
}))