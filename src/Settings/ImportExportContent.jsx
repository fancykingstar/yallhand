import React from 'react';
import { Segment, Header, Button, Form, Radio, Icon, Divider, Loader } from 'semantic-ui-react';
import { Collapse } from '@material-ui/core';
import { Row, Col } from 'reactstrap';

import { markdownToDraft } from 'markdown-draft-js';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Dropzone from 'react-dropzone-uploader';
import { UserStore } from '../Stores/UserStore';
import { generateID } from '../SharedCalculations/GenerateID';
import { ContentPreview } from '../SharedUI/ContentPreview';
import { ChannelStore } from '../Stores/ChannelStore';
import { apiCall } from '../DataExchange/Fetch';
import { allContent } from '../DataExchange/Down';
import toast from '../YallToast';

import 'react-dropzone-uploader/dist/styles.css';

export default class ImportExportContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewSetting: '',
      uploadedFiles: [],
      checked: true,
      titles: [],
      secondTitles: [],
      currentIndex: 0,
      _contentPreview: false,
      selected: 0,
      contents: [],
      load: false,
      uploadedFileCount: 0,
    };
    this.dropzoneRef = React.createRef();
  }

  componentDidMount() {
    this.reset();
  }

  importAll = async () => {
    const {
      checked,
      titles,
      secondTitles,
      contents,
      importChannel,
      importStage,
      importType,
    } = this.state;
    const checkedTitles = !checked ? titles : secondTitles;
    const importAll = [];

    this.setState({ load: true });
    for (let i = 0; i < checkedTitles.length; i += 1) {
      const data = {
        label: checkedTitles[i],
        contentHTML: stateToHTML(convertFromRaw(contents[i])),
        contentRAW: contents[i],
      };
      importAll.push(data);
    }
    const payload = {
      format: 'md',
      userID: UserStore.user.userID,
      accountID: UserStore.user.accountID,
      chanID: importChannel,
      stage: importStage,
      type: importType,
      data: importAll,
    };
    await apiCall('content/import', 'POST', payload)
      .then(r => r.json())
      .then(r => {
        if (r.success) {
          toast.success(`${importAll.length.toString()} items successful imported`, {
            hideProgressBar: true,
            closeOnClick: false,
          });
          allContent(UserStore.user.accountID);
        } else
          toast.error('Import was not successful, please check your files for proper formatting', {
            hideProgressBar: true,
          });
      });
    await this.reset();
  };

  contentPreviewData = () => {
    const { selected, checked, titles, secondTitles, contents, importType } = this.state;
    const label = !checked ? titles[selected] : secondTitles[selected];
    const contentHTML = selected !== undefined && stateToHTML(convertFromRaw(contents[selected]));
    const contentRAW = selected !== undefined && contents[selected];

    const data = {
      label,
      img: '',
      mode: importType === 'faqs' ? 'policy' : 'announcement',
      variations: [
        {
          variationID: generateID(),
          userID: UserStore.user.userID,
          contentHTML,
          contentRAW,
          updated: Date.now(),
        },
      ],
    };
    return data;
  };

  handleChange = () => {
    const { checked } = this.state;
    this.setState({ checked: !checked });
  };

  handleReDo = () => {
    const { currentIndex, titles } = this.state;
    this.setState({ checked: true });
    if (currentIndex + 1 >= titles.length) {
      this.setState({ currentIndex: 0 });
    } else {
      this.setState({ currentIndex: currentIndex + 1 });
    }
  };

  togglePreview = bool => {
    this.setState({ _contentPreview: bool });
  };

  handleSubmit = (files, allFiles) => {
    this.setState({
      uploadedFiles: [],
      titles: [],
      secondTitles: [],
      contents: []
    });
    const { uploadedFiles, titles } = this.state;

    allFiles.forEach(f => {
      const { file, meta } = f;
      const reader = new FileReader();
      const self = this;
      reader.onload = (() => {
        return (e) => {
          const rawObject = markdownToDraft(e.target.result);
          const lines = e.target.result.split('\n');
          let title = '';
          for (let i = 0; i < lines.length; i += 1) {
            if (lines[i].slice(0, 2) === '# ') {
              title = lines[i].slice(2);
              break;
            }
          }
          self.setState({
            secondTitles: [
              ...self.state.secondTitles,
              title
            ],
            contents: [
              ...self.state.contents,
              rawObject
            ]
          });
        };
      })(file);

      // Read in the image file as a data URL.
      reader.readAsText(file);
      this.setState({
        uploadedFiles: [
          ...uploadedFiles,
          file
        ],
        titles: [
          ...titles,
          meta.name.slice(0, -3)
        ]
      });
    });
  };

  handleChangeStatus = ({ meta }, status) => {
    const { uploadedFileCount } = this.state;
    if (status === 'done') {
      this.setState({
        uploadedFileCount: uploadedFileCount + 1,
      });
    } else if (status === 'removed') {
      this.setState({
        uploadedFileCount: uploadedFileCount - 1,
      });
    }
  };

  reset = () => {
    this.setState({
      viewSetting: '',
      importTitle: '',
      importType: 'faqs',
      importChannel: 'All',
      importStage: 'draft',
      importFiles: [],
      titles: [],
      secondTitles: [],
      currentIndex: 0,
      checked: true,
      contents: [],
      load: false,
    });
  };

  updateState = val => {
    this.setState(val);
  };

  render() {
    // specify upload params and url for your files
    const getUploadParams = ({ meta }) => {
      const url = 'https://httpbin.org/post';
      return { url, meta: { fileUrl: `${url}/${encodeURIComponent(meta.name)}` } };
    };

    const {
      viewSetting,
      importChannel,
      importType,
      importTitle,
      importFiles,
      importStage,
      _contentPreview,
      checked,
      titles,
      secondTitles,
      currentIndex,
      uploadedFileCount,
    } = this.state;

    const checkedTitles = !checked
      ? titles.map((title, index) => {
          return { text: title, value: index };
        })
      : secondTitles.map((title, index) => {
          return { text: title, value: index };
        });

    const { load } = this.state;

    return (
      <Segment className="ImportExportContent">
        <Header>Import/Export Content</Header>
        <Collapse in={!viewSetting}>
          <Button onClick={() => this.updateState({ viewSetting: 'import' })}>
            Import...
          </Button>
        </Collapse>
        <Collapse in={viewSetting.slice(0, 6) === 'import'}>
          <div>
            <Stepper>
              <Step
                onClick={() => this.updateState({ viewSetting: 'import' })}
                active={viewSetting === 'import'}
              >
                {' '}
                <StepLabel>Configure files</StepLabel>
                {' '}
              </Step>
              <Step
                onClick={() => {
                  if (importFiles.length) this.updateState({ viewSetting: 'importType' });
                }}
                active={viewSetting === 'importTitle'}
              >
                {' '}
                <StepLabel>Choose Title Format</StepLabel>
                {' '}
              </Step>
              <Step
                onClick={() => {
                  if (importFiles.length && importTitle)
                    this.updateState({ viewSetting: 'importType' });
                }}
                active={viewSetting === 'importConfirm'}
              >
                {' '}
                <StepLabel>Preview & Confirmation</StepLabel>
                {' '}
              </Step>
            </Stepper>
            <Divider style={{ paddingBottom: 10 }} />

            <div className={viewSetting === 'import' ? 'YHShow' : 'YHHide'}>
              <Row>
                <Col>
                  <span style={{ fontSize: '0.8em' }}>
                    Import only accepts markdown (.md) files, contact us for other options
                  </span>
                  <Dropzone
                    ref={this.dropzoneRef}
                    getUploadParams={getUploadParams}
                    onChangeStatus={this.handleChangeStatus}
                    // onDrop={acceptedFiles => console.log('accepted files: ', acceptedFiles)}
                    onSubmit={this.handleSubmit}
                    accept=".md"
                    styles={{
                      submitButtonContainer: { display: 'none' },
                      inputLabelWithFiles: { fontFamily: 'Rubik' },
                    }}
                  />
                  <textarea
                    className="form-control"
                    rows="35"
                    cols="120"
                    id="ms_word_filtered_html"
                    style={{ display: 'none' }}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form>
                    <Form.Dropdown
                      selection
                      label="Content type"
                      value={importType}
                      options={[
                        { text: 'FAQs', value: 'faqs' },
                        { text: 'Announcements', value: 'announcements' },
                      ]}
                      onChange={(e, val) => {
                        this.setState({ importType: val.value });
                      }}
                    />
                  </Form>
                </Col>
                <Col>
                  <Form>
                    <Form.Dropdown
                      selection
                      label="Assign channel"
                      value={importChannel}
                      options={ChannelStore._channelSelect}
                      onChange={(e, val) => {
                        this.setState({ importChannel: val.value });
                      }}
                    />
                  </Form>
                </Col>
                <Col>
                  <Form>
                    <Form.Dropdown
                      selection
                      label="Stage"
                      value={importStage}
                      options={[
                        { text: 'draft', value: 'draft' },
                        { text: 'publish', value: 'published' },
                      ]}
                      onChange={(e, val) => {
                        this.setState({ importStage: val.value });
                      }}
                    />
                  </Form>
                </Col>
              </Row>
            </div>

            {viewSetting === 'importTitle' && (
              <div>
                <Row>
                  <Col>
                    <h5>
                      Which title looks more correct?
                      {' '}
                      <Icon size="small" name="redo" onClick={this.handleReDo} />
                      {' '}
                    </h5>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form>
                      <Form.Field style={{ margin: 0 }}>
                        <Radio
                          label={secondTitles[currentIndex]}
                          name="radioGroup"
                          value="this"
                          checked={checked}
                          onChange={this.handleChange}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label={titles[currentIndex]}
                          name="radioGroup"
                          value="that"
                          checked={!checked}
                          onChange={this.handleChange}
                        />
                      </Form.Field>
                    </Form>
                  </Col>
                </Row>
              </div>
            )}
            {viewSetting === 'importConfirm' && (
              <div>
                <Row>
                  <Col>
                    <Form>
                      <Form.Group inline>
                        <Form.Dropdown
                          defaultValue={0}
                          selection
                          options={checkedTitles}
                          onChange={(e, val) => {
                            this.setState({ selected: val.value });
                          }}
                        />
                        <Form.Button
                          primary
                          onClick={() => this.setState({ _contentPreview: true })}
                        >
                          Load Preview
                        </Form.Button>
                      </Form.Group>
                    </Form>
                  </Col>
                </Row>
                {_contentPreview && (
                  <ContentPreview
                    open={_contentPreview}
                    onClose={this.togglePreview}
                    data={this.contentPreviewData()}
                  />
                )}
              </div>
            )}
            <div style={{ marginTop: 10 }}>
              {viewSetting !== 'importConfirm' ? (
                <Button
                  primary
                  name={viewSetting === 'import' ? 'importTitle' : 'importConfirm'}
                  disabled={!uploadedFileCount}
                  onClick={e => {
                    this.dropzoneRef.current.handleSubmit();
                    this.updateState({ viewSetting: e.currentTarget.name });
                  }}
                >
                  Next...
                </Button>
              ) : (
                <Button
                  primary
                  name={viewSetting === 'import' ? 'importTitle' : 'importConfirm'}
                  onClick={e => {
                    this.updateState({ viewSetting: e.currentTarget.name });
                    this.importAll();
                  }}
                >
                  Import All
                </Button>
              )}
              <Button onClick={this.reset}>
                Cancel
              </Button>
            </div>
            {!load ? '' : <Loader active inline="centered" content="Loading" />}
          </div>
        </Collapse>
      </Segment>
    );
  }
}
