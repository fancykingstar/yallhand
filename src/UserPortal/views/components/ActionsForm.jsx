import React from 'react';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { Loader } from "semantic-ui-react";
import Star from '../../assets/images/star.svg';
import { Svg } from "../../helpers/Helpers";
import { Fab } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import BackupIcon from '@material-ui/icons/Backup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {validate} from "../../../SharedCalculations/ValidationTemplate";
import {giveMeKey} from "../../../SharedCalculations/GiveMeKey";

const initialState = {id: "",  files: []};

class ActionsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {id: "", files: []};
        this.resetState = initialState;
    }

    reset() {
        //ANTI PATTERN
        Object.keys(this.state).forEach(key => {
            if(key !== "id" && key !=="file") delete this.state[key]
        })
        this.setState({files: []})
      }

     handleSubmit = async (type) => {
        this.setState({loading: true});
   
        await S3Upload("authenticated-read", "gramercy", GenerateFileName(AccountStore.account, file.name), file, this.props.assoc? newFile(label, this.props.assoc): newFile(label))
        .then((r) => {
        this.props.close();
        console.log("fileattached to S3 as ", r)
        this.props.output(r);
        })
    
        this.setState({loading: false});
      };
  
    handleFileChange = async (e) => {
        e.preventDefault();
        let file = e.target.files[0];
        await this.setState({files: [...this.state.files, file]});
      };

   
    componentWillReceiveProps(props){
        if(
            // props.actionDetail.ticketItems && props.actionDetail.ticketItems[0].data.length && !Object.keys(state).length
            props.actionDetail.ticketItems && props.actionDetail.ticketID !== this.state.id
            ) {
         this.reset();
         let addThis = {id: props.actionDetail.ticketID}
         props.actionDetail.ticketItems[0].data.forEach(dataItem => {   
             addThis[dataItem.label] = ""
         });
      
         this.setState(addThis);
        }
      
     } 

    getFormItemField(formItem) {
        if(formItem.type === "text") return (
        <InputGroup>
            <Input placeholder="" type="text" name={formItem.label} id="description" onChange={this.handleInputChange.bind(this)} />
        </InputGroup> )

        else if(formItem.type === "select") return (
            <Input type="select" name={formItem.label} id="props_for" onChange={this.handleInputChange.bind(this)}>
                {formItem.options.map(opt => <option>{opt}</option>)}
            </Input>
        )

        else if (formItem.type === "file") return (
            <div>
            <input
            hidden
            onChange={this.handleFileChange.bind(this)}
            id="raised-button-file"
            multiple
            type="file"
          />
          <label htmlFor="raised-button-file">
          <Fab size="medium" color="primary" component="span" variant="extended">
                <BackupIcon style={{marginRight: 5}} />
                Add file
            </Fab>
          </label> 

          {
                             this.state.files.map(file => 
                             <div 
                             as="a"
                             key={"contentresourse" + giveMeKey()}
                            //  onClick={e => downloadFile(file.S3Key, file.label)}
                             ><AttachFileIcon/> {file.name}</div>)
                        }

            </div>
        
        )

        else if(formItem.type === "multiselect") return (
            <FormGroup>
            {formItem.options.map(opt =>  
            
            <FormControlLabel
                control={<Checkbox 
                id={formItem.label}
                name={opt}
                onChange={this.handleInputChange.bind(this)}
                />}
            label={opt}
            />

            )}
          </FormGroup>
        )
        
    }

    handleInputChange(evt) {
        let newValue = {}
        if (evt.target.type === "checkbox") {
            let currentValues = this.state[evt.target.id] || [] ;
            console.log("currentValues", currentValues)
            if(evt.target.checked) currentValues.push(evt.target.name)
            else currentValues = currentValues.filter(i => i!== evt.target.name) 
            newValue[evt.target.id] = currentValues;
        }
        else {
            const value = evt.target.value;
            newValue[evt.target.name] = value;
        } 
        this.setState(newValue);
    }
    async handleActionFormSubmit(e) {
        e.preventDefault();
        if(Object.keys(this.state).length > 1) {
        let conditions = {};
        await Object.keys(this.state).forEach(key => {if(key !== "id") conditions[key] = this.state[key].length > 0})
        const valid = await validate(conditions, true)
        if (valid.valid) this.props.onSubmit(this.state);
        }
        else this.props.onSubmit(this.state);

    }
    render() {
        return (
            <>
                <div className="section_title">
                    <h4>
                        <IconButton
                        color="inherit"
                        aria-label="back to actions"
                        edge="start"
                        onClick={this.props.onCancel.bind(this)}
                    ><KeyboardBackspaceIcon fontSize="inherit" /></IconButton>
                        {(this.props.actionDetail.label) ?
                            <Svg class="small-icon" src={this.props.actionDetail.img} default={Star} /> :
                            ('')}
                        {this.props.actionDetail.label}</h4>
                </div>
                <div className="page_content actions">
                    <div className="announce_component faq_announce slick-align-left">
                    <Form onSubmit={this.handleActionFormSubmit.bind(this)}>
                    <Container>
                        <Row>
                    {this.props.actionDetail.ticketItems && this.props.actionDetail.ticketItems[0].data.map(formItem => 
                        <Col md={6}>
                             <FormGroup>
                                        <Label for="description">{formItem.label}</Label>
                                        {this.getFormItemField(formItem)}
                                    </FormGroup>
                        </Col>

                    )
                    
                    }
                    {this.props.actionDetail.ticketItems && !this.props.actionDetail.ticketItems[0].data.length ? 
                    <Col>
                        <h4>Confirmation</h4>
                        <p>Are you sure you want to submit this request?</p>
                    </Col> :""}
                    
                    </Row>
                    </Container>
                
                            <Row className="text-right form-buttons">
                                <Col>
                                    <Button onClick={this.props.onCancel.bind(this)}>Cancel</Button>
                                    <Button disabled={this.state.loading} color="primary">Submit  {this.state.loading && <Loader style={{marginLeft: 5}} inverted size="small" active inline />} </Button>
                                </Col>
                            </Row>
                        </Form>  
                    </div>
                </div>
            </>
        );
    }
}

export default ActionsForm;
