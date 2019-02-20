import React from "react";
import { Form, Icon, Input } from "semantic-ui-react";
import { giveMeKey } from "../SharedCalculations/GiveMeKey";

export class MultipleInputFields extends React.Component {
  render() {
    const onChange = val => {
      this.props.onChange(val);
    };
    const allTheFields = this.props.input.map(attribute =>
      attribute.prefix !== null ? (
        <React.Fragment key = {"multipleInptsFragements" + giveMeKey()}>
          <Form.Input
      
            label={
              <span>
                <Icon name={attribute.label.toLowerCase()} /> {attribute.label}{" "}
              </span>
            }
          >
            {" "}
            <Input
              key = {"multipleInpts" + giveMeKey()}
              label={attribute.prefix}
              value={attribute.value}
              onChange={(e, val) =>
                onChange({ label: attribute.label, value: val.value })
              }
            />
          </Form.Input>
        </React.Fragment>
      ) : (
        <Form.Input
          label={attribute.label}
          key = {"multipleInpts" + giveMeKey()}
          value={attribute.value}
          onChange={(e, val) =>
            onChange({ label: attribute.label, value: val.value })
          }
        />
      )
    );
    return (
      <React.Fragment>
       {allTheFields}
      </React.Fragment>
    );
  }
}
