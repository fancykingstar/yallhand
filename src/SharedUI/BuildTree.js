import React from "react"
import {List, Icon} from "semantic-ui-react"

let collection = []

const buildTrees = (data, id, depth, parent = "self") => {
    const icon = (val) => val === "self" ? "circle" : "triangle right"
    const marginAdjust = {0: 0, 1: 20, 2: 40}
    const currentList = data
        .filter(item => item.depth === depth)
        .filter(item => item.parent === parent)
    if (currentList.length > 0) {
        currentList.forEach(item => {
       
            collection.unshift(
                    
                      <List.Item value={item[id]} key={item.label} style={{marginLeft: marginAdjust[item.depth]}}>
                         <Icon color="blue" name={icon(item.parent)} />
                          <List.Content>
                           <List.Header>{item.label}</List.Header>
                           
                           {buildTrees(data, id, item.depth + 1, item[id] )}
                        
                         </List.Content>
                         </List.Item>
                         )
                        }
        )


    }
        
}


export const ListTree = (props) => {
    collection = []
    buildTrees(props.data, props.id, 0 )
    return(
        <div>
          
            <List>
                {collection}
            </List>
        </div>
    )
}


