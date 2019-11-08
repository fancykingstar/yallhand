import React from 'react';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import Star from '../../assets/images/star.svg';
import { Svg } from "../../helpers/Helpers";
import IconButton from '@material-ui/core/IconButton';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

class ActionsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                colleague: 'One employee',
                props_for: '',
                description: '',
                no_feed: false
            }
        }
    }

    getFormItemField(formItem) {
        if(formItem.type === "text") return (
        <InputGroup>
            <Input placeholder="" type="text" name="description" id="description" onChange={this.handleInputChange.bind(this)} />
        </InputGroup> )

        else if(formItem.type === "select") return (
            <Input type="select" name="props_for" id="props_for" onChange={this.handleInputChange.bind(this)}>
                {formItem.options.map(opt =>    <option>{opt}</option>)}
            </Input>
        )

        else if(formItem.type === "multi") return (
            <FormGroup>
            {formItem.options.map(opt =>  
            
            <FormControlLabel
            control={<Checkbox 
                // checked={gilad} 
                // onChange={handleChange('gilad')} 
                // value="gilad" 
                />}
            label={opt}
            />

            )}
          </FormGroup>
        )
        
    }

    handleInputChange(evt) {
        const value =
            evt.target.type === "checkbox" ? evt.target.checked : evt.target.value;

        this.setState({
            formData: {
                ...this.state.formData,
                [evt.target.name]: value
            }
        });
    }
    handleActionFormSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this.state.formData);
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
                    </Row>
                    </Container>
                   
{/*                     
                            <Row form>
                            
                                <Col>
                                    <FormGroup>
                                        <Label for="description">Describe the issue</Label>
                                        <InputGroup>
                                            <Input placeholder="" type="text" name="description" id="description" onChange={this.handleInputChange.bind(this)} />
                                            <InputGroupAddon addonType="append">
                                                <QuestionIcon className="right-icon" />
                                            </InputGroupAddon> 
                                        </InputGroup>

                                    </FormGroup>
                                </Col>
                            </Row>  */}
                            <Row className="text-right form-buttons">
                                <Col>
                                    <Button onClick={this.props.onCancel.bind(this)}>Cancel</Button>
                                    <Button color="primary">Submit</Button>
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
