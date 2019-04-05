import React from "react"
import {Header, Segment, Dropdown, Button, Icon} from "semantic-ui-react"
import { EmailStore } from "../Stores/EmailStore"
import { buildEmail } from "../Scripts/BuildEmail"

export class TestFrame extends React.Component {
    constructor(props){
        super(props)
        this.state={campaigns: [], selected: ""}
        this.refresh = () => {
            const options = EmailStore.allCampaigns.map(i => ({"key": i.campaignID, "text": i.campaignID, "value": i.campaignID}))
            this.setState({campaigns: options})
        }
    }
componentDidMount(){
    this.refresh()
}
render(){

    const loadAccount = () => {
      console.log(buildEmail(this.state.selected))
    }


    
    return(
        <div>
            <Header inverted floated="left">Email Campaign</Header>
            <br/>
            <Segment inverted>
            <div style={{float: "left"}}><Dropdown placeholder="Available Campaigns" options={this.state.campaigns} onChange={(e, val) => this.setState({selected: val.value})} /></div>
            <div style={{float: "right"}}><Button inverted basic onClick={() => this.refresh()}><Icon name="refresh"/></Button></div>
                
                <br/>
                <Button.Group style={{paddingTop: 15}}>
                    <Button onClick={() => loadAccount()} disabled={this.state.selected === ""} inverted>Log Result...</Button>
    
                </Button.Group>
            </Segment>
          


        </div>
    )
}
}