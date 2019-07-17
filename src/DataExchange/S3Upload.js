import React from 'react';
import _ from "lodash";
import {ResourcesStore} from "../Stores/ResourcesStore";

export const S3Upload = async (ACL = "public-read", bucket, filename, file, payload = {})  => {
//empty payload indicates an image
  let data = new FormData();
  data.append('file', file);
  data.append('filename', filename);

  if(!_.isEmpty(payload)) {
    const allKeys = Object.keys(payload)
    allKeys.forEach(i => data.append(i, typeof(payload[i]) !== 'object'? payload[i]: JSON.stringify(payload[i])));
  }

  const r = await fetch(`${process.env.REACT_APP_API_URL}fileresources/${bucket}/${filename}`, { method: 'POST', body: data }).then(r=>r.json());
  if (!_.isEmpty(payload)) await ResourcesStore.loadFiles([...ResourcesStore.fileResources, ...[r]]);
  return r;
};

// Returns:
// Bucket: "quadrance-files"
// Key: "gramercy/A1_1547328225233.png"
// Location: "https://quadrance-files.s3.amazonaws.com/gramercy/A1_1547328225233.png"
// key: "gramercy/A1_1547328225233.png"