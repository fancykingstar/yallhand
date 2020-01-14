import React from 'react';
import { inject, observer } from 'mobx-react';
import { Dropdown, Form } from 'semantic-ui-react';
import { LabelGroup } from './LabelGroup';
import { TeamSelect } from './TeamSelect';
import { TagSelect } from './TagSelect';

@inject('DataEntryStore', 'AccountStore', 'TeamStore')
@observer
class ChooseTargeting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.props.input) this.setState(this.props.input);
    else this.reset();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.input && !props.noPass) return props.input;
    return null;
  }

  reset = () => {
    this.setState({
      sendToTeamID: '',
      sendToTagID: '',
      selectedUser: '',
      sendTargetType: 'all',
      sendToUsers: [],
    });
  }

  render() {
    const { AccountStore, TeamStore } = this.props;

    const echoState = async val => {
      if (val.sendTargetType === 'all') await this.reset();
      this.setState(val);
      this.props.output(
        val.sendTargetType === 'all'
          ? {
              sendToTeamID: '',
              sendToTagID: '',
              selectedUser: '',
              sendTargetType: 'all',
              sendToUsers: [],
            }
          : val,
      );
    };

    const options = (TeamStore.structure.length !== 1 || TeamStore.tags.length !== 0
      ? [
          { text: 'To Everyone', value: 'all' },
          { text: 'To Selected Teams/Tags', value: 'teams' },
          { text: 'To Select Users', value: 'users' },
        ]
      : [
          { text: 'To Everyone', value: 'all' },
          { text: 'To Select Users', value: 'users' },
        ]
    ).filter(opt => (this.props.NoSelectUsers ? opt.value !== 'users' : true));

    const targetOptions =
      this.state.sendTargetType === 'teams' ? (
        <Form style={{ paddingTop: 5 }}>
          <Form.Group>
            <TeamSelect
              label="Limit Access To Teams"
              placeholder="choose team..."
              defaultVal={this.state.sendToTeamID ? this.state.sendToTeamID : 'global'}
              outputVal={val => echoState({ sendToTeamID: val.value })}
            />
            <TagSelect
              label="Limit Access By Tag"
              placeholder="choose tag..."
              defaultVal={this.state.sendToTagID ? [this.state.sendToTagID] : []}
              outputVal={val => echoState({ sendToTagID: val })}
            />
          </Form.Group>
        </Form>
      ) : (
        <Form style={{ paddingTop: 5, minWidth: 400 }}>
          <Form.Group inline>
            <Form.Dropdown
              placeholder="Select User"
              search
              selection
              onChange={(e, val) => echoState({ selectedUser: val.value })}
              value={this.state.selectedUser}
              options={AccountStore._getUsersSelectOptions()}
            />
            <Form.Button
              onClick={() =>
                echoState({
                  sendToUsers: [...this.state.sendToUsers, ...[this.state.selectedUser]],
                })
              }
            >
              Add
            </Form.Button>
          </Form.Group>
          <div style={{ marginTop: 20, paddingBottom: 20 }}>
            <LabelGroup
              currentArray={this.state.sendToUsers}
              onRemove={val =>
                echoState({ sendToUsers: this.state.sendToUsers.filter(u => u !== val) })
              }
              labelprop="displayName_full"
              displayFilter={val => AccountStore._getUser(val)}
            />
          </div>
        </Form>
      );
    return (
      <div style={{ minWidth: 400 }}>
        <span style={{ fontSize: '.9em' }}>
          {this.props.label}{' '}
          <Dropdown
            inline
            onChange={(e, val) => echoState({ sendTargetType: val.value })}
            options={options}
            value={this.state.sendTargetType}
          />
        </span>

        {this.state.sendTargetType === 'all' ? <div /> : targetOptions}
      </div>
    );
  }
}

export default ChooseTargeting;
