import React from "react";
import { Header } from "semantic-ui-react";
import "react-day-picker/lib/style.css";
import { Send } from "./Send";
import { ChooseTargeting } from "./ChooseTargeting";
import { SelectContentBundle } from "./SelectContentBundle";


export class SendEmail extends React.Component {
  render() {
    return (
      <div className="Segment">
        <Header
          as="h2"
          content="Configure Email"
          subheader="Select email content and targeting then send"
        />
        <SelectContentBundle />
        <br />
        <ChooseTargeting /> <br />
        <Send />
        <br />
      </div>
    );
  }
}
