import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FieldArray } from 'redux-form';

import {
  Col,
  Icon,
  Row,
} from '@folio/stripes/components';

import { mutatorGet } from '../common/utils';
import { DICT_CATEGORIES } from '../common/constants';
import ContactPeopleList from './ContactPeopleList';

class ContactPeopleForm extends Component {
  static propTypes = {
    parentMutator: PropTypes.object,
    parentResources: PropTypes.object,
    stripes: PropTypes.shape({
      store: PropTypes.object,
    }),
    orgId: PropTypes.string,
    storedContactIds: PropTypes.arrayOf(PropTypes.string),
  };

  componentDidMount() {
    const { storedContactIds } = this.props;

    this.fetchContacts(storedContactIds);
  }

  getContactsUrl = (contactId) => {
    const { orgId } = this.props;
    const ending = contactId ? `/contacts/${contactId}/view` : '/contacts/add-contact';
    const starting = orgId ? `/organizations/${orgId}` : '/organizations';

    return `${starting}${ending}`;
  }

  fetchContacts = (contactIds = []) => {
    const { parentMutator } = this.props;

    mutatorGet(parentMutator.contactsManualFetch, contactIds);
  }

  render() {
    const { orgId, parentResources, stripes } = this.props;
    const categoriesDict = get(parentResources, `${DICT_CATEGORIES}.records`, []);
    const contactsMap = get(parentResources, 'contactsManualFetch.records', []).reduce((acc, contact) => {
      acc[contact.id] = contact;

      return acc;
    }, {});
    const isLoading = !(
      get(parentResources, `${DICT_CATEGORIES}.hasLoaded`) &&
      get(parentResources, 'contactsManualFetch.hasLoaded')
    );

    if (isLoading) {
      return (
        <div>
          <Icon
            icon="spinner-ellipsis"
            width="100px"
          />
        </div>
      );
    }

    return (
      <Row>
        <Col xs={12}>
          <FieldArray
            name="contacts"
            component={ContactPeopleList}
            props={{
              fetchContacts: this.fetchContacts,
              categoriesDict,
              contactsMap,
              orgId,
              stripes,
            }}
          />
        </Col>
      </Row>
    );
  }
}

export default ContactPeopleForm;
