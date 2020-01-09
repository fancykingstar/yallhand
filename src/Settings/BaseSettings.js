/* eslint-disable import/named */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Segment, Form, Button, Message } from 'semantic-ui-react';
import _ from 'lodash';

import { periods } from '../TemplateData/periods';
import { FormCharMax } from '../SharedValidations/FormCharMax';
import { InfoPopUp } from '../SharedUI/InfoPopUp';
import { modifyAccount } from '../DataExchange/Up';
import { getStripeAcct, getStripePlan, getInvoicePreview } from '../DataExchange/ThirdParty';
import { baseSettingsEdit } from '../DataExchange/PayloadBuilder';
import { ConfirmDelete } from '../SharedUI/ConfirmDelete';
import { FeaturedAvatar } from '../SharedUI/ManageContent/FeaturedAvatar';
import ImportExportContent from './ImportExportContent';
import { Billing } from './Billing';
import { deleteUser } from '../DataExchange/Fetch';

import './style.css';

@inject(
  'AccountStore',
  'DataEntryStore',
  'UIStore',
  'UserStore'
)
@observer
class BaseSettings extends React.Component {
  async componentDidMount() {
    const { AccountStore, DataEntryStore } = this.props;

    DataEntryStore.set('baseSettings', 'label', AccountStore.account.label);
    DataEntryStore.set('baseSettings', 'img', AccountStore.account.img);
    DataEntryStore.set('baseSettings', 'userID', AccountStore.account.userID);
    DataEntryStore.set('baseSettings', 'timezone', AccountStore.account.timezone);
    DataEntryStore.set('baseSettings', 'reviewAlert', AccountStore.account.reviewAlert);
    DataEntryStore.set('baseSettings', 'generalEmail', AccountStore.account.generalEmail);

    if (AccountStore.account.data.stripe && _.isEmpty(AccountStore.stripe.data)) {
      await getStripeAcct(AccountStore.account.data.stripe);
    } if (_.isEmpty(AccountStore.stripe.plans)) {
      await getStripePlan();
    } if (_.isEmpty(AccountStore.stripe.invoice)) {
      await getInvoicePreview(AccountStore.account.data.stripe);
    }

    window.scrollTo(0, 0);
  }

  render() {
    const {
      AccountStore,
      DataEntryStore,
      UIStore,
      UserStore,
      history
    } = this.props;
    const newLabelStatus = FormCharMax(DataEntryStore.baseSettings.label, 24);
    const handleDelete = () => {
      modifyAccount({
        accountID: AccountStore.account.accountID,
        isActive: false,
        data: { delete: true },
      });
      deleteUser();
      if (UIStore.isScreenLoading) UIStore.toggleScreenLoading();
      UserStore.isAuthenticated = false;
      history.push('/login');
    };

    return (
      <div style={{ padding: 15, maxWidth: 900 }}>
        <Header
          as="h2"
          content="Account Settings"
          subheader="Settings for your Yallhands account"
        />
        <Segment>
          <div style={{ width: 400 }}>
            <Form>
              <Form.Input
                label="Company Name"
                value={DataEntryStore.baseSettings.label}
                onChange={(e, val) => DataEntryStore.set(
                  'baseSettings',
                  'label',
                  val.value
                )}
              >
                {' '}
                <input maxLength="24" />
                {' '}
              </Form.Input>

              <Form.Dropdown
                label={(
                  <span>
                    Master Account Admin
                    <InfoPopUp
                      content="Access to billing, master account deletion,
                        and default admin notices"
                    />
                  </span>
                )}
                placeholder="Select User"
                search
                selection
                value={DataEntryStore.baseSettings.userID}
                onChange={(e, { value }) => DataEntryStore.set(
                  'baseSettings',
                  'userID',
                  value
                )}
                options={AccountStore._getUsersSelectOptions()}
              />

              <Form.Select
                label="Default Review Alert For Aging Content"
                style={{ width: 150 }}
                options={periods}
                onChange={(e, { value }) => DataEntryStore.set(
                  'baseSettings',
                  'reviewAlert',
                  value
                )}
                value={DataEntryStore.baseSettings.reviewAlert}
              />
              <Form.Input
                label="General Query Email Address"
                value={DataEntryStore.baseSettings.generalEmail}
                onChange={(e, val) => DataEntryStore.set(
                  'baseSettings',
                  'generalEmail',
                  val.value
                )}
              >
                {' '}
                <input maxLength="24" />
                {' '}
              </Form.Input>

              <Button
                disabled={DataEntryStore.baseSettings.label === ''}
                primary
                type="submit"
                onClick={() => modifyAccount(baseSettingsEdit())}
              >
                Update
              </Button>
            </Form>
            <Message
              error
              attached
              hidden={newLabelStatus.messageHide}
            >
              {newLabelStatus.message}
            </Message>
          </div>
        </Segment>
        <FeaturedAvatar
          label="Company Logo"
          defaultImgUrl={DataEntryStore.baseSettings.img}
          uploaded={url => {
            DataEntryStore.set('baseSettings', 'img', url);
            modifyAccount(baseSettingsEdit());
          }}
        />
        <ImportExportContent />
        <Billing />

        <Segment>
          <div style={{ height: 50 }}>
            <Form>
              <Form.Field>
                <p>Delete Your Yallhands Account</p>
                <ConfirmDelete
                  size="mini"
                  label="your entire Yallhands account"
                  confirm={() => handleDelete()}
                />
              </Form.Field>
            </Form>
          </div>
        </Segment>
      </div>
    );
  }
}

export default BaseSettings;
