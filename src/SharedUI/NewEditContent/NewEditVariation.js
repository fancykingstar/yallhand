import React from "react";
import { inject, observer } from "mobx-react";

import VariationContent from "./VariationContent";

import toast from "../../YallToast";
import isEmpty from 'lodash.isempty';

@inject("DataEntryStore", "UserStore", "PoliciesStore", "AnnouncementsStore", "UIStore", "ResourcesStore")
@observer
class NewEditVariation extends React.Component {
  constructor(props){
    super(props)
    const {match} = this.props;
    this.state = {
      loaded: false,
      mode: match.path.includes("announcements")? "announcement":"policy",
      contentID: match.params.contentID !== "content"? match.params.contentID:"", 
      variID: match.params.variID !== "new"? match.params.variID:"",
      isDupe: match.params.variID && match.params.options === "d",
      content: {}
    }
  }

  async loadContent() {
    const {mode, variID, contentID, isDupe} = this.state;
    if(!variID) {
      this.setState({loaded:true, isNewContent: true, isNewVari: true});
      return
    }
    const { UIStore, PoliciesStore, AnnouncementsStore, DataEntryStore } = this.props;
    const isLoaded = mode === "announcement"? AnnouncementsStore._searchVariation(variID): PoliciesStore._searchVariation(variID);
    await this.setState({content: isLoaded, loaded:true, isNewContent: Boolean(!contentID), isNewVari: Boolean(!variID)});
    if((variID && isEmpty(isLoaded)) || (!isDupe && this.props.match.params.options ) ) this.props.history.push(`/panel/${mode === "announcement"? "announcements":"faqs"}`);
  }
  componentDidMount() {
    this.loadContent();
  };

  render() {
    const {loaded} = this.state;
    console.log("new edit state", this.state)
    return (
      <div>

          {loaded &&
             <>
             <VariationContent data={this.state}/>
             </>
          }
      </div>
    );
  }
}

export default NewEditVariation;