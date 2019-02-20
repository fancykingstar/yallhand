const uuidv4 = require('uuid/v4')
const fileExtensionPattern = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi
export const GenerateFileName = (acct, filename) => (
   acct.accountID + "_" + uuidv4() + filename.match(fileExtensionPattern)
)



 