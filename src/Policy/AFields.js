import React from "react";
import {inject, observer} from "mobx-react"
import "./style.css";


import { AMenu } from "./AMenu";
import { DraftFormField } from "../SharedUI/DraftFormField";

@inject("PoliciesStore")
@observer
export class AFields extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {PoliciesStore} = this.props
    const currentPolicy = PoliciesStore.allPolicies.filter(policy => policy.policyID === PoliciesStore.toggledPolicy)
    const currentVariation = currentPolicy[0].variations.filter(vari => vari.variationID === PoliciesStore.toggledVariation)
    const initContent = currentVariation[0].content    
    const displayContent = (val) => {console.log(val)}
    return (
   
        <div>
          <DraftFormField updateContent={displayContent} loadContent={ initContent !== '' ? initContent : ''}/>
          <AMenu/>
        
        </div>

    );
  }
}
