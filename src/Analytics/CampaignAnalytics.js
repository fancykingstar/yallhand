import React from "react";
import { Header } from "semantic-ui-react";
import {AccountStore} from "../Stores/AccountStore";
import {EmailStore} from "../Stores/EmailStore";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly";
import TimeAgo from 'react-timeago';
import MUIDataTable from "mui-datatables";
import { CampaignDetails } from "../SharedUI/CampaignDetails";


import _ from "lodash";
export class CampaignAnalytics extends React.Component {
  constructor(props){
    super(props);
    this.state={showModal: false, campaign: ""}
  }
    render() {

        const clickRate = (camp) => Number.isNaN(Math.round(camp.clicks / camp.total_views * 100))? 0 : Math.round(camp.clicks / camp.total_views * 100)
       
        const handleClick = (campaign) => {this.setState({showModal:true, campaign})}

        const columns = ["Name", "Sent", "Views (All/Unique)", "Open Rate", "Click Rate"];
        const data = AccountStore.analyticData_campaigns.map(camp => {
            return [camp.subject, UTCtoFriendly(camp.sent), `${camp.total_views}/${camp.unique_views}`, camp.open_rate + "%", clickRate(camp)]
        })
        
            
        const options = {
        elevation: 1,
        selectableRows: "none",
        filter:true,
        filterType: 'dropdown',
        print: false,
        responsive: "scrollMaxHeight",
        viewColumns: false,
        download: true,
        onRowClick: (i, data) => handleClick(EmailStore._getCampaign(AccountStore.analyticData_campaigns[data.rowIndex].campaignID))
        };
        return(
            <React.Fragment>
            <div>
            
            <Header
            as="h2"
            content="Survey Performance"
            />
  
              <div style={{ marginTop: 15 }}>
          <MUIDataTable
            // title={"Employee List"}
            data={data}
            columns={columns}
            options={options}
          />
          {/* {CampaignDetails(this.state.showModal, this.state.campaign)} */}
          <CampaignDetails open={this.state.showModal} onClose={() => this.setState({showModal: false})} source={this.state.campaign} />
          
        </div>
       
      </div>
      </React.Fragment>
        )
    }
}

