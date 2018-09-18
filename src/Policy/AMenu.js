import React from "react";
import "./style.css";
import { Menu, Input, Segment} from "semantic-ui-react";
import { teamOptions } from "./TempObjects";
import {ResourceLinks} from './Links';
import {Attachments} from './Attachments';

export class AMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'links'
    };
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  render() {
    const { activeItem } = this.state
    const currentSegment = (activeItem) => {
        switch(activeItem) {
            case('links'):
                return <ResourceLinks/>
                break;
            case('attachments'):
                return <Attachments/>
                break;
        }
     }
    return(
<div>
<div className="AMenu">
<Menu attached='top' tabular >
<Menu.Item name='links' active={activeItem === 'links'} onClick={this.handleItemClick} />
<Menu.Item
  name='attachments'
  active={activeItem === 'attachments'}
  onClick={this.handleItemClick}
/>
<Menu.Item
  name='automations'
  active={activeItem === 'automations'}
  onClick={this.handleItemClick}
/>
</Menu>
<Segment attached='bottom' className="AMenuChoices">
<div className="AMenuChoices"> {currentSegment(activeItem)}</div>

</Segment>
<br/>
</div>




</div>

    )}}