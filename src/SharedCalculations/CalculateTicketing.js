export const calculateTicketing = (allTickets) => {
    let updatedtickets = [];
    allTickets.forEach(i => {
        if (!i.isTemplate) {
            const mostRecent = i.activity[0];
            const _currentAssignee = mostRecent.assignee; //non-templates ONLY!
            const _updated = mostRecent.updated  //non-templates ONLY!
            const _stage = mostRecent.stage //non-templates ONLY!

            updatedtickets.push(Object.assign(i, {_currentAssignee, _updated, _stage}))
        }
        else updatedtickets.push(i);
    });
    return updatedtickets;
}