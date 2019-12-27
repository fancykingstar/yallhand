import React from "react";
import {Segment, Header, Button, Form, Radio, Icon, Divider} from "semantic-ui-react";
import { Collapse } from '@material-ui/core';
import { Row, Col} from 'reactstrap';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import {ChannelStore} from '../Stores/ChannelStore';

import Dropzone from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'

export class ImportExportContent extends React.Component {
    constructor(props){
        super(props);
        this.state={viewSetting:""};
    }
    reset(){
        this.setState({viewSetting: "", importTitle: "",  importType: "faqs", importChannel: "All", importStage: "draft", importFiles:[]});
    }

    updateState(val){
        this.setState(val);
    }

    componentDidMount(){ this.reset()}

    render(){
          // specify upload params and url for your files
        const getUploadParams = ({ meta }) => { return { url: 'https://httpbin.org/post' } }
        
        // called every time a file's `status` changes
        const handleChangeStatus = ({ meta, file }, status) => { console.log(status, meta, file) }
        
        // receives array of files that are done uploading when submit button is clicked
        const handleSubmit = (files, allFiles) => {
            console.log(files.map(f => f.meta))
            allFiles.forEach(f => f.remove())
        }
        const {viewSetting, importChannel, importType, importFiles, importStage} = this.state;
        return(
            <Segment className="ImportExportContent">
            <Header>Import/Export Content</Header>
            <Collapse in={!viewSetting}>
            <Button onClick={()=>this.updateState({viewSetting: "import"})}  >Import...</Button>
            <Button  >Export...</Button>
            </Collapse>
            <Collapse in={viewSetting.slice(0,6) === 'import'}>
                <div>
                <Stepper >
                <Step onClick={()=>this.updateState({viewSetting: "import"})} active={viewSetting === "import"}> <StepLabel>Configure files</StepLabel> </Step>
                <Step onClick={()=> {if(importFiles.length) this.updateState({viewSetting: "importType"})}} active={viewSetting === "importTitle"}> <StepLabel>Choose Title Format</StepLabel> </Step>
                <Step onClick={()=> {if(importFiles.length && importTitle) this.updateState({viewSetting: "importType"})}} active={viewSetting === "importConfirm"}> <StepLabel>Preview & Confirmation</StepLabel> </Step>
           
                 </Stepper>
                 <Divider style={{paddingBottom: 10}}/>
                    {viewSetting === 'import' &&
                    <div>
                    <Row>
                        <Col>
                        <span style={{fontSize: "0.8em"}}>Import only accepts markdown (.md) files, contact us for other options</span>
                        <Dropzone
                            getUploadParams={getUploadParams}
                            onChangeStatus={handleChangeStatus}
                            onSubmit={handleSubmit}
                            accept=".md"
                            styles={{ submitButtonContainer: {display: 'none'}, inputLabelWithFiles: {fontFamily: 'Rubik'} }}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form>
                                <Form.Dropdown selection label="Content type" value={importType} options={[{text: "FAQs", value:"faqs"},{text: "Announcements", value: "announcements"}]}/>
                            </Form>
                        </Col>
                        <Col>
                            <Form>
                                <Form.Dropdown selection label="Assign channel" value={importChannel} options={ChannelStore._channelSelect}/>
                            </Form>
                        </Col>
                        <Col>
                            <Form>
                                <Form.Dropdown selection label="Stage" value={importStage} options={[{text: "draft", value: "draft"},{text: "publish", value: "published"}]}/>
                            </Form>
                        </Col>
                    </Row>
                    </div>
                    }
                    {viewSetting === 'importTitle' &&
                    <div>
                        <Row>
                            <Col>
                                <h5>Which title looks more correct? <Icon size="small" name="redo"/> </h5>
                            </Col>
                        </Row>
                        <Row>
                        <Col>
                        <Form>
                                <Form.Field style={{margin: 0}}>
                                <Radio
                                    label='Title from first # tag inside the MD file'
                                    // name='radioGroup'
                                    value='this'
                                    // checked={this.state.value === 'this'}
                                    // onChange={this.handleChange}
                                />
                                </Form.Field>
                                <Form.Field>
                                <Radio
                                    label='Filename as the title'
                                    // name='radioGroup'
                                    value='that'
                                    // checked={this.state.value === 'that'}
                                    // onChange={this.handleChange}
                                />
                                </Form.Field>
                            </Form>
                        </Col>
                 
                        </Row>

                    </div>}
                    {viewSetting === "importConfirm" &&
                    <div>
                         <Row>
                            <Col>
                            <Form>
                            <Form.Group inline>
                                <Form.Dropdown defaultValue={0} selection options={[{text: "title 1", value: 0}, {text: "title 2"}]}/>
                                <Form.Button primary>Load Preview</Form.Button>

                            </Form.Group>
                        </Form>
                            </Col>
                        </Row>

                    </div>
                    }
                    <div style={{marginTop: 10}}>
                    {
                        viewSetting !== 'importConfirm'?  
                        <Button primary name={viewSetting === 'import'? 'importTitle' : 'importConfirm'} onClick={(e)=> this.updateState({viewSetting: e.currentTarget.name})}>Next...</Button> :
                        <Button primary name={viewSetting === 'import'? 'importTitle' : 'importConfirm'} onClick={(e)=> this.updateState({viewSetting: e.currentTarget.name})}>Import All</Button>
                    }
                    <Button onClick={this.reset.bind(this)}>Cancel</Button>
                    </div>
                
            
                </div>
            </Collapse>
          </Segment>
        )
    }
}