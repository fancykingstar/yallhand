import React from "react";
import { inject, observer } from "mobx-react";
import { Button, Icon, Header, Segment } from "semantic-ui-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import SegmentCard from "./SegmentCard";
import styled from "styled-components";

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: 0,
  margin: `10px`,

  // change background colour if dragging
  background: isDragging ? "lightblue" : "",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  display: "flex",
  flexWrap: "wrap",
  borderRadius: '8px',
  padding: grid,

});





@inject("TeamStore", "DataEntryStore", "UIStore")
@observer
export class SegmentSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { content: "usa", id: "usa", list: "droppable" },
        { content: "canada", id: "canada", list: "droppable" },
        { content: "employee", id: "employee", list: "droppable2" },
        { content: "director", id: "director", list: "droppable2" }
      ]
    };
    this.onDragEnd = this.onDragEnd.bind(this);
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

  render() {

  const AddNew = <Button size="tiny" color="blue" onClick={() => createContent()} icon="plus" circular/>

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
        <Header
          as="h2"
          content="Tags"
          subheader="Design deep segmentation tags for your organization"
        />

        <MenuContainer>
            <div style={{ textAlign: "center" }}>
              <Button color="blue" onClick={() => createContent()}>
                {" "}
                <Icon name="plus" /> Create New Group...{" "}
              </Button>
            </div>
          </MenuContainer>

        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal">
            {(provided, snapshot) => (
               <>  <h4>Locations {AddNew}</h4>
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
                {...provided.droppableProps}
              >
                {this.state.items.filter(i => i.list === "droppable").map((item, index) => (
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
              </div> </>
            )}
          </Droppable>
                            <br/>
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
          </Droppable>
        </DragDropContext>
      </div>
    );
  }
}
