import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { Button, Icon, Header } from "semantic-ui-react";
import MUIDataTable from "mui-datatables";
import styled from "styled-components";

import {sample} from "./sample";
import { SurveyStore } from "../Stores/SurveyStore";

@inject("SurveyStore")
@observer
class SurveyFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = { UIFilter: "active" };
  }
  componentDidMount(){
    const {SurveyStore} = this.props;
    SurveyStore.loadSurveys([sample]);
  }
  render() {
    const MenuContainer = styled.div`
      display: flex;
      flex-wrap: wrap;
      paddingbottom: 30px;
      @media (max-width: 580px) {
        justify-content: center;
        flex-direction: column;
      }
    `;

    const columns = ["Survey Title", "Last Updated", "Created By", "Stage"];

    const data = SurveyStore.allSurveys.map(survey => [survey.label, survey.updated, survey.userID, survey.stage])
    
    const handleClick = (survey) => {
      this.props.history.push( "/panel/surveys/manage-survey/" + survey.surveyID );

    }

    const options = {
      elevation: 1,
      selectableRows: "none",
      filter:true,
      filterType: 'dropdown',
      filterList: [["active"]],
      print: false,
      responsive: "scrollMaxHeight",
      viewColumns: false,
      download: false,
      onRowClick: (i, data) => handleClick(SurveyStore.allSurveys[data.rowIndex])
    };

    return (
      <React.Fragment>
        <Header as="h2" style={{ padding: 0, margin: "10px 0 10px" }}>
          Surveys
          <Header.Subheader>
            Get valuable feedback with custom surveys and polls
          </Header.Subheader>
        </Header>
        <MenuContainer>
          <div style={{ textAlign: "center" }}>
            <Button color="blue">
              {" "}
              <Icon name="plus" /> Create New...{" "}
            </Button>
          </div>
        </MenuContainer>
        <div style={{ marginTop: 15 }}>
          <MUIDataTable
            title={"Employee List"}
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(SurveyFrame);