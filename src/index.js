import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// import registerServiceWorker from "./registerServiceWorker";
import { unregister } from './registerServiceWorker';
import { Provider } from "mobx-react";
import { BrowserRouter } from "react-router-dom";
import { ChannelStore } from "./Stores/ChannelStore";
import { PoliciesStore } from "./Stores/PoliciesStore";
import { UserStore } from "./Stores/UserStore";
import { ResourcesStore } from "./Stores/ResourcesStore";
import { TeamStore } from "./Stores/TeamStore";
import { AnnouncementsStore } from "./Stores/AnnouncementsStore";
import { DataEntryStore } from "./Stores/DataEntryStore";
import { UIStore } from "./Stores/UIStore";
import { AccountStore } from "./Stores/AccountStore";
import { EmailStore } from "./Stores/EmailStore";
import { ScheduleStore } from "./Stores/ScheduleStore";
import { SurveyStore } from "./Stores/SurveyStore";
import { TaskStore } from "./Stores/TaskStore";
import { TicketingStore } from "./Stores/TicketingStore";

const Root = (
  <Provider
    ChannelStore={ChannelStore}
    PoliciesStore={PoliciesStore}
    UserStore={UserStore}
    ResourcesStore={ResourcesStore}
    TeamStore={TeamStore}
    AnnouncementsStore={AnnouncementsStore}
    DataEntryStore={DataEntryStore}
    UIStore={UIStore}
    AccountStore={AccountStore}
    EmailStore={EmailStore}
    ScheduleStore={ScheduleStore}
    SurveyStore={SurveyStore}
    TaskStore={TaskStore}
    TicketingStore={TicketingStore}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(Root, document.getElementById("root"));
unregister();
