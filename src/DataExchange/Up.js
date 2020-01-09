/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import 'react-toastify/dist/ReactToastify.css';
import _ from 'lodash';

import { apiCall, apiCall_noBody, apiCall_del, } from './Fetch';
import { UIStore, } from '../Stores/UIStore';
import { AccountStore, } from '../Stores/AccountStore';
import { UserStore, } from '../Stores/UserStore';
import toast from '../YallToast';
import { ItsLog, } from "./PayloadBuilder";
import * as reload from "./Down";
import { loadProfile, } from "./LoadProfile";

const accountID = () => AccountStore.account.accountID.slice();
const userID = () => UserStore.user.userID.slice();

const refresh = async (key) => {
  if (!_.isEmpty(UserStore.user.adminLimits)) {
    await loadProfile();
  }
  else {
    return {
      schedule: () => reload.scheduled(accountID()),
      teams: () => reload.structure(accountID()),
      tags: () => reload.tags(accountID()),
      // users: () => reload.users(accountID(), userID()),
      users: () => reload.users_and_teams(accountID(), userID()),
      channels: () => reload.channels(accountID()),
      urlResources: () => reload.urls(accountID()),
      policies: () => reload.policies(accountID()),
      announcements: () => reload.announcements(accountID()),
      files: () => reload.files(accountID()),
      campaigns: () => reload.campaigns(accountID()),
      account: () => reload.account(accountID()),
      surveys: () => reload.surveys(accountID()),
      tickets: () => reload.tickets(accountID()),
    }[key]();
  }
};

export const log = (payload) => {
  apiCall('itslogs', 'POST', payload);
};

const processTemplate = (
  useBody,
  endpoint,
  meth,
  payload,
  key,
  success_text,
  isAction,
  data,
  toastEnabled = true
) => {
  // eslint-disable-next-line no-nested-ternary
  const callApi = meth === 'DELETE' ? apiCall_del : useBody ? apiCall : apiCall_noBody;
  return new Promise((resolve, reject) => {
    log(ItsLog(isAction, data));
    callApi(endpoint, meth, payload).then((result) => {
      if (result.ok) {
        refresh(key)
          .then(
            () => {
              if (toastEnabled) {
                toast.success(success_text, { hideProgressBar: true, });
              }
              resolve(result);
            })
          .catch(() => { });
      } else {
        toast.error(result.statusText, { hideProgressBar: true, });
        reject(result);
      }
    });
  });
};

// /Sentiment
export const createSentiment = (payload) => apiCall('/sentiments', 'POST', payload);

// /History
export const createHistory = (payload) => {
  apiCall('/histories', 'POST', payload);
};

// /Send Query
export const sendQuery = (payload) => {
  apiCall('/users/send-query', 'POST', payload).then((result) => {
    if (result.ok) {
      toast.success('Your message has been sent! ✉️', { hideProgressBar: true, });
    } else {
      toast.error(result.statusText, { hideProgressBar: true, });
    }
  });
};

// /Notfications
export const clearNotification = (payload) => {
  const id = {
    'Policy': 'policyID',
    'Announcement': 'announcementID',
    'File': 'resourceID',
    'URL': 'resourceID',
  }[payload.type];
  const route = {
    'Policy': 'policies/',
    'Announcement': 'announcements/',
    'File': 'fileresources/',
    'URL': 'urls/',
  }[payload.type];
  const reloadKey = {
    'Policy': 'policies',
    'Announcement': 'announcements',
    'File': 'files',
    'URL': 'urlResources',
  }[payload.type];
  const updateVaris = (varis) => {
    const newVaris = varis.slice();
    newVaris.forEach(i => { i.updated = Date.now(); });
    return newVaris;
  };
  const newPayload = {};

  newPayload[id] = payload[id];
  newPayload.accountID = payload.accountID;

  if (payload.type === 'File' || payload.type === 'URL') {
    newPayload.updated = Date.now();
  } else {
    newPayload.variations = updateVaris(payload.variations);
  }

  return apiCall(route + payload[id], 'PATCH', newPayload)
    .then(() => refresh[reloadKey]());
};

