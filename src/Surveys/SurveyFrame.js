import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { Button, Icon, Header } from "semantic-ui-react";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import styled from "styled-components";
import { SurveyStore } from "../Stores/SurveyStore";
import { AccountStore} from "../Stores/AccountStore";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"

class SurveyFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0 };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }
  
  getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MUIDataTableBodyCell: {
          root: {
            fontFamily: "Lato",
            fontSize: "1em"
          }
        },
        MUIDataTableBodyRow: {
          root: {
            zIndex: "1 !important"
          }
        },
        MUIDataTableSelectCell: {
            fixedHeader: {
              zIndex: "1 !important"
            },
            headerCell: {
              zIndex: "1 !important"
            }
          },
          MUIDataTableHeadCell: {
            root: {zIndex: "1 !important"},
            fixedHeader: {
              // position: "relative"
              zIndex: "1 !important"
            }
        },
        MUIDataTable: {
          root: {
            backgroundColor: "#FF000"
          },
          paper: {
            boxShadow: "none",
            border: "2px solid #e3e8ee",
            borderRadius: 8
          }
        }
      }
    });
  
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

    const handleClick = (survey) => {
      this.props.history.push(`/panel/surveys/manage-survey/${survey? survey.surveyID: ""}` );

    }
    
    const columns = ["Survey Title", "Last Updated", "Created By", "Stage"];
    const mobileColumns = ["Survey Title", "Last Updated"];

    const data = SurveyStore.allSurveys.map(survey => [survey.label, UTCtoFriendly(survey.updated), AccountStore._getDisplayName(survey.userID), survey.active? "Active":"Inactive"])
    const mobileData = SurveyStore.allSurveys.map(survey => [survey.label, UTCtoFriendly(survey.updated)]);

    const options = {
      elevation: 1,
      selectableRows: "none",
      filter:true,
      filterType: 'dropdown',
      // filterList: [["active"]],
      print: false,
      responsive: "scrollMaxHeight",
      viewColumns: false,
      download: false,
      onRowClick: (i, data) => handleClick(SurveyStore.allSurveys[data.dataIndex])
    };

    const { width } = this.state;

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
            <Button color="blue" onClick={()=>handleClick()}>
              {" "}
              <Icon name="plus" /> Create New...{" "}
            </Button>
          </div>
        </MenuContainer> 
        <span>
  </span>      
        <div style={{ marginTop: 15 }}>
        <MuiThemeProvider theme={this.getMuiTheme()}>
          {
            width > 380?  <MUIDataTable
                            data={data}
                            columns={columns}
                            options={options}
                          />
                        :
                          <MUIDataTable
                            data={mobileData}
                            columns={mobileColumns}
                            options={options}
                          />
          }
          </MuiThemeProvider>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(SurveyFrame);