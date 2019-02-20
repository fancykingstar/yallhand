let AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REACT_APP_REGION });
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
const bucketRegion = process.env.REACT_APP_REGION;
const IdentityPoolId = process.env.REACT_APP_POOLID;

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  })
});

export const S3Download = (bucket, filename, label, extension) => {
  s3.getSignedUrl(
    "getObject",
    {
      Bucket: bucket,
      Expires: 60,
      Key: filename,
      ResponseContentDisposition: 'attachment; filename ="' + label.split(" ").join("-") + extension + '"'
    },
    function(err, url) {
      var element = document.createElement("a");
      element.setAttribute("href", url);
      element.setAttribute("download", filename);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  );
};
