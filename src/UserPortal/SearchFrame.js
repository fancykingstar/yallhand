import React from "react";
import "./style.css";
import { Form, Icon} from "semantic-ui-react";
import { inject, observer} from "mobx-react"
import {withRouter} from "react-router-dom"
@inject("DataEntryStore", "PoliciesStore", "AnnoucementsStore", "ResourcesStore", "UserStore")
@observer
class SearchFrame extends React.Component {
  render() {
    const {DataEntryStore} = this.props
    const {PoliciesStore} = this.props
    const {AnnoucementsStore} = this.props
    const {ResourcesStore} = this.props
    const {UserStore} = this.props

    const searchPolicies = (term) => {
      let results = []
      PoliciesStore.userAvailablePolicies.forEach(policy => {
        if(policy.label.toLowerCase().includes(term.toLowerCase()) ){results.push({"type": "policy", "title": policy.label, "url":"portal/learn-detail/" + policy.policyID, "img": policy.img})}
      })
      return results
      }
    
    const searchAnnoucements = (term) => {
        let results = []
        AnnoucementsStore.allAnnoucements.forEach(policy => {
          if(policy.label.toLowerCase().includes(term.toLowerCase()) ){results.push({"type": "annoucement", "title": policy.label, "url":"portal/learn-detail/" + policy.policyID, "img": policy.img})}
        })
        return results
        }
    const searchFile = (term) => {
          let results = []
          ResourcesStore.fileResources.forEach(policy => {
            if(policy.label.toLowerCase().includes(term.toLowerCase()) ){results.push({"type": "file", "title": policy.label, "url": policy.url , "img": null})}
          })
          return results
          }
    const searchUrl = (term) => {
            let results = []
            ResourcesStore.urlResources.forEach(policy => {
              if(policy.label.toLowerCase().includes(term.toLowerCase()) && UserStore.previewTeamPath[1] === policy.teamID){results.push({"type": "link", "title": policy.label,  "url": policy.url, "img": null})}
            })
            return results
            }
      
    

    const handleSubmit = (e) => {
      e.preventDefault();
      this.props.history.push('/portal/search')
      const searchTerm = this.input.value
      const results = [...searchPolicies(searchTerm), ...searchAnnoucements(searchTerm), ...searchFile(searchTerm), ...searchUrl(searchTerm)]
      console.log(results)
      DataEntryStore.updateSearchResults(results)
      

    }
  return (
    <div className="SearchFrame">
      <div className="SearchControls">
      <Form onSubmit={e => handleSubmit(e)} autocomplete="off">
        <Form.Input fluid icon placeholder="Search..." >
        <input  type="text" name="username" ref={ref => this.input = ref}/>
          <Icon name="search" /> 
        </Form.Input>
      </Form>
      </div>
    </div>
  );}
};
export default withRouter(SearchFrame)
