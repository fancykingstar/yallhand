import React, {useState} from "react";
import {inject, observer} from "mobx-react"
import {S3Download} from "../DataExchange/S3Download"
import MUIDataTable from 'mui-datatables';
import Tooltip from '@material-ui/core/Tooltip';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { FileTypeIcons } from "../SharedUI/FileTypeIcons"
import { AddButton } from "../SharedUI/AddButton"
import { Icon, Table, Header, Button, Item, Modal } from "semantic-ui-react";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"
import { UploadFile } from "../SharedUI/UploadFile";
import { AssociationSummary } from "../SharedUI/AssociationSummary"
import { initSearchObj, stupidSearch } from "../SharedCalculations/StupidSearch";
import { giveMeKey } from "../SharedCalculations/GiveMeKey"
import { deleteFileresource } from "../DataExchange/Up";
import styled from 'styled-components';
import { ChannelStore } from '../Stores/ChannelStore';
import "./style.css";

const MenuContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 30px;
  @media (max-width: 580px) {
    justify-content: center;
    flex-direction: column;
  }
`;

const CustomToolbarSelect = (props) => {
  const [del, setDel] = useState(false);

  const handleClick = () => {
    const { handleClick, selectedRows, data } = props;
    const delList = selectedRows.data;
    delList.map((row, i) => {
      handleClick(data[row.dataIndex].resourceID);
    })
    setDel(false);
  }

  const cancel = () => {
    setDel(false);
  }

  return (
    <div className={"custom-toolbar-select"}>
      <Tooltip title="Delete">
        <Icon style={{ cursor: "pointer", marginRight: 10 }} color="grey" name="trash" onClick={() => setDel(true)} />
      </Tooltip>
      { del ? <ConfirmDelete confirm={() => handleClick()} cancel={() => cancel()} /> : null }
    </div>
  );
}

const ConfirmDelete = (props) => {
  const [isopen, notOpened] = useState(true);

  const toggleOpen = (submit=false) => {
    props.cancel();
    notOpened(!isopen)
  };

  const confirmDelete = () => {
    props.confirm();
    notOpened(!isopen)
  };

  return (
    <Modal
        open={isopen}
        size="small"
        basic={false}
      >
        <Modal.Content>
          Are you absolutely sure that you want to delete this  <span style={{fontWeight: 800}}>file</span>? This cannot be undone 🗑. 
        </Modal.Content>
        <Modal.Actions>
          <Button
            icon="remove circle"
            negative
            content="Delete"
            onClick={confirmDelete}
           
          />
            <Button
            content="Cancel"
            onClick={toggleOpen}
          />
        </Modal.Actions>
      </Modal>
  )
}

function getUnique(array){
  var uniqueArray = [];
  
  // Loop through array values
  for(var value of array){
      if(uniqueArray.indexOf(value) === -1){
          uniqueArray.push(value);
      }
  }
  return uniqueArray;
}


@inject("ResourcesStore", "UIStore", "DataEntryStore", "TeamStore")
@observer
export class Files extends React.Component {
  constructor(props){
    super(props)
    const {UIStore, ResourcesStore} = this.props
    this.loadSearch = () => {
        UIStore.set("search",
        "searchFilesData",
        initSearchObj(
          ResourcesStore._fileResourcesNoHidden,
          "resourceID"
        ) 
      );
    }

    this.state = {
      delete: false,
      filetype: FileTypeIcons,
      extensions: []
    }
  }
  componentDidMount() {
    const { UIStore, ResourcesStore } = this.props;
    if (UIStore.search.searchFilesData.length === 0) {
     this.loadSearch()
    }
    let extensions = []
    ResourcesStore.fileResources.map(i => {
      extensions.push(i.url.slice(-3));
    });
    extensions = getUnique(extensions);
    this.setState({extensions});
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.ResourcesStore.fileResources !== this.props.ResourcesStore.fileResources ) {
      let extensions = []
      ResourcesStore.fileResources.map(i => {
        extensions.push(i.url.slice(-3));
      });
      extensions = getUnique(extensions);
      this.setState({extensions});
    }
  }
  getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MUIDataTableBodyCell: {
          root: {
            fontFamily: 'Lato',
            fontSize: '1em',
          },
        },
        MUIDataTableBodyRow: {
          root: {
            zIndex: '1',
          },
        },
        MUIDataTableSelectCell: {
          fixedHeader: {
            zIndex: '1',
          },
          headerCell: {
            zIndex: '1',
          },
        },
        MUIDataTableHeadCell: {
          root: { zIndex: '1' },
          fixedHeader: {
            zIndex: '1',
          },
        },
        MUIDataTable: {
          root: {
            backgroundColor: '#FF000',
          },
          paper: {
            boxShadow: 'none',
            border: '2px solid #e3e8ee',
            borderRadius: 8,
          },
        },
        MUIDataTableFilter: {
          title: {
            fontFamily: "Rubik"
          }
        },
        MuiButton: {
          label: {
            fontFamily: "Rubik"
          }
        },
        MuiInputLabel: {
          animated: {
            fontFamily: "Rubik"
          }
        },
        MuiInputBase: {
          root: {
            fontFamily: "Rubik"
          }
        },
        MuiChip: {
          label: {
            fontFamily: "Rubik"
          }
        },
        MuiTablePagination: {
          caption: {
            fontFamily: "Rubik"
          }
        }
      },
    });
  render() {
    const {ResourcesStore, UIStore, DataEntryStore, AccountStore} = this.props

    const edit = (data) => {
      DataEntryStore.set("fileForUpload", "isNew", false)
      DataEntryStore.set("fileForUpload", "resourceID", data.resourceID)
      DataEntryStore.set("fileForUpload", "type", data.type)
      DataEntryStore.set("fileForUpload", "url", data.url)
      DataEntryStore.set("fileForUpload", "label", data.label)
      DataEntryStore.set("fileForUpload", "teamID", data.teamID)
      DataEntryStore.set("fileForUpload", "tagID", data.tags.length === 0 ? "none" : data.tags[0])
      DataEntryStore.set("fileForUpload", "associations", data.associations)
      UIStore.set("modal", "uploadAssocEdit", true)
      UIStore.set("modal", "uploadFile", true)
    }

    const handleAddButton = () => {
      DataEntryStore.reset("fileForUpload", {"isNew": true, "teamID": "global", "tagID": "none", "associations": {"policies": [], "announcements": []}})
      UIStore.set("modal", "uploadAssocEdit", true)
      UIStore.set("modal", "uploadFile", true)
    }


    const close = () => {
      UIStore.set("modal", "uploadFile", false)
      UIStore.set("modal", "uploadAssocEdit", false)
    }

    const getIcon = (filetype) => FileTypeIcons[filetype] === undefined? FileTypeIcons["default"] : FileTypeIcons[filetype]  


    const deleteFile =  async (val) => {
      await deleteFileresource(val)
      ///add S3 removal
      await ResourcesStore.loadFiles(ResourcesStore._fileResourcesNoHidden.filter(i => i.resourceID !== val))
      this.loadSearch()

    }

    const downloadFile = (S3Key, label) => {
        const ext = "." + S3Key.split(".")[1]
        S3Download("gramercy", S3Key, label, ext)
    }


    const filteredDisplay = () => {
      if (UIStore.search.searchFiles !== "") {
        const results = stupidSearch(
          UIStore.search.searchFilesData,
          UIStore.search.searchFiles
        );
        return ResourcesStore._fileResourcesNoHidden.filter(item => results.includes(item.resourceID));
      } else {
        return ResourcesStore._fileResourcesNoHidden;
      }
    };

    const columns = [
      {
        name: "FileType",
        options: {
          display: false,
          filter: true,
          filterOptions: {
            names: [...this.state.extensions.filter(i => Object.keys(this.state.filetype).includes(i)), "others"],
            logic: (value, filters) => {
              if(filters[0] == value) return false;
              if (filters[0] == "others" && !Object.keys(this.state.filetype).includes(value)) return false;
              return true;
            }
          },
        }
      },
      {
        name: "Title",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <>
                <Icon color="blue" name={getIcon(tableMeta.rowData[0])} />
                <Item style={{cursor: "pointer"}} as="a" onClick={e => downloadFile(data[0].S3Key, value)}>{value}</Item>
              </>
            );
          }
        },
      },
      {
        name: 'Last Updated',
        options: {
          filter: false,
        },
      },
      {
        name: 'Currently Associated With',
        options: {
          filter: false,
        },
      },
      {
        name: 'Channel',
        options: {
          filter: true,
        },
      },
    ];

    const options = {
      elevation: 1,
      selectableRows: 'multiple',
      customToolbarSelect: selectedRows => (
        <CustomToolbarSelect
          data={filteredDisplay()}
          selectedRows={selectedRows}
          handleClick={(data) =>{
            deleteFile(data);
          }}
        />
      ),
      filter: true,
      filterType: 'dropdown',
      print: false,
      responsive: 'scrollMaxHeight',
      viewColumns: false,
      download: false,
      onRowClick: (i, rowData) => {
        let selectedData = filteredDisplay();
        edit(selectedData[rowData.dataIndex])
      },
    };

    const association = (data) => {
      const { TeamStore } = this.props;
      const summary =
        data.associations.policies.length === 0 &&
        data.associations.announcements.length === 0 ? (
          `General Availability: (${data.teamID === "global"
              ? "Global"
              : TeamStore._getTeam(data.teamID).label}
            ${data.tags.length === 0
              ? ""
              : TeamStore._getTag(data.tags[0]).label})`
        ) : (
          `Content (${data.associations.policies.length > 0 ? "Policies: " + data.associations.policies.length.toString()
              :
              ""}
              ${data.associations.announcements.length > 0 ? "Announcements: " + data.associations.announcements.length.toString()
              :
              ""})
        `);

      return summary;
    }

    let data = filteredDisplay().map((file, index) => [
      file.url.slice(-3),
      file.label,
      UTCtoFriendly(file.updated),
      association(file),
      file.ChanID ? file.ChanID : "All",
    ]);

    return (
 
      <div className="LinkTable">
        <Header
          style={{padding: 0, margin: '10px 0 10px'}}
          as="h2"
          content="Storage"
          subheader="Manage files and control access across your teams"
        />

        <MenuContainer>
          <div style={{ textAlign: 'center' }}>
            <Button
              color="blue"
              onClick={(e) => {
                handleAddButton();
              }}
            >
              {' '}
              <Icon name="plus" />
              Create New...
              {' '}
            </Button>
          </div>
        </MenuContainer>

        <UploadFile
          open={UIStore.modal.uploadFile}
          close={e => close}
          selection={""}
          title="Upload and configure a new file"
          output={val => this.loadSearch()}
          includeTeamTag={true}

        />
        <div
          className="muidatatable-custom"
          style={{ marginTop: 15 }}
        >
          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable
              data={data}
              columns={columns}
              options={options}
            />
          </MuiThemeProvider>
        </div>
      </div>
    );
  }
}