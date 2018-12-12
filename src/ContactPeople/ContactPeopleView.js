import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Row, Col, KeyValue } from '@folio/stripes/components';
import css from './ContactPeopleView.css';

class ContactPeopleView extends React.Component {
  static propTypes = {
    initialValues: PropTypes.object,
    parentResources: PropTypes.shape({
      dropdown: PropTypes.object.isRequired,
      dropdownCategories: PropTypes.arrayOf(PropTypes.object)
    })
  }

  constructor(props) {
    super(props);
    this.getContacts = this.getContacts.bind(this);
    this.getAddPhoneNumbers = this.getAddPhoneNumbers.bind(this);
  }

  getAddPhoneNumbers(val, key) {
    const categories = val.categories.join(', ') || null;
    return (
      <Row key={key} className={css.rptBlocks}>
        <Col xs={3}>
          <KeyValue label="Phone Number" value={_.get(val, 'phone_number.phone_number', '')} />
        </Col>
        <Col xs={3}>
          <KeyValue label="type" value={_.get(val, 'phone_number.type', '')} />
        </Col>
        <Col xs={3}>
          <KeyValue label="Language" value={_.get(val, 'language', '')} />
        </Col>
        <Col xs={3}>
          <KeyValue label="categories" value={categories} />
        </Col>
      </Row>
    );
  }

  getContacts(val, key) {
    const rowCount = (this.props.initialValues.contacts.length - 1) !== key;
    const categories = val.categories.join(', ') || null;
    const fullName = `${_.get(val, 'contact_person.prefix', '')} ${_.get(val, 'contact_person.first_name', '')} ${_.get(val, 'contact_person.last_name', '')}`;
    const phoneNumber = `${_.get(val, 'contact_person.primary_phone_number.phone_number.phone_number', '')}`;
    const language = `${_.get(val, 'contact_person.language', '')}`;
    const address = `${_.get(val, 'contact_person.primary_address.address.addressLine1', '')} ${_.get(val, 'contact_person.primary_address.address.city', '')} ${_.get(val, 'contact_person.primary_address.address.stateRegion', '')} ${_.get(val, 'contact_person.primary_address.address.country', '')} ${_.get(val, 'contact_person.primary_address.address.zipCode', '')} ${_.get(', ' + val, 'contact_person.primary_address.address.zipCode', '')}`;
    const email = () => {
      const emailDescription = `${_.get(val, 'contact_person.primary_email.email.description', '')}`;
      if (emailDescription.trim().length >= 1) {
        return `${_.get(val, 'contact_person.primary_email.email.value', '')} - ${emailDescription}`;
      } else {
        return `${_.get(val, 'contact_person.primary_email.email.value', '')}`;
      }
    };
    const url = () => {
      const urlDescription = `${_.get(val, 'contact_person.primary_url.url.description', '')}`;
      if (urlDescription.trim().length >= 1) {
        return `${_.get(val, 'contact_person.primary_url.url.value', '')} - ${urlDescription}`;
      } else {
        return `${_.get(val, 'contact_person.primary_url.url.value', '')}`;
      }
    };
    const addPhoneNumbers = _.get(val, 'contact_person.phone_numbers', '');
    return (
      <Row key={key}>
        <Col xs={4}>
          <KeyValue label="Name" value={fullName} />
        </Col>
        <Col xs={4}>
          <KeyValue label="Language" value={language} />
        </Col>
        <Col xs={4}>
          <KeyValue label="Categories" value={categories} />
        </Col>
        <Col xs={4}>
          <KeyValue label="Address" value={address} />
        </Col>
        <Col xs={4}>
          <KeyValue label="Address 2" value={_.get(val, 'contact_person.primary_address.address.addressLine2', '')} />
        </Col>
        <Col xs={4}>
          <KeyValue label="Email" value={email()} />
        </Col>
        <Col xs={4}>
          <KeyValue label="URL" value={url()} />
        </Col>
        <Col xs={6}>
          <KeyValue label="Notes" value={_.get(val, 'contact_person.notes')} />
        </Col>
        <Col xs={12}>
          <hr />
          <div className={css.subHeadings}>Phone Numbers</div>
        </Col>
        <Col xs={4}>
          <KeyValue label="Phone Number" value={phoneNumber} />
        </Col>
        <Col xs={4}>
          <KeyValue label="Type" value={`${_.get(val, 'contact_person.primary_phone_number.phone_number.type', '')}`} />
        </Col>
        <Col xs={4}>
          <KeyValue label="Category" value={`${_.get(val, 'contact_person.primary_phone_number.categories', '')}`} />
        </Col>
        <Col xs={4}>
          <KeyValue label="Language" value={`${_.get(val, 'contact_person.primary_phone_number.Language', '')}`} />
        </Col>
        <Col xs={12}>
          <div className={css.sub2Headings}>Additional Phone Numbers</div>
        </Col>
        <Col xs={12}>
          { addPhoneNumbers.map(this.getAddPhoneNumbers) }
        </Col>
        {rowCount &&
          <div style={{ width: '100%' }}>
            <hr />
          </div>
        }
      </Row>
    );
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
      );
    }
  }
}

export default ContactPeopleView;
