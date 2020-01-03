import React from "react";
import { inject, observer } from "mobx-react";
import { Button, Icon, Header, Segment } from "semantic-ui-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import SegmentCard from "./SegmentCard";
import FadeIn from 'react-fade-in';

import styled from "styled-components";
import { giveMeKey } from "../SharedCalculations/GiveMeKey";


const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: 0,
  margin: `10px`,
  background: isDragging ? "lightblue" : "",
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  display: "flex",
  flexWrap: "wrap",
  borderRadius: '8px',
  padding: grid,

});





@inject("TeamStore")
@observer
export class SegmentSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: "",
      createNewGroup: false,
      newRoot: "",
      groupLabel: "",
      subTagLabel: "",
      items: [
        // { content: "usa", id: "usa", list: "droppable" },
        // { content: "canada", id: "canada", list: "droppable" },
        // { content: "employee", id: "employee", list: "droppable2" },
        // { content: "director", id: "director", list: "droppable2" }
      ]
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }
  
  updateState(obj){
    this.setState(obj);
  }

  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  onDragEnd(result) {
    if (!result.destination || (result.destination.droppableId === result.source.droppableId)) {
      return;
    }

    let selected = this.state.items.filter(i=>i.id === result.draggableId)[0];
    selected.list = result.destination.droppableId;
    const items = [...this.state.items.filter(i=>i.id !== result.draggableId), selected]
    this.setState({ items });
  }

  createNewGroup(){
    console.log(this.state.groupLabel)
    this.setState({createNewGroup: false, groupLabel: ""})
  }

  createNewRoot(label){
    console.log(label)
    this.setState({newRoot:""})
  }

  componentDidMount() {
    const {TeamStore} = this.props;
    const items = TeamStore.segmentation.filter(s=> !s.isGroup && s.parent === "self");
    this.setState({items});
  }

  render() {

  const {TeamStore} = this.props;
  const AddNew = <Button size="tiny" color="blue" onClick={() => this.updateState({newRoot: "droppable"})} icon="plus" circular/>

  const temporaryDroppable = <FadeIn> <Droppable droppableId="droppable2" direction="horizontal">
  {(provided, snapshot) => (
    <>
     <input onChange={(e)=>this.updateState({groupLabel: e.currentTarget.value})} placeholder="Enter new group name" style={{fontWeight: 700, fontSize: "1.1em",borderWidth: 0, border: "none", backgroundColor: "#f9f9f9", fontFamily: "Lato" }} type="text" maxlength="24"  />
  
       <Button onClick={this.createNewGroup.bind(this)} disabled={!this.state.groupLabel} circular color={"blue"} size="mini">Done</Button>
       <Button onClick={()=> this.updateState({createNewGroup: false, groupLabel: ""})}  circular size="mini">Cancel</Button>
   
    <div
      ref={provided.innerRef}
      style={Object.assign(getListStyle(snapshot.isDraggingOver), {minHeight: '125px', marginTop: 10})}
      {...provided.droppableProps}
    >
      {provided.placeholder}
    </div></>
  )}
</Droppable></FadeIn>

  const MenuContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  paddingbottom: 30px;
  @media (max-width: 580px) {
    justify-content: center;
    flex-direction: column;
  }
`;

    return (
      <div>
        {JSON.stringify(this.state)}
        <Header
          as="h2"
          content="Segmentation"
          subheader="Use deep tags to effectively route information and access across your organization"
        />

        <MenuContainer>
            <div style={{ textAlign: "center" }}>
              <Button disabled={this.state.createNewGroup} color="blue" onClick={() => this.updateState({createNewGroup: true})}>
                {" "}
                <Icon name="plus" /> Create New Group...{" "}
              </Button>
            </div>
          </MenuContainer>

        <DragDropContext onDragEnd={this.onDragEnd}>

          {TeamStore.segmentation.filter(s=>s.isGroup).map(group => 

          <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => (
          <>  <h4>{group.label} {AddNew}</h4>
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {this.state.items.filter(i => i.group === group.segmentationID).map((item, index) => (
                <Draggable key={"segment" + giveMeKey()} draggableId={item.segmentationID} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <SegmentCard content={item.label} />
                    </div>
                  )}
                </Draggable>
              ))}{this.state.newRoot === "droppable" &&  <FadeIn><SegmentCard createNewRoot={this.createNewRoot.bind(this)} cancel={()=>this.updateState({newRoot: ""})} newRoot/></FadeIn>}
              {provided.placeholder}
            </div> </>
          )}
          </Droppable>

          )}
          
                            {/* <br/>
          <Droppable droppableId="droppable2" direction="horizontal">
            {(provided, snapshot) => (
              <>  <h4>Employee Classes {AddNew}</h4>
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
                {...provided.droppableProps}
              >
                {this.state.items.filter(i => i.list === "droppable2").map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <SegmentCard content={item.content} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div></>
            )}
          </Droppable> */}
          {this.state.createNewGroup && <><br/> {temporaryDroppable} </>}
        </DragDropContext>
      </div>
    );
  }
}
