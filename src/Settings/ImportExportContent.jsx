import React from "react";
import {Segment, Header, Button, Form, Radio, Icon, Divider, Dimmer, Loader} from "semantic-ui-react";
import {ChannelStore} from '../Stores/ChannelStore';
import { Collapse } from '@material-ui/core';
import { Row, Col} from 'reactstrap';

import { ContentPreview } from '../SharedUI/ContentPreview'
import { generateID } from "../SharedCalculations/GenerateID"
import { UserStore } from "../Stores/UserStore";
import { markdownToDraft } from 'markdown-draft-js'
import { convertFromRaw } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Dropzone from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'

export class ImportExportContent extends React.Component {
    constructor(props){
        super(props);
        this.state={viewSetting:"", uploadedFiles: [], checked: true, titles: [], secondTitles: [], currentIndex: 0, _contentPreview: false, selected: 0, contents: [], load: false};
        this.dropzoneRef = React.createRef();
    }
    
    reset(){
        this.setState({viewSetting: "", importTitle: "",  importType: "faqs", importChannel: "All", importStage: "draft", importFiles:[], titles: [], secondTitles: [], currentIndex: 0, checked: true, contents: [], load:false});
    }

    componentDidMount(){ this.reset()}

    updateState(val){
        this.setState(val);
    }


    handleChange = () => {
        this.setState({checked: !this.state.checked});
    }

    handelReDo = () => {
        this.setState({checked: true});
        this.state.currentIndex + 1 >= this.state.titles.length ? this.setState({ currentIndex: 0 }) : this.setState({ currentIndex: this.state.currentIndex + 1});
    }
    togglePreview = (bool) => {this.setState({_contentPreview: bool})};

    contentPreviewData = () => {
        const { selected } = this.state;
        const label = !this.state.checked ? this.state.titles[selected] : this.state.secondTitles[selected]
        const contentHTML = selected !== undefined && stateToHTML(convertFromRaw(this.state.contents[selected]))
        const contentRAW = selected !== undefined && this.state.contents[selected];

        const data = { 
            label: label,
            img: "",
            mode: this.state.importType === "faqs" ? "policy" : "announcement",
            variations: [{
                variationID: generateID(),
                userID: UserStore.user.userID,
                contentHTML,
                contentRAW,
                updated: Date.now()
            }]
        }
        return data;
    }

    importAll = async () => {
        this.setState({load: true})
        const titles = !this.state.checked ? this.state.titles : this.state.secondTitles;
        const importAll = new Array;
        for (let i = 0; i < titles.length; i ++) {
            let data = { 
                label: titles[i],
                contentHTML: stateToHTML(convertFromRaw(this.state.contents[i])),
                contentRAW: this.state.contents[i]
            }
            importAll.push(data);            
        }
        console.log("new array", importAll)
        await this.setState({load: false});
    }


