import React from 'react';
import {Segment, Button, Header, List, Modal, Input} from "semantic-ui-react";
import TimeAgo from 'react-timeago'

import {UIStore} from "../../Stores/UIStore";
import { PoliciesStore } from "../../Stores/PoliciesStore";
import { AnnouncementsStore } from "../../Stores/AnnouncementsStore";
import {contentEdit} from "../../DataExchange/PayloadBuilder";
import {modifyPolicy, modifyAnnouncement} from "../../DataExchange/Up";

export class QandA extends React.Component {
    constructor(props){
        super(props);
        this.answerInput = React.createRef();
        this.state = {data: [], editingIndex: "", editedAnswer: "", deleteIndex: "", confirmDelete: false}
    }

    async setData(){
        const {content, vari} = this.props;
        const source = this.props.mode === "announcement"? AnnouncementsStore:PoliciesStore;
        const variation = await source._getVariation(content, vari);
        this.setState({content, vari, data: variation.qanda || []})
    }

    componentDidMount(){
        if(UIStore.content.variationID) this.setData();
    } 

    componentDidUpdate(){
        if (this.props.vari !== this.state.vari) this.setData();
    }

    focus(){this.answerInput.current.focus()}

    updateState(val){this.setState(val)};

    async submitUpdate(qanda) {
        const {mode} = this.props;
        let patchObj = {qanda};
        const payload = contentEdit(patchObj, this.props.mode, UIStore.content[mode + "ID"], UIStore.content.variationID);
        mode === "policy" ? await modifyPolicy(payload) : await modifyAnnouncement(payload);
      }

    async updateItems(i, del=false){
        let dataCopy = this.state.data.slice();
        if (del) {
            dataCopy.splice(i, 1);
            await this.submitUpdate(dataCopy);
            this.setState({deleteIndex: "", confirmDelete: false});
        }
        else {
        const newQnA = Object.assign(dataCopy[i], {a: this.state.editedAnswer});
        dataCopy.splice(i, 1, newQnA);
        await this.submitUpdate(dataCopy);
        }
    }

    async editInput(i){
        await this.updateState({editingIndex: i});
        this.answerInput.current.focus();
    }

    render(){
        const {confirmDelete, data, editingIndex, deleteIndex} = this.state;
        const editDelete = (i) =>  <div><span onClick={()=>this.editInput(i)} style={{color: "rgb(33, 133, 208)", fontSize: "0.8em", cursor: "pointer"}}>edit</span> <span style={{fontSize: "0.8em"}}> | </span><span onClick={()=>this.updateState({confirmDelete:true, deleteIndex: i})} style={{color: "rgb(33, 133, 208)",fontSize: "0.8em", cursor: "pointer"}}>delete</span></div>
        const editConfirm = (i) =>  <div><span style={{color: "rgb(33, 133, 208)", fontSize: "0.8em", cursor: "pointer"}} onClick={()=> {this.updateItems(i)}}>done</span> <span style={{fontSize: "0.8em"}}> | </span><span onClick={()=>this.updateState({editingIndex: "", editedAnswer: ""})} style={{color: "rgb(33, 133, 208)",fontSize: "0.8em", cursor: "pointer"}}>cancel</span></div>
     

        const qaitem = (item, i) => 
        <List.Item>
        <List.Content style={{paddingLeft: 0}}>
            <List.Header as='a'>{item.q}</List.Header>
            {
                editingIndex !== i? <>
                <List.Description as='a'> {item.a} <span style={{color: "#abacab", fontWeight: "bold"}}><TimeAgo date={item.updated}/></span> </List.Description>
                {editDelete(i)} </>
                :
                <>
                <List.Description as='a'><input ref={this.answerInput}  className="BorderlessTextInput" defaultValue={item.a} onChange={(e) =>this.updateState({editedAnswer: e.currentTarget.value})} /></List.Description>
                {editConfirm(i)}
                </>
            }
        </List.Content>
        </List.Item>


        return (
            <Segment>
              <Modal closeIcon size={"small"} open={confirmDelete} onClose={()=>this.updateState({confirmDelete:false})}>
                <Modal.Header>Delete this Question and Answer</Modal.Header>
                <Modal.Content>
                    <p>Are you sure you want to delete? (this cannot be undone)</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => this.updateItems(deleteIndex, true)} negative>Delete</Button>
                    <Button onClick={()=>this.updateState({deleteIndex:"", confirmDelete: false})}>Cancel</Button>
                </Modal.Actions>
                </Modal>
              <div className="FixedWidth">
                <Header>Q & A</Header>
                { data.length? <List divided relaxed> {data.map((item, i)=> qaitem(item, i))} </List> : <span>This variation has no questions and answers.</span> }
              </div>
         
             
            </Segment>
          );
    }
}