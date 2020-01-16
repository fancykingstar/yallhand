/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Container, Col, Row, Form, FormGroup, Label, Input, InputGroup } from 'reactstrap';
import Button from '@material-ui/core/Button';
import { Loader } from 'semantic-ui-react';
import { Fab } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import BackupIcon from '@material-ui/icons/Backup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { isBoolean } from 'lodash';
import { inject, observer } from 'mobx-react';

import { S3Upload } from '../../../DataExchange/S3Upload';
import { newFile } from '../../../DataExchange/PayloadBuilder';
import { validate } from '../../../SharedCalculations/ValidationTemplate';
import { giveMeKey } from '../../../SharedCalculations/GiveMeKey';
import { GenerateFileName } from "../../../SharedCalculations/GenerateFileName";
import CircleIcons from './CircleIcons';

const initialState = { id: '', files: [] };

@inject('AccountStore')
@observer
class ActionsForm extends React.Component {
  smallIconStyle = { display: 'flex', alignItems: 'center' };

  h4Style = { display: 'flex', alignItems: 'center' };

  constructor(props) {
    super(props);
    this.state = {
      id: '',
      files: [],
    };
    this.resetState = initialState;
  }

  UNSAFE_componentWillReceiveProps(props) {
    const { id } = this.state;
    if (props.actionDetail.ticketItems && props.actionDetail.ticketID !== id) {
      this.reset();
      const addThis = { id: props.actionDetail.ticketID };
      props.actionDetail.ticketItems[0].data.forEach(dataItem => {
        addThis[dataItem.label] = dataItem.type.toLowerCase().includes('select')
          ? dataItem.options[0]
          : '';
      });

      this.setState(addThis);
    }
  }

  reset = () => {
    // ANTI PATTERN
    Object.keys(this.state).forEach(key => {
      if (key !== 'id' && key !== 'file') delete this.state[key];
    });
    this.setState({ files: [] });
  };

  uploadFiles = async () => {
    const { assoc, close, output, AccountStore } = this.props;

    this.setState({ loading: true });
    await S3Upload(
      'authenticated-read',
      'gramercy',
      GenerateFileName(AccountStore.account, file.name),
      file,
      assoc ? newFile(label, assoc) : newFile(label),
    ).then(r => {
      close();
      output(r);
    });

    this.setState({ loading: false });
  };

  handleFileChange = async e => {
    const { files } = this.state;
    e.preventDefault();
    const file = e.target.files[0];
    const newValue = {};
    // File upload labels are uniquely boolean && true,
    // value is replaced later with array of resourceID upon submission
    newValue[e.target.name] = true;
    await this.setState(newValue);
    await this.setState({
      files: files
        ? [
          ...files,
          file
        ] : [
          file
        ]
    });
  };

  getFormItemField = formItem => {
    const { files } = this.state;
    if (formItem.type !== 'file' && this.state[formItem.label] === undefined) {
      const setInput = {};
      setInput[formItem.label] = formItem.type !== 'multiselect' ? '' : [];
      this.setState(setInput);
    }
    if (formItem.type === 'text') {
      return (
        <InputGroup>
          <Input
            placeholder=""
            type="text"
            name={formItem.label}
            id="description"
            onChange={this.handleInputChange}
          />
        </InputGroup>
      );
    }
    if (formItem.type === 'select') {
      return (
        <Input type="select" name={formItem.label} id="props_for" onChange={this.handleInputChange}>
          {formItem.options.map((opt, i) => (
            <option key={i}>{opt}</option>
          ))}
        </Input>
      );
    }
    if (formItem.type === 'file') {
      return (
        <div>
          <input
            name={formItem.label}
            hidden
            onChange={this.handleFileChange.bind(this)}
            id="raised-button-file"
            multiple
            type="file"
          />
          <label htmlFor="raised-button-file">
            <Fab size="medium" color="primary" component="span" variant="extended">
              <BackupIcon style={{ marginRight: 5 }} />
              Add file
            </Fab>
          </label>

          {files.map(file => (
            <div
              as="a"
              key={`contentresourse${giveMeKey()}`}
              // onClick={e => downloadFile(file.S3Key, file.label)}
            >
              <AttachFileIcon />
              {file.name}
            </div>
          ))}
        </div>
      );
    }
    if (formItem.type === 'multiselect') {
      return (
        <FormGroup>
          {formItem.options.map((opt, i) => (
            <FormControlLabel
              key={i}
              control={
                <Checkbox id={formItem.label} name={opt} onChange={this.handleInputChange} />
              }
              label={opt}
            />
          ))}
        </FormGroup>
      );
    }
  };

  handleInputChange = evt => {
    const newValue = {};

    if (evt.target.type === 'checkbox') {
      let currentValues = this.state[evt.target.id] || [];
      if (evt.target.checked) currentValues.push(evt.target.name);
      else currentValues = currentValues.filter(i => i !== evt.target.name);
      newValue[evt.target.id] = currentValues;
    } else {
      const { value } = evt.target;
      newValue[evt.target.name] = value;
    }

    this.setState(newValue);
  };

  handleActionFormSubmit = async e => {
    const { onSubmit } = this.props;
    e.preventDefault();

    if (Object.keys(this.state).length > 1) {
      const conditions = {};

      await Object.keys(this.state).forEach(key => {
        if (key !== 'id' && key !== 'files') {
          conditions[key] = isBoolean(this.state[key])
            ? this.state[key]
            : this.state[key].length > 0;
        }
      });

      const valid = await validate(conditions, true);
      if (valid.valid) {
        onSubmit(this.state);
      }
    } else {
      onSubmit(this.state);
    }
  };

  render() {
    const { onCancel, actionDetail, loading, disabled } = this.props;
    return (
      <div className="actions-container">
        <div className="section_title">
          <h4 style={this.h4Style}>
            <IconButton
              color="inherit"
              aria-label="back to actions"
              edge="start"
              onClick={onCancel}
            >
              <KeyboardBackspaceIcon fontSize="inherit" />
            </IconButton>
            {actionDetail.label ? (
              <div className="small-icon" style={this.smallIconStyle}>
                {' '}
                <CircleIcons
                  noLabel
                  name={actionDetail.icon}
                  color="#1249bd"
                  bgColor="#e7eefc"
                  size="30"
                />
              </div>
            ) : (
              ''
            )}
            {actionDetail.label}
          </h4>
        </div>
        <div className="page_content actions shadow">
          <div className="announce_component faq_announce slick-align-left">
            <Form onSubmit={this.handleActionFormSubmit}>
              <Container>
                <Row>
                  {actionDetail.ticketItems &&
                    actionDetail.ticketItems[0].data.map((formItem, i) => (
                      <Col md={6} key={i}>
                        <FormGroup>
                          <Label for="description">{formItem.label}</Label>
                          {this.getFormItemField(formItem)}
                        </FormGroup>
                      </Col>
                    ))}
                  {actionDetail.ticketItems && !actionDetail.ticketItems[0].data.length ? (
                    <Col>
                      <h4>Confirmation</h4>
                      <p>Are you sure you want to submit this request?</p>
                    </Col>
                  ) : (
                    ''
                  )}
                </Row>
              </Container>

              <Row className="text-right form-buttons">
                <Col>
                  <Button
                    variant="contained"
                    style={{ marginRight: 16 }}
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={loading || disabled}
                  >
                    Submit
                    {' '}
                    {loading && (
                      <Loader style={{ marginLeft: 5 }} inverted size="small" active inline />
                    )}
                    {' '}
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default ActionsForm;
