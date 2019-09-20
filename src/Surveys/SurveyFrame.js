import React from "react";
import { Dropdown, Button, Icon } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import { SurveyBox } from "./SurveyBox"
import { SearchBox } from "../SharedUI/SearchBox"
import styled from 'styled-components';

@inject("UIStore")
@observer
export class SurveyFrame extends React.Component {
    constructor(props){
        super(props);
        this.state={UIFilter: "active"};
    }
    componentDidMount(){
        this.props.history.push('/panel/survey-detail')
    }
  render() {

const MenuContainer = styled.div`
display: flex;
flex-wrap: wrap;
paddingBottom: 30px;
@media (max-width: 580px) {
    justify-content: center;
    flex-direction: column;
}
`;
const MenuRight = styled.div`
display: flex;
flex-grow: 1;
justify-content: flex-end;
flex-wrap: wrap;
@media (max-width: 580px) {
    justify-content: center;
    text-align: center;
    flex-direction: column;
  }
`;
 const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  @media (max-width: 580px) {
    justify-content: center;

  }
`;
    return (
    <React.Fragment>
    <MenuContainer>
        <div style={{textAlign: "center"}}>
            <Button color="blue" > <Icon name="plus"  /> Create New... </Button>
        </div>
        <MenuRight>
            <div >
            view {" "}
                <Dropdown
                inline
                onChange={(e, val) => this.setState({UIFilter: val.value})}
                options={[{text: "active", value: "active"},{text: "completed", value: "completed"}]}
                value={this.state.UIFilter}
                />
            </div>
            <div ><SearchBox/></div>      
        </MenuRight>
        </MenuContainer>
         <Container style={{marginLeft: -20}}>   
                <SurveyBox/>
                <SurveyBox/>
                <SurveyBox/>
                <SurveyBox/>
                </Container>
    </React.Fragment>
    );
  }
}
