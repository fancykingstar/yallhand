import React from "react"
import { inject, observer } from "mobx-react"


// const LoadProfile = inject("SideBarStore", "PoliciesStore", "ResourcesStore", "AutomationsStore", "TeamStore", "UserStore")(
//     observer(({ SideBarStore, PoliciesStore, ResourcesStore, AutomationsStore, TeamStore, UserStore }) => {    

// }))

class Loader extends React.Component {
//  const { SideBarStore } = props;
 SideBarStore.loadChannels();
//  const { PoliciesStore } = props;
 PoliciesStore.loadPolicies()
//  const { ResourcesStore } = props;
 ResourcesStore.loadFiles()
 ResourcesStore.loadUrls()
//  const { AutomationsStore} = props;
 AutomationsStore.loadAutomations()
//  const { TeamStore } = props;
 TeamStore.loadStructure()
 TeamStore.loadClasses()
//  const {UserStore} = props;
 UserStore.loadAccount()
 }
 

Loader = inject("SideBarStore", "PoliciesStore", "ResourcesStore", "AutomationsStore", "TeamStore", "UserStore")(observer(Loader))



export default Loader


