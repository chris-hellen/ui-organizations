import React from 'react';
import PropTypes from 'prop-types';
import { get, map } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Button,
  Icon,
  MultiColumnList,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

import { transformCategoryIdsToLables } from '../common/utils/category';

const columnWidths = {
  'categories': '35%',
  'emails': '35%',
  'name': '25%',
  'unassign': '5%',
};

const columnMapping = {
  categories: <FormattedMessage id="ui-organizations.contactPeople.categories" />,
  emails: <FormattedMessage id="ui-organizations.contactPeople.emails" />,
  name: <FormattedMessage id="ui-organizations.contactPeople.name" />,
  unassign: null,
};

const visibleColumns = ['name', 'categories', 'emails', 'unassign'];

const getContactsUrl = (orgId, contactId) => {
  const ending = contactId ? `/contacts/${contactId}/view` : '/contacts/add-contact';
  const starting = orgId ? `/organizations/${orgId}` : '/organizations';

  return `${starting}${ending}`;
};

const AddContactButton = ({ fields, stripes }) => {
  const addContacts = contacts => {
    fields.push(...contacts.map(contact => contact.id));
  };

  return (
    <Pluggable
      aria-haspopup="true"
      type="find-contact"
      dataKey="contact"
      searchLabel={<FormattedMessage id="ui-organizations.contactPeople.addContact" />}
      searchButtonStyle="default"
      disableRecordCreation
      stripes={stripes}
      addContacts={addContacts}
    >
      <span data-test-add-contact>
        <FormattedMessage id="ui-organizations.contactPeople.noFindContactPlugin" />
      </span>
    </Pluggable>
  );
};

AddContactButton.propTypes = {
  fields: PropTypes.object,
  stripes: PropTypes.object,
};

const ContactPeopleList = ({ fields, contactsMap, orgId, categoriesDict, stripes }) => {
  const contentData = fields.getAll().map((contactId, _index) => ({
    ...get(contactsMap, contactId, {}),
    _index,
  }));

  const anchoredRowFormatter = (row) => (
    <div role="listitem" key={`row-${row.rowIndex}`}>
      <Link
        to={getContactsUrl(orgId, row.rowData.id)}
        className={row.rowClass}
        {...row.rowProps}
      >
        {row.cells}
      </Link>
    </div>
  );

  const resultsFormatter = {
    categories: ({ categories = [] }) => transformCategoryIdsToLables(categoriesDict, categories),
    emails: ({ emails }) => map(emails, 'value').join(', '),
    name: contact => `${contact.firstName} ${contact.lastName}`,
    unassign: (contact) => (
      <Button
        align="end"
        buttonStyle="fieldControl"
        data-test-unassign-contact
        type="button"
        onClick={(e) => {
          e.preventDefault();
          fields.remove(contact._index);
        }}
      >
        <Icon icon="times-circle" />
      </Button>
    ),
  };

  return (
    <React.Fragment>
      <MultiColumnList
        id="contact-list"
        columnMapping={columnMapping}
        columnWidths={columnWidths}
        contentData={contentData}
        formatter={resultsFormatter}
        rowFormatter={anchoredRowFormatter}
        visibleColumns={visibleColumns}
      />
      <br />
      <AddContactButton
        fields={fields}
        stripes={stripes}
      />
    </React.Fragment>
  );
};

ContactPeopleList.propTypes = {
  fields: PropTypes.object,
  orgId: PropTypes.string,
  categoriesDict: PropTypes.arrayOf(PropTypes.object),
  contactsMap: PropTypes.object,
  stripes: PropTypes.object,
};

export default ContactPeopleList;