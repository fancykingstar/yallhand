import React from 'react';
import {inject, observer} from 'mobx-react';
import { Form, Icon, Checkbox } from "semantic-ui-react";
import { Input } from "../SharedUI/Input";
import { TeamSelect } from "../SharedUI/TeamSelect";
import { TagSelect } from "../SharedUI/TagSelect";
import { AccountStore } from "../Stores/AccountStore";
import { TeamStore } from "../Stores/TeamStore";
import { ChannelStore } from "../Stores/ChannelStore";
import { Col, Row, } from 'reactstrap';
import Collapse from '@material-ui/core/Collapse';

export const InviteUser = inject("AccountStore")(observer((props) => {
  const features = ["Teams", "FAQs", "Announcements", "Surveys", "Tasks", "Service Desk", "Email Campaigns"].map(feature => ({text: feature, value: feature}))

  const { teamID, tagID, boss, isAdmin, email, adminLimits } = props.info;
  const { multipleRows } = props

  const setField = (content) => {
    let adminLimit = false;
    if (content.features || content.channels) {
      adminLimit = adminLimits? Object.assign({}, adminLimits) : {features: [], channels: []};
      adminLimit = Object.assign(adminLimit, content);
    }

    props.updateFields(adminLimit? {adminLimits: adminLimit} : content, props.id);
  }

  const removeRow = () => {
    props.removeRow(props.id)
  }

  const resPadding = {paddingTop: 10}

  return( 
    <>
    <Row className="row align-items-center" style={{paddingBottom: multipleRows? "20px": 0}}>
           <Col xl style={resPadding}>
            <Input placeholder="jane@placethatwework.co" value={email} label="Email Address:" onChange={(e, v) => setField({email: v.value})}/>
           </Col>
           {TeamStore.structure.length > 1 && <Col xl style={resPadding}><TeamSelect label="Choose Team:" value={teamID} outputVal={e => setField({teamID: e.value, teamName: e.text})}/></Col>}
           {TeamStore.tags.length > 0 && <Col xl style={resPadding}><TagSelect  label="Choose Tag (optional):" value={tagID} outputVal={e => setField({tagID: e})}/></Col>}
       <Col xl style={resPadding}><Form.Dropdown
          label="Reports to (optional):"
          fluid
          search
          selection
          value={boss}
          onChange={(e, val) => setField({boss:val.value})}
          options={AccountStore._getUsersSelectOptions()}
        /></Col>
         {
          multipleRows && 
            <Col xs="1" style={resPadding}>
              <div style={{paddingTop: 25}}>
              <Icon disabled name='times circle close-icon' onClick={removeRow}></Icon>
              </div>
            </Col>
          }

    
       </Row>
                {
        !multipleRows && <div style={{paddingTop: 10, paddingBottom: 10}}>
        <Row>
          <Col>
            <Checkbox toggle checked={isAdmin} 
            onChange={() => setField({isAdmin: !isAdmin})} 
            label="Admin"/>
          </Col>
          </Row>
          <Collapse in={isAdmin}>
                  <Row>
                  <Col>
                  <Form>
 
                    <Form.Dropdown className="FixSemanticLabel" options={features} onChange={(e, {value}) => setField({features: value})} selection multiple label="Limit admin to Yallhands select features (optional)" />
                    <Form.Dropdown className="FixSemanticLabel" options={ChannelStore._channelSelectNoAll} onChange={(e, {value}) => setField({channels: value})} multiple selection label="Limit admin to specific channels (optional)" />
      
          
                  </Form>
                  </Col>
                  </Row>
          </Collapse></div>
      }

    
     </>
  )
}))