import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { Button, Icon, Header } from "semantic-ui-react";
import MUIDataTable from "mui-datatables";
import styled from "styled-components";
import { TaskStore } from "../Stores/TaskStore";
import { AccountStore} from "../Stores/AccountStore";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

class TaskFrame extends React.Component {
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

    const handleClick = (task) => {
      this.props.history.push(`/panel/tasks/manage-task/${task? task.surveyID: ""}` );

    }
    
    const columns = [
      { 
        name: "Task Title",
        options: {
          filter: false
        }
      },
      {
        name: "Last Updated",
        options: {
          filter: false
        }
      },
      {
        name: "Created By",
        options: {
          filter: false
        }
      },
      {
        name: "Stage",
        options: {
          filter: true,
          filterOptions: {
            names: ['Active', "InActive"],
            logic(stage, filterVal) {
              const show = (filterVal.indexOf("Active") >= 0 && stage == "Active") || (filterVal.indexOf("InActive") >= 0 && stage != "Active");
              return !show
            }
          },
        }
      }
    ];

    const data = TaskStore.allTasks.map(task => [task.label, UTCtoFriendly(task.updated), AccountStore._getDisplayName(task.userID), task.active? "Active":"Inactive"]);

    const mobileColumns = ["Task Title", "Last Updated"];

    const mobileData = TaskStore.allTasks.map(task => [task.label, UTCtoFriendly(task.updated)]);

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

      onRowClick: (i, data) => handleClick(TaskStore.allTasks[data.dataIndex])
    };

    const { width } = this.state;

    return (
      <React.Fragment>
        <Header as="h2" style={{ padding: 0, margin: "10px 0 10px" }}>
          Tasks
          <Header.Subheader>
            Assign tasks to better track progress
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

export default withRouter(TaskFrame);