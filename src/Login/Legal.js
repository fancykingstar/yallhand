import React from 'react'
import {Modal} from "semantic-ui-react"

export class Legal extends React.Component {
constructor(props){
    super(props);
    this.state={open: false, mode: ""}
    this.toggle = (mode) => this.setState({mode, open: !this.state.open})
}
render(){
    return(

<React.Fragment>
    <Modal open={this.state.open} closeIcon onClose={()=>this.toggle(this.state.mode)}>
    
    <h1 style={{paddingLeft: 5}}>{this.state.mode==="tos"? "Terms of Service":"Privacy Policy"}</h1>
    <div style={{height: '70vh'}}>
    <iframe 
        frameborder="0"
        title={this.state.mode==="tos"? "Terms of Service":"Privacy Policy"}
        width="100%"
        height="100%"
        src={this.state.mode === 'tos'? "https://yallhandsgeneral.s3.amazonaws.com/tos.html" : "https://yallhandsgeneral.s3.amazonaws.com/privacy-policy.html"}>
    </iframe>
    </div>
    </Modal>
<div className="LoginLegal"> Proceeding indicates your agreement to our <span style={{color: '#ff1d8e'}} onClick={e=>this.toggle("tos")}>Terms</span> and <span style={{color: '#ff1d8e'}} onClick={e=>this.toggle("privacy")}>Privacy</span> policies</div>
</React.Fragment>
    )}
}