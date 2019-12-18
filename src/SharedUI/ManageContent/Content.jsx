import React from "react";
import {TeamStore} from "../../Stores/TeamStore";
import {Row, Col} from "reactstrap";
import { Header, Input, Form, Dropdown, Button, Menu } from "semantic-ui-react";
import {Chip, Fab} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { PublishControls } from "../../SharedUI/NewEditContent/PublishControls";

import {ChooseTargeting} from "../../SharedUI/ChooseTargeting";
import {Wysiwyg} from "../../SharedUI/Wysiwyg";
import BackButton  from "../../SharedUI/BackButton";
import VariationChip from "./VariationChip";
import MenuItem from '@material-ui/core/MenuItem';



export class Content extends React.Component {
    constructor(props){
        super(props);
        this.state={showTargeting: false, activeItem:"", expand: false};
    }

    handleItemClick = (e, {name}) => {this.setState({active:name})}

    sectionStyle = {paddingTop: 10, paddingBottom: 10}


    variations = <><span>Variations</span><br/>
    
    <div style={{display: "flex"}}>
    <VariationChip/>
    <VariationChip/>
    <Chip label="SF / Manager" /> 
     <Fab onClick={()=>this.setState({showTargeting: true})} style={{marginLeft: 5, marginTop: -3}} size="small"><AddIcon/></Fab>
     
    </div>
 

    
    

     </>

    variationTarget = <>
        
              <ChooseTargeting
                noPass
                NoSelectUsers 
                label={"share " + "FAQ"} 
                input= {""}
                output={val=> console.log(val)}
                />
        
    </>



    render(){
        const {showTargeting} = this.state;
        const menuItems = ["Featured Image","Channel", "Q and A" , "Searchability", "Review Alerts", "Schedule", "History", "Settings"].map(item => <Menu.Item
            name={item}
            active={this.state.activeItem === {item}}
            onClick={this.handleItemClick}
          />)
        return(
            <>
            <BackButton/>
            {JSON.stringify(this.state.expand)}
              <Header as="h2"
          style={{padding: 0, margin: 0}}
          >
          Manage Content
          <Header.Subheader>
              {true? "FAQ" : "Announcement"}
          </Header.Subheader>
        </Header>

       
            <Form style={this.sectionStyle}>  
                <Form.Dropdown defaultValue={"parent"} options={[{text: "Parent Title", value: "parent"},{text:"Variation Title", value: "vari"}]} />
                <Form.Input style={{marginTop: -8}} className="FixSemanticLabel"  placeholder="Hi"><input maxLength={72}/></Form.Input>

            </Form>
         
                {showTargeting? this.variationTarget : this.variations}


           

            <div style={this.sectionStyle}>
            <Wysiwyg  error={false} loadContent={null} border output={e=>console.log(e)}/>
            
            <div>
        
          <Row style={{padding: "10px 0 10px 15px"}}>
    
            <PublishControls unsavedWarning={false} stage={"draft"} onClick={val => console.log(val)} />
            <Button>Preview</Button>
          </Row>
          
          <br/>
        </div>
            </div>
            <div style={this.sectionStyle}>
            <Menu vertical> {menuItems} </Menu>
            </div>

          

            </>
        )
    }
}