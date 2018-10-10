import React from "react";
import { QFields } from "./QFields";
import { AFields } from "./AFields";
import { PubControls } from "./PubControls";

export const NewEditPolicy = ({match}) => {
  return (
    <div className="PolicyFrame">
      <PubControls variationID={match.params.id}/>
      <QFields />
      <AFields />
    </div>
  );
};
