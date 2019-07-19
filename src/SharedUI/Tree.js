import React from "react";
import { List, Icon, Label } from "semantic-ui-react";
import { TeamControl } from "../QuadranceControls";
import { PoliciesStore } from "../Stores/PoliciesStore";
import { AnnouncementsStore} from "../Stores/AnnouncementsStore";
import { ResourcesStore} from "../Stores/ResourcesStore";

export const Tree = props => {
  let collection = [];
  const id = props.id;
  const handleClick = (e, val) => {
    e.preventDefault();
    props.onClick(val);
  };



  const assoc = item => {

    let assocContent = [];
    [...AnnouncementsStore.allAnnouncements, ...PoliciesStore.allPolicies].forEach(i => {
      i.variations.forEach(vari => {
        const mode = i.policyID? "policy":"announcement"
        if(vari[props.id] === item[props.id]){assocContent.push({label: vari.label !== ""? vari.label: i.label, mode, id: mode === "policy"? "policyID":"announcementID"})}
      })
    });
    ResourcesStore.fileResources.forEach(f => f[props.id] === item[props.id]? assocContent.push({label: f.label, mode: "file"}): null)
    return (
      <React.Fragment>  
        {/* <span style={{paddingLeft: 15, fontSize: '.9em'}}> */}
          { item[id] !== "global" && item.count !==0 ?<span style={{paddingLeft: 5}}><Label size="small"><Icon name="group"/>{item.count} </Label></span>: null}{" "}
          {!assocContent.filter(i=>i.mode ==="announcement").length? null : <span style={{paddingLeft: 5}}><Label size="small"><Icon size="small" name="bullhorn"/>{assocContent.filter(i=>i.mode ==="announcement").length} </Label></span>}
          {!assocContent.filter(i=>i.mode ==="policy").length? null:<span style={{paddingLeft: 5}}> <Label size="small"><Icon  size="small" name="question"/>{assocContent.filter(i=>i.mode ==="policy").length} </Label></span>}
          {!assocContent.filter(i=>i.mode ==="file").length? null:<span style={{paddingLeft: 5}}>  <Label size="small">  <Icon size="small" name="cubes"/>{assocContent.filter(i=>i.mode ==="file").length}  </Label> </span>}
      
        {/* </span> */}
        </React.Fragment>
    
      ) 
  };

  const buildTrees = (data, id, depth, parent = "self") => {
    const icon = val => (val === "self" ? "circle" : "triangle right");
    const marginAdjust = () => {
      let i = 0,
        margin = 20;
      let allAdjustments = {};
      while (i <= TeamControl.maxDepth) {
        allAdjustments[i] = margin;
        i++;
        margin = margin + 20;
      }
      return allAdjustments;
    }; // outputs { 0: 20, 1: 40, 2: 60 };

    const checkGlobalMargin = item =>
      item[id] === "global"
        ? { marginLeft: 0 }
        : { marginLeft: marginAdjust()[item.depth] };
    const currentList = data
      .filter(item => item.depth === depth)
      .filter(item => item.parent === parent);
    if (currentList.length > 0) {
      currentList.reverse().forEach(item => {
        collection.unshift(
          <List.Item
            value={item[id]}
            key={item.label}
            style={checkGlobalMargin(item)}
          >
            <Icon
              color="blue"
              name={item[id] !== "global" ? icon(item.parent) : "world"}
            />
            <List.Content>
              <List.Header
                style={{marginTop: -2}}
                as="a"
                onClick={item[id] === "global"? null : e => handleClick(e, {
                  item,
                  assoc: assoc(item).props.children.filter(i=> typeof(i) === "object" && i !== null).length > 0,
                  children: props.data.filter(i=>i.parent === item[id]).length > 0
                })}
              >
                {item.label}{" "} 
                 <span style={{color: '#787878'}}> {assoc(item)} </span>
              </List.Header>
                <div style={{padding: 5}}>
              {buildTrees(data, id, item.depth + 1, item[id])}
          
             
              </div>
            </List.Content>
          </List.Item>
        );
      });
    }
  };

  collection = [];
  buildTrees(props.data, props.id, props.id === "teamID"? -1 : 0);
  return (
    <div>
      <List>{collection}</List>
    </div>
  );
};
