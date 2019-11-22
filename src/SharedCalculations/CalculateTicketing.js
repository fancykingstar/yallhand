import {TicketingStore} from "../Stores/TicketingStore";
import {AccountStore} from "../Stores/AccountStore";
// import { PoliciesStore } from "../Stores/PoliciesStore";
// import { AnnouncementsStore } from "../Stores/AnnouncementsStore";
import { UserStore } from "../Stores/UserStore";
import { getContentObj} from "../SharedCalculations/GetContentObj";

import {uniq} from "lodash";
import { getInitials } from "../SharedCalculations/GetInitials";

export const calculateTicketing = async (allTickets) => {

    const getProgress = (ticket)=> {
        if (ticket.parent === "QandA") return {steps: 20, activeStep: 10}
        const parent = TicketingStore._getTicket(ticket.parent);
        const uniqSteps = uniq(ticket.activity.filter(act => act.stage).map(act => act.stage.includes("close")? "close" : act.stage.includes("open")? "open" : act.stage));
        return {
          steps: parent? parent.ticketItems.length * 10: 0,
          activeStep: uniqSteps.length * 10
        };
      };

    const userID = UserStore.user.userID;

    let updatedtickets = [];

    const processTickets = async () => {
    for (const i of allTickets) {
        if (!i.isTemplate) {
            const mostRecent = i.activity[0];
            const _currentAssignee = mostRecent.assignee; //non-templates ONLY!
            const _updated = mostRecent.updated  //non-templates ONLY!
            const _stage = mostRecent.stage? mostRecent.stage : i.activity.map(i=>i.stage).filter(i => Boolean(i))[0] //non-templates ONLY!
            const _unread = mostRecent.assignee && mostRecent.assignee !== userID ? false : (!mostRecent.assignee || mostRecent.assignee === userID)? !mostRecent.views.includes(userID) : false; 
            const _progress = getProgress(i); 
            const _userImg = AccountStore._getUser(i.userID).img;
            const _requester = AccountStore._getUser(i.userID);
            const _parent = i.parent === "QandA"? "QandA" : TicketingStore._getTicket(i.parent);
            const _content = i.parent !== "QandA"?  "" : getContentObj(i.activity[i.activity.length - 1]["data"]);
            const _userInitials = getInitials( AccountStore._getUser(i.userID).displayName );
            updatedtickets.push(Object.assign(i, {_currentAssignee, _updated, _stage, _userImg, _requester,  _userInitials, _unread, _progress, _parent, _content }))
        }
        else updatedtickets.push(i);
    };
    return updatedtickets;
  };
  
  return await processTickets();



}