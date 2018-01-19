import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Field, FieldArray } from 'redux-form';
import uuid from 'uuid';

import Route from 'react-router-dom/Route';
import { withRouter } from 'react-router';
import queryString from 'query-string';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import Button from '@folio/stripes-components/lib/Button';

import LanguageList from "../Utils/Languages";
import { parseCategories } from "../Utils/Category";
import css from "./ContactPeopleView.css";

class ContactPeopleView extends React.Component {
  static propTypes = {
    initialValues: PropTypes.object,
    dropdown: PropTypes.object.isRequired,
    dropdown_currencies: PropTypes.array.isRequired,
    dropdown_categories: PropTypes.array.isRequired,
    dropdown_contact_categories: PropTypes.array.isRequired,
    onCloseDetails: PropTypes.func.isRequired,
    parentMutator: PropTypes.object.isRequired,
    ParentResources: PropTypes.shape({
      vendorGETID: PropTypes.object,
      vendorCategory: PropTypes.object,
      vendorContactCategory: PropTypes.object
    })
  }

  constructor(props) {
    super(props);
    this.getContacts = this.getContacts.bind(this);
  }

  render() {
    const { initialValues } = this.props;
    const dataVal = initialValues.contacts.length >= 1 ? initialValues.contacts : false;
    if (dataVal) {
      return (
        <div style={{ width: '100%' }} className={css.horizontalLine}>
          {dataVal.map(this.getContacts)}
        </div>
      );
    } else {
      return (
        <div>
          <p>-- No contact available --</p>
        </div>
      )      
    }
  }

  getContacts(val, key) {
    const rowCount = (this.props.initialValues.contacts.length - 1) !== key ? true : false;
    const categories = val.categories && this.props.dropdown_contact_categories ? parseCategories(val.categories, this.props.dropdown_contact_categories) : null;
    const full_name = `${_.get(val, 'contact_person.prefix', '')} ${_.get(val, 'contact_person.first_name', '')} ${_.get(val, 'contact_person.last_name', '')}`;
    const phone_number = `${_.get(val, 'contact_person.phone_number.country_code', '')} ${_.get(val, 'contact_person.phone_number.area_code', '')} ${_.get(val, 'contact_person.phone_number.phone_number', '')}`;
    const language = `${_.get(val, 'contact_person.language', '')}`;
    const address = `${_.get(val, 'contact_person.address.addressLine1', '')} ${_.get(val, 'contact_person.address.city', '')} ${_.get(val, 'contact_person.address.stateRegion', '')} ${_.get(val, 'contact_person.address.country', '')} ${ _.get(val, 'contact_person.address.zipCode', '')}`;
    const email = () => {
      var emailDescription = `${_.get(val, 'contact_person.email.description', '')}`;
      if (emailDescription.trim().length >= 1) {
        return `${_.get(val, 'contact_person.email.value', '')} - ${emailDescription}`;
      } else {
        return `${_.get(val, 'contact_person.email.value', '')}`;
      }
    }
    const url = () => {
      var urlDescription = `${_.get(val, 'contact_person.url.description', '')}`
      if (urlDescription.trim().length >= 1) {
        return `${_.get(val, 'contact_person.url.value', '')} - ${urlDescription}`;
      } else {
        return `${_.get(val, 'contact_person.url.value', '')}`;
      }
    }
  
    return (
      <Row key={key}>
        <Col xs={3}>
          <KeyValue label="Name" value={full_name} />
        </Col>
        <Col xs={3}>
          <KeyValue label="Phone Number" value={phone_number} />
        </Col>
        <Col xs={3}>
          <KeyValue label="Language" value={language} />
        </Col>
        <Col xs={3}>
          <KeyValue label="Categories" value={categories} />
        </Col>
        <Col xs={6}>
          <KeyValue label="Address" value={address} />
        </Col>
        <Col xs={6}>
          <KeyValue label="Address 2" value={_.get(val, 'contact_person.address.addressLine2', '')} />
        </Col>
        <Col xs={6}>
          <KeyValue label="Email" value={email()} />
        </Col>
        <Col xs={6}>
          <KeyValue label="Url" value={url()} />
        </Col>
        <Col xs={12}>
          <KeyValue label="Notes" value={_.get(val, 'contact_person.notes')} />
        </Col>
        {rowCount &&
          <div style={{ width: '100%' }}>
            <hr />
          </div>
        }
      </Row>
    )
  }
}

export default ContactPeopleView;