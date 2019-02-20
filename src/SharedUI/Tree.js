import React from "react";
import { List, Icon } from "semantic-ui-react";
import { TeamControl } from "../QuadranceControls";

export const Tree = props => {
  let collection = [];

  const handleClick = (e, val) => {
    e.preventDefault();
    props.onClick(val);
  };

  const userCount = item => {
    return item.teamID !== "global" ? (
      <div className="UserBadge">{item.count} Users</div>
    ) : null;
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
      item.teamID === "global"
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
              name={item.teamID !== "global" ? icon(item.parent) : "world"}
            />
            <List.Content>
              <List.Header
                className="HeaderLink"
                as="a"
                onClick={item.teamID === "global"? null : e => handleClick(e, item)}
              >
                {item.label}{" "}
              </List.Header>

              {buildTrees(data, id, item.depth + 1, item[id])}
              {userCount(item)}
            </List.Content>
          </List.Item>
        );
      });
    }
  };

  collection = [];
  buildTrees(props.data, props.id, 0);
  return (
    <div>
      <List>{collection}</List>
    </div>
  );
};
