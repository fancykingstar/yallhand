import React from "react";
import {Row, Col} from "reactstrap";
import {Label} from "semantic-ui-react";
import TimeAgo from 'react-timeago'
import {AccountStore} from "../Stores/AccountStore";
import {UserStore} from "../Stores/UserStore";
import {isEmpty} from "lodash";



export const TicketActivity = (props) => {
    const openMsg = (stage, index) => {
        const firstOpen = () => {
            let val = ""
            for (let i = props.activity.length - 1; i !== -1; i--) {
               if(props.activity[i].stage === "open") {
                 val = i;
                 break;
               }
              };
          return val }
        if(stage === "open-pending" && props.activity.length === 1) return(    <>{`Created`} <span style={{ color: "rgb(60, 60, 60)" }}></span>{" "} </> );
        else if (stage === "open" && index === firstOpen())  return( <>{`Accepted`} <span style={{ color: "rgb(60, 60, 60)" }}></span>{" "} </> );
        else return( <>{`Set as open`} <span style={{ color: "rgb(60, 60, 60)" }}></span>{" "} </> );
    };

    const closeMsg = (stage, index) => {
    if (stage === "closed-cant") return <>{`Closed (unable to fulfill)`}{" "} </> 
    else if (stage === "closed-wont") return <>{`Closed (outside of scope/declined)`}{" "} </> 
    else if (stage === "closed-duplicate") return <>{`Closed (duplicate)`}{" "} </> 
    else return <>{`Closed`}{" "} </> 
    }


    const activityMsg = (act, i) => {
        if (act.stage.includes('open')) return openMsg(act.stage, i)
        else if (act.stage.includes('close')) return closeMsg(act.stage, i)
        else if (!act.stage && isEmpty(act.data)) return <>{`Assigned to `}<Label size="mini"> {!act.assignee? "Unassigned": act.userID === act.assignee? "Self" : AccountStore._getUser(act.userID)} </Label>{" "} </>
        else if (!act.stage) return <>{`${Object.keys(act.data).includes("memo")? "Memo" : "File    "} added `}</> 
        else return <>{`Set as `}<span style={{ color: "rgb(60, 60, 60)" }}> {act.stage} </span>{" "} </> 
        }
    


    return(
        <div style={{maxHeight: "350px", overflowY: "auto", overflowX: "hidden"}}>
            {props.activity.map((act,i) => (
            <Row style={{ padding: "3px 0 3px" }}>
                <Col style={{ color: "rgba(0, 0, 0, 0.54)" }} md={6}>
                <p style={{ fontSize: "0.9em" }}>

                { activityMsg(act, i) }

                by{" "} <Label size="mini"> {AccountStore._getUser(act.userID).displayName} </Label>{" "} 
                
                
                </p>
                </Col>
                <Col
                style={{
                    color: "rgba(0, 0, 0, 0.54)",
                    fontSize: "0.9em"
                }}
                >
                {" "}
                <TimeAgo date={act.updated} />
                </Col>
            </Row>
            ))}
        </div>

    )
}