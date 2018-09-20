import React from "react";
import { QFields } from "./QFields";
import { AFields } from "./AFields";
import { PubControls } from "./PubControls";

export const NewEditPolicy = () => {
  return (
    <div className="PolicyFrame">
      <PubControls />
      <QFields />
      <AFields />
    </div>
  );
};
