import {TicketingStore} from "../Stores/TicketingStore";
import {AccountStore} from "../Stores/AccountStore";
import { PoliciesStore } from "../Stores/PoliciesStore";
import { AnnouncementsStore } from "../Stores/AnnouncementsStore";

import {uniq} from "lodash";
import { getInitials } from "../SharedCalculations/GetInitials";

export const calculateTicketing = (allTickets) => {

    const getProgress = async (ticket)=> {
        if (ticket.parent === "QandA") return {steps: 20, activeStep: 10}
        const parent = await TicketingStore._getTicket(ticket.parent);
        const uniqSteps = await uniq(ticket.activity.map(act => act.stage));
        return {
          steps: parent? parent.ticketItems.length * 10: 0,
          activeStep: uniqSteps.length * 10
        };
      };

      const getContentLabel = (obj) => {
        return "Untitled"
      };
    


    let updatedtickets = [];
    allTickets.forEach(i => {
        if (!i.isTemplate) {
            const mostRecent = i.activity[0];
            
            const _currentAssignee = mostRecent.assignee; //non-templates ONLY!
            const _updated = mostRecent.updated  //non-templates ONLY!
            const _stage = mostRecent.stage? mostRecent.stage : i.activity.map(i=>i.stage).filter(i => Boolean(i))[0] //non-templates ONLY!

            const _progress = getProgress(i); //needs await?
            const _userImg = AccountStore._getUser(i.userID).img;
            const _requester = AccountStore._getUser(i.userID);
            const _parent = TicketingStore._getTicket(i.parent);
            const _userInitials = getInitials( AccountStore._getUser(i.userID).displayName );
            // const _parentLabel = i.parent === "QandA"? getContentLabel(i) : TicketingStore._getTicket(i.parent).label;
            const _contentPreview = Object.keys(i.activity[0].data).includes("policyID")? PoliciesStore._getPolicy(i.activity[0].data.policyID) : AnnouncementsStore._getAnnouncement(i.activity[0].data.announcementID)
            const _contentData = Object.keys(i.activity[0].data).includes("policyID")? PoliciesStore._getPolicy(i.activity[0].data.policyID) : AnnouncementsStore._getAnnouncement(i.activity[0].data.announcementID)

            updatedtickets.push(Object.assign(i, {_currentAssignee, _updated, _stage, _progress, _userImg, _requester, _parent, _userInitials,  _contentPreview, _contentData}))
        }
        else updatedtickets.push(i);
    });
    return updatedtickets;
}