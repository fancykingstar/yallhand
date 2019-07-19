
import React from 'react';
import {apiCall} from "./Fetch";
import _ from "lodash";
import {ResourcesStore} from "../Stores/ResourcesStore";


export const S3Download = async (bucket, filename, label, extension) => {
  const payload = {bucket, filename, label, extension}
  const r = await apiCall('fileresources/download',"POST", payload).then(r=>r.json())
  var element = document.createElement("a");
  element.setAttribute("href", r.url);
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

 
//   );
};