    render(){
          // specify upload params and url for your files
        const getUploadParams = ({ meta }) => { 
            const url = 'https://httpbin.org/post'
            return { url, meta: { fileUrl: `${url}/${encodeURIComponent(meta.name)}` } }
        }
        

        const handleSubmit = async (files, allFiles) => {
            this.setState({uploadedFiles:[], titles: [], secondTitles: [], contents: []})
            for (const f of allFiles) {
                const {file, meta} = f;
                let reader = new FileReader();
                let self = this;
                reader.onload = await (function(theFile) {
                    return function(e) {
                        let rawObject = markdownToDraft(e.target.result);
                        let lines = e.target.result.split('\n');
                        let title = "";
                        for(let i = 0; i < lines.length; i++) {
                            if( lines[i].slice(0, 2) == "# ") {
                                title = lines[i].slice(2);
                                break;
                            }
                        }
                        self.setState({secondTitles: [...self.state.secondTitles, title]})
                        self.setState({contents: [...self.state.contents, rawObject]})
                    };
                })(file);

                // Read in the image file as a data URL.
                reader.readAsText(file);
                this.setState({uploadedFiles: [...this.state.uploadedFiles, file]})
                this.setState({titles: [...this.state.titles, meta.name.slice(0, -3)]})
            }

           
        }

        const {viewSetting, importChannel, importType, importFiles, importStage, _contentPreview} = this.state;

        const titles = !this.state.checked ? this.state.titles.map((title, index) => {
            return { text: title, value: index }
        }) : this.state.secondTitles.map((title, index) => {
            return { text: title, value: index }
        })

        let load = this.state.load;

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
                    
                    <div className={viewSetting==="import"? "YHShow":"YHHide"}>
                    <Row>
                        <Col>
                        <span style={{fontSize: "0.8em"}}>Import only accepts markdown (.md) files, contact us for other options</span>
                        <Dropzone
                            ref={this.dropzoneRef}
                            getUploadParams={getUploadParams}
                            // onChangeStatus={handleChangeStatus}
                            onSubmit={handleSubmit}
                            accept=".md"
                            styles={{ submitButtonContainer: {display: 'none'}, inputLabelWithFiles: {fontFamily: 'Rubik'} }}
                        />
                        <textarea className="form-control" rows="35" cols="120" id="ms_word_filtered_html" style={{ display: "none" }}></textarea>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form>
                                <Form.Dropdown selection label="Content type" value={importType} options={[{text: "FAQs", value:"faqs"},{text: "Announcements", value: "announcements"}]}
                                    onChange={(e, val) => {this.setState({importType: val.value})}}
                                />
                            </Form>
                        </Col>
                        <Col>
                            <Form>
                                <Form.Dropdown selection label="Assign channel" value={importChannel} options={ChannelStore._channelSelect}
                                    onChange={(e, val) => {this.setState({importChannel: val.value})}}
                                />
                            </Form>
                        </Col>
                        <Col>
                            <Form>
                                <Form.Dropdown selection label="Stage" value={importStage} options={[{text: "draft", value: "draft"},{text: "publish", value: "published"}]}
                                    onChange={(e, val) => {this.setState({importStage: val.value})}}
                                />
                            </Form>
                        </Col>
                    </Row>
                    </div>
                    {/* } */}

                    {viewSetting === 'importTitle' &&
                    <div>
                        <Row>
                            <Col>
                                <h5>Which title looks more correct? <Icon size="small" name="redo" onClick={() => this.handelReDo()}/> </h5>
                            </Col>
                        </Row>
                        <Row>
                        <Col>
                        <Form>
                                <Form.Field style={{margin: 0}}>
                                <Radio
                                    label={this.state.secondTitles[this.state.currentIndex]}
                                    name='radioGroup'
                                    value='this'
                                    checked={this.state.checked}
                                    onChange={this.handleChange}
                                />
                                </Form.Field>
                                <Form.Field>
                                <Radio
                                    label={this.state.titles[this.state.currentIndex]}
                                    name='radioGroup'
                                    value='that'
                                    checked={!this.state.checked}
                                    onChange={this.handleChange}
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
                                        <Form.Dropdown defaultValue={0} selection options={ titles } 
                                            onChange={(e, val) => {this.setState({selected: val.value})}}
                                        />
                                        <Form.Button primary onClick={() => this.setState({ _contentPreview: true })}>Load Preview</Form.Button>

                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>
                        {_contentPreview && <ContentPreview open={this.state._contentPreview} onClose={(e) => this.togglePreview()} data={this.contentPreviewData()} />}
                    </div>
                    }
                    <div style={{marginTop: 10}}>
                    {
                        viewSetting !== 'importConfirm'?  
                        <Button primary name={viewSetting === 'import'? 'importTitle' : 'importConfirm'} onClick={(e)=> {this.dropzoneRef.current.handleSubmit(); this.updateState({viewSetting: e.currentTarget.name})}}>Next...</Button> :
                        <Button primary name={viewSetting === 'import'? 'importTitle' : 'importConfirm'} onClick={(e)=> {this.updateState({viewSetting: e.currentTarget.name}); this.importAll()}}>Import All</Button>
                    }
                        <Button onClick={this.reset.bind(this)}>Cancel</Button>
                    </div>
                    { !load ? "" : <Loader active inline='centered' content='Loading' /> }
                </div>
            </Collapse>
          </Segment>
        )
    }
}