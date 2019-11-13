import React from "react";
import {Row, Col} from "reactstrap";
import TimeAgo from 'react-timeago';
import {Label} from "semantic-ui-react";
import {AccountStore} from "../Stores/AccountStore";

export const TicketData = (props) => {
    return(
      <div style={{maxHeight: "350px", overflowY: "auto", overflowX: "hidden"}}>

        <div>
          {props.activity
            .filter(act => Object.keys(act.data).length)
            .map(act => {
              const res = Object.keys(act.data)
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
                          {act.data[datapnt]}{" "}
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
                    {/* <Row
                      style={{
                        alignItems: "center",
                        paddingBottom: 5
                      }}
                    >
                     
                      
                    </Row> */}
                  </>
                ));
              return res;
            })}
        </div>
        </div>
    )
}