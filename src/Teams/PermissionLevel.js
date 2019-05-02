import React from "react"
import { Dropdown} from "semantic-ui-react"

export const PermissionLevel = (props) => {
  const variation = props.value === undefined ? 
  <Dropdown
            inline
            defaultValue={
              props.value === false? 
              "all": "configure"
            }
            onChange={(e, val) => props.output(val.value)}
            options={[
              { text: "Edit/View Everything 👑", value: "all" },
              { text: "Configure", value: "configure" }
            ]}
          />
          :
          <Dropdown
            inline
            value={
              props.value 
            }
            onChange={(e, val) => props.output(val.value)}
            options={[
              { text: "Edit/View Everything 👑", value: "all" },
              { text: "Configure", value: "configure" }
            ]}
            // defaultValue={"all"}
          />
    return(
        <React.Fragment>
        <span style={{ paddingBottom: 10 }}>
          Permission Level:{" "}
          {variation}
        </span>
      </React.Fragment>
    )
}