// /Account
export const createAccount = (payload) => {
  return processTemplate(true, 'accounts', 'POST', payload, 'account',
    'A new account has been created',
    true, { 'event': 'create', 'type': 'schedule', }, true
  );
};

export const deleteAccount = (accountId) => {
  return processTemplate(false, `accounts/${accountId}`, 'DELETE', {}, 'account',
    'Selected account deleted',
    true, { 'event': 'delete', 'type': 'account', });
};

// /SCHEDULE 
export const createSchedule = (payload, toastEnabled) => {
  return processTemplate(true, 'schedules', 'POST', payload, 'schedule',
    `Your ${payload.task} task is scheduled! ⏳`,
    true, { 'event': 'create', 'type': 'schedule', }, toastEnabled
  );
};

export const deleteSchedule = (scheduleID) => {
  processTemplate(false, `schedules/${scheduleID}`, 'DELETE', {}, 'schedule',
    'Selected schedule deleted',
    true, { 'event': 'delete', 'type': 'schedule', });
};

// /TEAMS (STRUCTURE)
export const createTeam = (payload) => {
  return processTemplate(true, 'teams', 'POST', payload, 'teams',
    'Your new team has been created 🙌',
    true, { 'event': 'create', 'type': 'team', }
  );
};

export const modifyTeam = (payload) => {
  processTemplate(true, `teams/${payload.teamID}`, 'PATCH', payload, 'teams',
    'Your team has been updated 🛠',
    true, { 'event': 'update', 'type': 'team', }
  );
};

export const deleteTeam = (teamID) => {
  processTemplate(false, `teams/${teamID}`, 'DELETE', {}, 'teams',
    'Selected team deleted',
    true, { 'event': 'delete', 'type': 'team', });
};

// /TAGS 
export const createTag = (payload) => {
  return processTemplate(true, 'tags', 'POST', payload, 'tags',
    'Your new tag has been created 🙌',
    true, { 'event': 'create', 'type': 'tag', }
  );
};

export const modifyTag = (payload) => {
  processTemplate(true, `tags/${payload.tagID}`, 'PATCH', payload, 'tags',
    'Your tag has been updated 🛠',
    true, { 'event': 'update', 'type': 'tag', }
  );
};

export const deleteTag = (tagID) => {
  processTemplate(false, `tags/${tagID}`, 'DELETE', {}, 'tags',
    'Selected tag deleted ',
    true, { 'event': 'delete', 'type': 'tag', });
};

// /USERS
export const sendInviteEmail = (data) => {
  const inviteURL = process.env.REACT_APP_INVITE_URL;
  return fetch(inviteURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', },
    body: JSON.stringify(data),
  });
};

export const createUser = (payload, toastEnabled) => {
  return processTemplate(true, 'users', 'POST', payload, 'users',
    `🎉 ${payload.email} has been invited to Join ✉️`,
    true, { 'event': 'create', 'type': 'user', }, toastEnabled
  );
};

export const modifyUser = (payload) => {
  return processTemplate(true, `users/${payload.userID}`, 'PATCH', payload, 'users',
    'Profile has been updated 🛠',
    true, { 'event': 'update', 'type': 'user', }
  );
};

export const offBoardUser = (userId, now) => {
  const data = {
    'userID': userId,
    'accountID': accountID(),
    'isActive': false,
  };
  if (!now) {
    data.offBoarded = true;
    data.offBoardDate = new Date();
  }
  return processTemplate(
    true,
    `users/${userId}`,
    'PATCH',
    data,
    'users',
    'User offboarded ✌️',
    true,
    {
      'event': 'offboard',
      'type': 'user',
    }
  );
};

export const deleteUser = (userId) => {
  return processTemplate(false, `users/${userId}`, 'DELETE', {}, 'users',
    'Selected user deleted ',
    true, { 'event': 'delete', 'type': 'user', });
};

