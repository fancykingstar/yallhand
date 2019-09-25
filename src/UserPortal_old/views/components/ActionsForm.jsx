import React from 'react';

import IconButton from '@material-ui/core/IconButton';

import { Col, Row, Button, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon } from 'reactstrap';

import MoodIcon from '@material-ui/icons/Mood';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

import { Svg } from "../../helpers/Helpers";
import Star from '../../assets/images/star.svg';


class ActionsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            colleague: 'Dylan Spencer',
            props_for: 'Teamwork',
            description: '',
            no_feed: false
        }
    }

    handleInputChange(evt) {
        const value =
            evt.target.type === "checkbox" ? evt.target.checked : evt.target.value;
        this.setState({
            [evt.target.name]: value
        });

    }
    handleActionFormSubmit(e) {
        e.preventDefault();
        console.log('colleague', this.state.colleague);
        console.log('props_for', this.state.props_for);
        console.log('description', this.state.description);
        console.log('no_feed', this.state.no_feed);
    }
    render() {
        const { selectedActionData } = this.props;

        return (

            <React.Fragment>
                <div className="section_title shadow">
                    {console.log(selectedActionData)}
                    <h4><IconButton
                        color="inherit"
                        aria-label="back to actions"
                        edge="start"
                        onClick={this.props.hideActionForm.bind(this)}
                    >
                        <KeyboardBackspaceIcon fontSize="inherit" />
                    </IconButton><Svg class="small-icon" src={selectedActionData.img} default={Star} /> {selectedActionData.label}</h4>
                </div>
                <div className="page_content actions shadow">
                    <div className="announce_component faq_announce slick-align-left">
                        <Form onSubmit={this.handleActionFormSubmit.bind(this)}>
                            <Row form>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="colleague">Select Colleague</Label>
                                        <Input type="select" name="colleague" id="colleague" onChange={this.handleInputChange.bind(this)}>
                                            <option>Dylan Spencer</option>
                                            <option>Dylan Spencer2</option>
                                            <option>Dylan Spencer3</option>
                                            <option>Dylan Spencer4</option>
                                            <option>Dylan Spencer5</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="props_for">Give props for</Label>
                                        <Input type="select" name="props_for" id="props_for" onChange={this.handleInputChange.bind(this)}>
                                            <option>Teamwork</option>
                                            <option>Teamwork2</option>
                                            <option>Teamwork3</option>
                                            <option>Teamwork4</option>
                                            <option>Teamwork5</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="description">Describe (optional)</Label>
                                        <InputGroup>
                                            <Input placeholder="Enter your message here…" type="text" name="description" id="description" onChange={this.handleInputChange.bind(this)} />
                                            <InputGroupAddon addonType="append">
                                                <MoodIcon className="right-icon" />
                                            </InputGroupAddon>
                                        </InputGroup>

                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup check className="pretty-checkbox">
                                        <Input type="checkbox" name="no_feed" id="no_feed" onChange={this.handleInputChange.bind(this)} />
                                        <div className="state"><Label for="no_feed" check>Private (don’t add to feed)</Label></div>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row className="text-right form-buttons">
                                <Col>
                                    <Button onClick={this.props.hideActionForm.bind(this)}>Cancel</Button>
                                    <Button color="primary">Submit</Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
                </React.Fragment>

        );
    }
}

export default ActionsForm;
