import React from "react";
import { Row, Col, Container, Table} from 'reactstrap';
import { Dropdown, Icon } from "semantic-ui-react";

import HeightRoundedIcon from '@material-ui/icons/HeightRounded';
import {SearchBox} from "../SharedUI/SearchBox";


export class YHTable extends React.Component {
    constructor(props){
        super(props);
    }

    // load(){
    //     this.setState({data: this.props.rows})
    // };
// componentDidMount(){
//     this.load();
// }

render(){

    const headers = this.props.headers.map(hd => <th>{addAction(hd)}</th> )
    const rows = this.props.rows.map(rw => <tr className="rowe"> {rw.map((x,i)=> <td className={i!==1 && "softFont"}>{x}{addFeature(i)}</td>)} </tr> )

return(
    <div className="yh-table">
        <Table>
          <thead>

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