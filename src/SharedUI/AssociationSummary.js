import React from "react";
import { inject, observer } from "mobx-react";

export const AssociationSummary = inject("TeamStore")(
  observer(props => {
    const { TeamStore } = props;
    const summary =
      props.data.associations.policies.length === 0 &&
      props.data.associations.announcements.length === 0 ? (
        <p>{`General Availability: (${props.data.teamID === "global"
            ? "Global"
            : TeamStore._getTeam(props.data.teamID).label}
          ${props.data.tags.length === 0
            ? ""
            : TeamStore._getTag(props.data.tags[0]).label})`}
        </p>
      ) : (
        <p>
            {`Content (${props.data.associations.policies.length > 0 ? "Policies: " + props.data.associations.policies.length.toString()
                :
                ""}
                ${props.data.associations.announcements.length > 0 ? "Announcements: " + props.data.associations.announcements.length.toString()
                :
                ""})`
            }
        </p>
      );
    return <React.Fragment>{summary}</React.Fragment>;
  })
);
