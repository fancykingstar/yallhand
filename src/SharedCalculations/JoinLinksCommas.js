import React from 'react'
import { giveMeKey } from './GiveMeKey';
import {S3Download} from "../DataExchange/S3Download"

const downloadFile = (S3Key, label) => {
    const ext = "." + S3Key.split(".")[1]
    S3Download("quadrance-files/gramercy", S3Key, label, ext)
 }

export const JoinLinksCommas = (len, list, label, type) => {
    if(type === "url"){
        if (len === 0) {return "Error: None"}
        if (len === 1) {return <a href={list[0].prefix + list[0].url} target="_blank">{list[0][label]}</a>}
        else {
            const fullList = list.slice()
            const lastItem = fullList.pop()
            const collection = fullList.map(item => (<span key={giveMeKey()}><a href={item.prefix + item.url} target="_blank" key={giveMeKey()}>{item[label]}</a><span>, </span></span>))
            collection.push(<a href={lastItem.prefix + lastItem.url} target="_blank" key={giveMeKey()}>{lastItem[label]}</a>)
            return collection
        }
    }
    else{
        if (len === 0) {return "Error: None"}
        if (len === 1) {
            return <span style={{cursor: "pointer", fontWeight: 800}} onClick={e => downloadFile(list[0].S3Key.split("gramercy/")[1], list[0].label)}>{list[0].label}</span>}
        else {
            const fullList = list.slice()
            const lastItem = fullList.pop()
            const collection = fullList.map(item => (<span key={giveMeKey()} style={{cursor: "pointer", fontWeight: 800}} onClick={e => downloadFile(item.S3Key.split("gramercy/")[1], item.label)}>{item.label}, </span>))
            collection.push(<span key={giveMeKey()} style={{cursor: "pointer", fontWeight: 800}} as="a" onClick={e => downloadFile(lastItem.S3Key.split("gramercy/")[1], lastItem.label)}>{lastItem.label}</span>)
            return collection
    
        }
    }
   
}