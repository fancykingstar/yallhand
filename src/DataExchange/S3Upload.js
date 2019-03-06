let AWS = require("aws-sdk");
AWS.config.update({ 
  region: process.env.REACT_APP_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY });

export const S3Upload = (ACL = "public-read", bucket, filename, file) => {
  return new Promise((resolve, reject) => {
    let s3 = new AWS.S3({
      apiVersion: "2006-03-01",
      params: { Bucket: bucket }
    });
    let uploadObj = {
      Key: filename,
      Body: file,
      ContentType: "image/png"
    };
    if (ACL !== "public-read") {
      uploadObj.ServerSideEncryption = "AES256";
    }
    else {
      uploadObj.ACL = "public-read"
      console.log(uploadObj)
    }
    s3.upload(uploadObj, function(err, data) {
      if (err) {
        console.log("error", err)
        reject(null);
      }
      console.log("data", data)
      resolve(data);
    });
  });
};

// Returns:
// Bucket: "quadrance-files"
// Key: "gramercy/A1_1547328225233.png"
// Location: "https://quadrance-files.s3.amazonaws.com/gramercy/A1_1547328225233.png"
// key: "gramercy/A1_1547328225233.png"