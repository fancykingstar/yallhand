import React from "react";
import {Row, Col} from "reactstrap";
import TimeAgo from 'react-timeago';
import {Label, Icon} from "semantic-ui-react";
import { TicketContentSource } from "./TicketContentSource";
import {AccountStore} from "../Stores/AccountStore";
import {ResourcesStore} from "../Stores/ResourcesStore";
import {S3Download} from "../DataExchange/S3Download";


const downloadFile = (S3Key, label) => {
  const ext = "." + S3Key.split(".")[1]
  S3Download("gramercy", S3Key, label, ext)
}

const getFileValue = (id, key) => ResourcesStore._getFile(id)[key]



export const TicketData = (props) => {
    return(
      <div style={{maxHeight: "350px", overflowY: "auto", overflowX: "hidden"}}>

        <div>
          {props.activity
            .filter(act => Object.keys(act.data).length && !Object.keys(act.data).includes('variationID'))
            .map(act => {
              const res = 
              // Object.keys(act.data).includes("variationID")?
              // (<>
              // <Row style={{ padding: "3px 0 6px" }}>
              //   <Col>
              //     <TicketContentSource content={props.content} />
              //   </Col>
              //    <Col style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "0.9em" }} >
              //       <TimeAgo date={act.updated} /><br/>
              //       <Label size="mini"> { AccountStore._getUser(act.userID) .displayName } </Label>{" "}
              //    </Col>
              // </Row>
              //  <Row style={{ padding: "3px 0 6px" }}>
              //  <Col md={6}>
              //  <span style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "0.9em" }} > {"Question"}{" "} </span>{" "} <br />
              //  <span style={{ color: "rgba(0, 0, 0, 0.74)", fontSize: "0.9em" }} > {act.data.q}{" "} </span>
              // </Col>
              // </Row>
              // </>)
              // :
              Object.keys(act.data)
                .filter(datapnt => datapnt !== "id")
                .map(datapnt => (
                  <>
        
                    <Row style={{ padding: "3px 0 6px" }}>
                      <Col md={6}>
                        <span
                          style={{
                            color: "rgba(0, 0, 0, 0.54)",
                            fontSize: "0.9em"
                          }}
                        >
                          {datapnt}{" "}
                        </span>{" "}
                        <br />
                        <span
                          style={{
                            color: "rgba(0, 0, 0, 0.74)",
                            fontSize: "0.9em"
                          }}
                        >

                          {datapnt === "file"?  <span style={{color: "#15596f",  cursor: "pointer"}} onClick={()=>downloadFile(getFileValue(act.data.file,"S3Key"), getFileValue(act.data.file,"label"))} style={{color: "#15596f",  cursor: "pointer"}}><Icon size="small" name="attach"/>{getFileValue(act.data[datapnt],"label")}</span>  : act.data[datapnt]}{" "}
                        </span>
                      </Col>
                      <Col 
                         style={{
                          color: "rgba(0, 0, 0, 0.54)",
                          fontSize: "0.9em"
                      }}
                 
                      >
                        <TimeAgo date={act.updated} /><br/>
                        {/* <Col> */}
                        <Label size="mini">
                          {
                            AccountStore._getUser(act.userID)
                              .displayName
                          }
                        </Label>{" "}
                      </Col>
                      {/* </Col> */}
                    </Row>
                   
                  </>
                ));
              return res;
            })}
        </div>
        </div>
    )
}