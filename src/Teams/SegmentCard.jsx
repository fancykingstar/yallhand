import React from "react";
import { fade, makeStyles, withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import Collapse from "@material-ui/core/Collapse";
import { useSpring, animated } from "react-spring/web.cjs"; // web.cjs is required for IE 11 support
import FadeIn from 'react-fade-in';
import { TeamStore } from "../Stores/TeamStore";

const useStyles = makeStyles({
  card: {
    width: 325
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

const StyledTreeItem = withStyles(theme => ({
  iconContainer: {
    "& .close": {
      opacity: 0.3
    }
  },
  group: {
    marginLeft: 12,
    paddingLeft: 12,
    borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`
  }
}))(props => <TreeItem {...props} TransitionComponent={TransitionComponent} />);

function TransitionComponent(props) {
  const style = useSpring({
    from: { opacity: 0, transform: "translate3d(20px,0,0)" },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`
    }
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

const getNestedChildren = (arr, parent) => {
  var out = []
  for(var i in arr) {
      if(arr[i].parent === parent) {
          var children = getNestedChildren(arr, arr[i].segmentID)
          if(children.length) { arr[i].children = children }
          out.push(arr[i])
      }
  }
  return out
}


export default function SegmentCard(props) {
  const [label, setLabel] = React.useState(0);
  const classes = useStyles();

  const handleSubmit = (e) => {
    e.preventDefault();
    props.createNewRoot(label);
  }

  const relatedSegments = TeamStore.segmentation.filter(s => !s.isGroup).filter(s=> s.root === props.root);
  const nestedObjForTree = Object.assign(TeamStore._getSegment(props.root), {children: getNestedChildren(relatedSegments, props.root)});
  console.log(JSON.stringify(nestedObjForTree));


  return (

    <Card style={props.newRoot !== undefined? {margin: 10}:{}} className={classes.card}>
      {
        props.newRoot === undefined?<>
        <CardContent>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          <StyledTreeItem nodeId="1" label={props.content}>
            <StyledTreeItem nodeId="2" label="Blah" />
            <StyledTreeItem nodeId="3" label="Chrome" />
            <StyledTreeItem nodeId="4" label="Webstorm">
              <StyledTreeItem nodeId="5" label="Chromea" />
            </StyledTreeItem>
          </StyledTreeItem>
        </TreeView>
      </CardContent>
      <CardActions>
        <Button size="small">+ Sub-Tag</Button>
        <Button size="small">Rename</Button>
        <Button size="small">Move</Button>
        <Button size="small">Delete</Button>
      </CardActions></>
      :
      <CardContent>
      <form onSubmit={handleSubmit}>
         <input onChange={e=>setLabel(e.currentTarget.value)} placeholder="Enter group name" style={{borderWidth: 0, border: "none", fontFamily: "Rubik" }} type="text" maxlength="36"  />
        <br/>
       <Button as="input" type="submit" disabled={!label} circular color={"blue"} size="mini">Done</Button>
       <Button onClick={()=>{props.cancel}}  circular size="mini">Cancel</Button>
       </form>
      
      </CardContent>
      }
    </Card>

  );
}
