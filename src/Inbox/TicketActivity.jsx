import React from "react";
import {Row, Col} from "reactstrap";
import {Label} from "semantic-ui-react";
import TimeAgo from 'react-timeago'
import {AccountStore} from "../Stores/AccountStore";
import { autorun } from "mobx";

export const TicketActivity = (props) => {
    return(
        <div style={{maxHeight: "350px", overflowY: "auto", overflowX: "hidden"}}>
            {props.activity.map(act => (
            <Row style={{ padding: "3px 0 3px" }}>
                <Col style={{ color: "rgba(0, 0, 0, 0.54)" }} md={6}>
                <p style={{ fontSize: "0.9em" }}>
                    Set as{" "}
                    <span style={{ color: "rgb(60, 60, 60)" }}>
                    {act.stage}
                    </span>{" "}
                    by{" "}
                    <Label size="mini">
                    {AccountStore._getUser(act.userID).displayName}
                    </Label>{" "}
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