import React, { Fragment } from "react";
import { inject, observer } from "mobx-react";
import { Form } from "semantic-ui-react";


@inject("TeamStore")
@observer
export class TeamSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }
  render() {
    const { TeamStore, defaultVal, placeholder, value, label } = this.props;
    const val = value !== undefined ? {value: value} : {defaultValue: defaultVal !== "" ? defaultVal : "global"}
    const teamList = TeamStore.structureSelect;
    const style = { minWidth: 200 };

    return (
      <Fragment>
        {TeamStore.structure.length !== 1 ?
          <Form.Dropdown
            {...val}
            search
            selection
            label={label === "" ? "Team" : label}
            style={style}
            options={teamList}
            onChange={(e, val) => {
              const text = teamList.filter(t => t.value === val.value)[0].text
              this.props.outputVal({value: val.value, text: text})
            }}
            placeholder={placeholder !== undefined ? placeholder : ""}
          />
          :
          null
        }
      </Fragment>
    )
  }
}