export const cancelInvite = (id) => {
  return processTemplate(false, `validations/${id}`, 'DELETE', {}, 'users',
    'Invite has been canceled',
    true, { 'event': 'delete', 'type': 'user', });
};

// /CHANNEL
export const createChannel = (payload) => {
  processTemplate(true, 'channels', 'POST', payload, 'channels',
    'Your new channel has been created 🙌',
    true, { 'event': 'create', 'type': 'channel', }
  );
};

export const modifyChannel = (payload) => {
  return processTemplate(true, `channels/${payload.chanID}`, 'PATCH', payload, 'channels',
    'Your channel has been updated 🛠',
    true, { 'event': 'update', 'type': 'channel', }
  );
};

export const deleteChannel = (chanID) => {
  return processTemplate(false, `channels/${chanID}`, 'DELETE', {}, 'channels',
    'Selected channel deleted',
    true, { 'event': 'delete', 'type': 'channel', });
};

// /URL Resources
export const createUrlResource = (payload) => {
  return processTemplate(true, 'urls', 'POST', payload, 'urlResources',
    'Your new URL has been created 🙌',
    true, { 'event': 'create', 'type': 'url', }
  );
};

export const modifyUrlResource = (payload, toastr = true) => {
  processTemplate(true, `urls/${payload.resourceID}`, 'PATCH', payload, 'urlResources',
    'Your URL as been updated 🛠☁️',
    true, { 'event': 'update', 'type': 'url', }, toastr
  );
};

export const deleteUrlResource = (resourceID) => {
  processTemplate(false, `urls/${resourceID}`, 'DELETE', {}, 'urlResources',
    'Selected URL deleted ',
    true, { 'event': 'delete', 'type': 'url', });
};

// /FILE RESOURCES
// export const createFile = (payload) => {
//     return processTemplate(true, "fileresources", "POST", payload, "files", 
//         "Your file has been uploaded ☁️", 
//         true,{"event": "create", "type":"file"}
//     )
// }

export const modifyFile = (payload, toastr = true) => {
  return processTemplate(true, `fileresources/${payload.resourceID}`, 'PATCH', payload, 'files',
    'Your file has been updated 🛠☁️',
    true, { 'event': 'update', 'type': 'file', }, toastr
  );
};

export const deleteFileresource = (resourceID) => {
  processTemplate(false, `fileresources/${resourceID}`, 'DELETE', {}, 'files',
    'Selected file deleted',
    true, { 'event': 'delete', 'type': 'file', }, false);
};

