import React, { Fragment } from "react";
import { inject, observer } from "mobx-react";
import { Form } from "semantic-ui-react";
import { giveMeKey } from "../SharedCalculations/GiveMeKey";

@inject("TeamStore")
@observer
export class TagSelect extends React.Component {
  render() {
    const { TeamStore, defaultVal, placeholder, value } = this.props;
    const style = { minWidth: 200 };
    const label = this.props.label === "" ? "Tag" : this.props.label
    const val = value !== undefined ? {value: value} : {defaultValue: defaultVal === undefined ? null : defaultVal.length === 0 ? "none": defaultVal[0]}

    const tagsElement = TeamStore.tagsSelect.map((tag, i) => {
      return {
        key: giveMeKey(),
        id: tag.tagID ? tag.tagID : i,
        text: tag.text ? tag.text : tag.label,
        value: tag.value ? tag.value : tag.tagID,
      }
    });

    return (
      <Fragment>
        {tagsElement.length > 0 ?
          <Form.Dropdown
            {...val}
            search
            selection
            label={label}
            style={style}
            options={tagsElement}
            onChange={(e, val) => this.props.outputVal(val.value)}
            placeholder={placeholder !== undefined ? placeholder : ""}
          />
          :
          null
        }

      </Fragment>
    )
  }
}
