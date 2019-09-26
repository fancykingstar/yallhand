import React from "react";
import { Input } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
export const ChannelSearch = inject("UIStore")(
  observer(props => {
    const { UIStore } = props;
    return (
      <div className="ChannelSearch">
        <Input
          inverted
          icon="search"
          transparent
          size="tiny"
          placeholder="search channels..."
          onChange={(e, val) => UIStore.set("search", "channel", val.value)}
        />
      </div>
    );
  })
);
