import {S3Download} from "../DataExchange/S3Download"
import { log } from "../DataExchange/Up"
import { ItsLog } from "../DataExchange/PayloadBuilder"

export const downloadFile = (S3Key, label) => {
    const ext = "." + S3Key.split(".")[1]
    S3Download("quadrance-files/gramercy", S3Key, label, ext)
 }

 export const downloadFilePortal = (S3Key, label, resourceID) => {
    const ext = "." + S3Key.split(".")[1]
    S3Download("quadrance-files/gramercy", S3Key, label, ext)
    log(ItsLog(false, {"type": "file", "id": resourceID, "variation": ""}))
 }