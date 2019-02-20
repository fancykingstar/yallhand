import React from "react";
import { Icon } from "semantic-ui-react";
import {withRouter} from 'react-router-dom';

  const BackButton = ({ history }) => 
  <div style={{marginTop: 5, marginBottom: 10}}>
      <Icon
        name="arrow circle left"
        color="blue"
        size="large"
        onClick={() => history.goBack()} alt="Go back"
      /></div>;


export default withRouter(BackButton)