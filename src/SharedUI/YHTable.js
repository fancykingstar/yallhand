import React from "react";
import { Row, Col, Container, Table} from 'reactstrap';
import { Dropdown, Icon } from "semantic-ui-react";

import HeightRoundedIcon from '@material-ui/icons/HeightRounded';
import {SearchBox} from "../SharedUI/SearchBox";


export class YHTable extends React.Component {
    constructor(props){
        super(props);
        this.state={data: [], action: "", filters: ["Channel"], sorts: ["Title"]};
    }

    load(){
        this.setState({data: this.props.rows})
    };
componentDidMount(){
    this.load();
}

render(){
    const {filters, sorts} = this.state;

    const addAction = (headerVal) => {
       if(!filters.length && !sorts.length) return headerVal
       else if(filters.includes(headerVal)) return <span>{headerVal}F</span>
       else if(sorts.includes(headerVal)) return <div className="yh-table-action-wrapper">{headerVal}<div className="yh-table-action"><HeightRoundedIcon fontSize="small"/></div></div>
       else return headerVal
        // const actionItems = {filters: ["Channel", "State"], sorts: ["Title", {text:"Last Updated", key: "updated"}]};
       

    } 

    
    const addFeature = (i) => {if(i===1) return <><br/><Icon aria-label="Featured" name="star"/></>}

    const headers = this.props.headers.map(hd => <th>{addAction(hd)}</th> )
    const rows = this.state.data.map(rw => <tr className="rowe"> {rw.map((x,i)=> <td className={i!==1 && "softFont"}>{x}{addFeature(i)}</td>)} </tr> )

    // const filters = 
    

    // <div className="yhtable-filters">
    // <Dropdown placeholder='Skills'  multiple selection options={[{text:"himom", value: 1}]} />{" "}
    // <Dropdown placeholder='Skills'  multiple selection options={[{text:"himom", value: 2}]} />
    // </div>


    // const tableActions = () => {
    //     if(action==="search") return <SearchBox/>
    //     else if (action==="filter") return filters
    // }



return(
    <div className="yh-table">
        <Table>
          <thead>
          <tr className="tableactions"><td align="center" colspan={headers.length}>
          {/* {tableActions()}  */}
          <div style={{float: "right"}}> 
          <SearchBox/>
          {/* <SearchRoundedIcon onClick={()=>this.setState({action:"search"})} /> <FilterListRoundedIcon onClick={()=>this.setState({action:"filter"})}/> */}
           </div></td></tr>
       <tr className="header align-top">
         {headers}
       </tr>

       </thead>
       <tbody>
        {rows}
          </tbody>
          </Table>
       </div>
)}};