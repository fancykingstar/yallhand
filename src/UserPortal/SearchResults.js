import React from "react"
import { Form, Icon, Header, Item} from "semantic-ui-react";
import { inject, observer} from "mobx-react"

@inject("DataEntryStore")
@observer
export class SearchResults extends React.Component {
    render() {
        const {DataEntryStore} = this.props
        const manageImage = (result) => {
            if( result.type !== 'file' || result.type !== 'link'){
            return ( <Item.Image size="small" src={result.img} />)
        }}
        const results = DataEntryStore.searchResults.map(result =>
            <Item>
             {manageImage(result)}
            <Item.Content>
            <Item.Header>{result.title}</Item.Header>
            <Item.Meta><a href={result.url} target="_blank">{result.type}</a></Item.Meta>
            </Item.Content>
            </Item>
            )
        return(
            <div style={{maxWidth: 800, marginLeft: 15, marginTop: 20}}>
            <Header>Search Results</Header>
            <Item.Group>
              {results}
           </Item.Group>
           </div>
        )
    }
}