// /POLICIES AND ANNOUNCEMENTS (SAME DATA SCHEMA)
export const createPolicy = (payload) => {
  const responseText = 'Your new FAQ has been created 🙌';
  const data = { event: 'create', type: 'policy', };
  const type = 'policies';
  delete payload.policyID;
  return new Promise((resolve, reject) => {
    processTemplate(true, type, 'POST', payload, type, responseText, true, data)
      .then(res => res.json())
      .then(res => {
        UIStore.set('content', 'policyID', res.policyID);
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const createAnnouncement = (payload) => {
  const responseText = 'Your new Announcement has been created 🙌';
  const data = { event: 'create', type: 'announcement', };
  const type = 'announcements';
  delete payload.announcementID;
  return new Promise((resolve, reject) => {
    processTemplate(true, type, 'POST', payload, type, responseText, true, data)
      .then(res => res.json())
      .then(res => {
        UIStore.set('content', 'announcementID', res.announcementID);
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const modifyPolicy = (payload) => processTemplate(
  true,
  `policies/${payload.policyID}`,
  'PATCH',
  payload,
  'policies',
  'Your policy has been updated 🛠',
  true,
  {
    'event': 'update',
    'type': 'policy',
  }
);

export const modifyAnnouncement = (payload, toastEnabled) => processTemplate(
  true,
  `announcements/${payload.announcementID}`,
  'PATCH',
  payload,
  'announcements',
  'Your policy has been updated 🛠',
  true,
  {
    'event': 'update',
    'type': 'policy',
  },
  toastEnabled
);

export const deletePolicy = (policyID) => processTemplate(
  false,
  `policies/${policyID}`,
  'DELETE',
  {},
  'policies',
  'Selected policy deleted',
  true,
  {
    'event': 'delete',
    'type': 'policy',
  },
  false
);

export const deleteAnnouncement = (announcementID) => processTemplate(
  false,
  `announcements/${announcementID}`,
  'DELETE',
  {},
  'announcements',
  'Selected announcement deleted',
  true,
  {
    'event': 'delete',
    'type': 'announcement',
  },
  false
);

// /EMAIL CAMPAIGN 
export const createCampaign = (payload, toastEnabled) => processTemplate(
  true,
  'emailcampaigns',
  'POST',
  payload,
  'campaigns',
  payload.isTriggered
    ? 'Your email trigger is set and sending will be automated to eligible users 🤖✉️'
    : 'Your campaign is being built and will send momentarily 🚀✉️',
  true,
  { 'event': 'create', 'type': 'campaign', },
  toastEnabled
);

export const modifyCampaign = (payload, toastEnabled) => {
  let msg = payload.completed
    ? 'The selected campaign has been discontinued 🛑'
    : 'Your campaign has been updated 🛠';

  if (Object.keys(payload).length < 3 && payload.isTemplate === false) {
    msg = 'Template removed.';
  }
  return processTemplate(
    true,
    `emailcampaigns/${payload.campaignID}`,
    'PATCH',
    payload,
    'campaigns',
    msg,
    true,
    {
      'event': 'update',
      'type': 'campaign',
    }, toastEnabled
  );
};

// /EMAIL FUNCTIONS
export const sendEmailPreview = async (val) => {
  const previewValues = {
    isSendNow: true,
    completed: false,
  };
  await apiCall(
    'emailcampaigns',
    'POST',
    Object.assign(val, previewValues)
  )
    .then((res) => res.json())
    .then(() => toast.success('Preview email has been sent', { hideProgressBar: true, }))
    .catch(() => toast.error('Preview email has not been sent', { hideProgressBar: true, }));
};

// /SETTINGS
export const modifyAccount = (payload, toastr = true) => processTemplate(
  true,
  `accounts/${payload.accountID}`,
  'PATCH',
  payload,
  'account',
  'Your account settings have been updated 🛠',
  true,
  {
    'event': 'update',
    'type': 'account',
  },
  toastr
);

// /SURVEYS
export const createSurvey = (payload) => processTemplate(
  true,
  'surveys',
  'POST',
  payload,
  'surveys',
  `Your new ${payload.type} has been created 🙌`,
  true,
  {
    'event': 'create',
    'type': 'survey',
  }
);

export const modifySurvey = (payload) => processTemplate(
  true,
  `surveys/${payload.surveyID}`,
  'PATCH',
  payload,
  'surveys',
  `Your ${payload.type} has been updated 🛠`,
  true,
  {
    'event': 'update',
    'type': 'survey',
  }
);

export const deleteSurvey = (surveyID) => processTemplate(
  false,
  `surveys/${surveyID}`,
  'DELETE',
  {},
  'surveys',
  'Selected surveys deleted',
  true,
  {
    'event': 'delete',
    'type': 'survey',
  }
);

// /TICKETS
export const createTicket = (payload) => processTemplate(
  true,
  'ticketing',
  'POST',
  payload,
  'tickets',
  'Your new ticket has been created',
  true,
  {
    'event': 'create',
    'type': 'ticket',
  }
);

export const modifyTicket = (payload, toastr = false) => processTemplate(
  true,
  `ticketing/${payload.ticketID}`,
  'PATCH',
  payload,
  'tickets',
  'Your ticket has been updated',
  true,
  {
    'event': 'update',
    'type': 'ticket',
  },
  toastr
);

export const deleteTicket = (ticketID) => processTemplate(
  false,
  `ticketing/${ticketID}`,
  'DELETE',
  {},
  'tickets',
  'Selected tickets deleted',
  true,
  {
    'event': 'delete',
    'type': 'ticket',
  }
);
