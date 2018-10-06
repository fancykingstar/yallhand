import React from 'react'

export const JoinLinksCommas = (len, list, label, url) => {
    if (len === 0) {return "Error: None"}
    if (len === 1) {return <a href={list[0][url]} target="_blank">{list[0][label]}</a>}
    else {
        const fullList = list
        const lastItem = fullList.pop()
        const collection = fullList.map(item => (<span key={`span-${item[label]}`}><a href={item[url]} target="_blank" key={`link-${item[label]}`}>{item[label]}</a><span>, </span></span>))
        collection.push(<a href={lastItem[url]} target="_blank" key={`link-${lastItem[label]}`}>{lastItem[label]}</a>)
        return collection

    }
}