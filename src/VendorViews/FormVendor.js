import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Fields, getFormValues } from 'redux-form';
import { IfPermission, Button, Row, Col, AccordionSet, Accordion, ExpandAllButton, Icon } from '@folio/stripes/components';
// Local Components
import { SummaryForm } from '../Summary';
import { ContactInformationForm } from '../ContactInformation';
import { ContactPeopleForm } from '../ContactPeople';
import { AgreementsForm } from '../Agreements';
import { VendorInformationForm } from '../VendorInformation';
import { EdiInformationForm } from '../EdiInformation';
import { InterfaceForm } from '../Interface';
import { AccountsForm } from '../Accounts';
import HandleErrors from '../Utils/HandleErrors';
import css from './css/FormVendor.css';

class FormVendor extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    deleteLedger: PropTypes.func,
    parentMutator: PropTypes.object.isRequired,
    parentResources: PropTypes.object.isRequired,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { stripes: { store } } = nextProps;
    const formValues = getFormValues('FormVendor')(store.getState());
    // Get Phone Number
    const getPhoneNum = () => {
      const num = formValues.phone_numbers;
      if (!num) return {};
      const data = num.map((val) => val);
      return data;
    };
    // Get Primary Phone Number
    const getPrimary = () => {
      const num = formValues.contacts;
      if (!num) return {};
      const data = num.map((val) => {
        const contactPerson = val.contact_person;
        if (!contactPerson || contactPerson <= 0) return {};
        const primaryPhoneNumber = contactPerson.primary_phone_number || {};
        return primaryPhoneNumber;
      });
      return data;
    };
    // Get Additional Phone Number
    const getAdditional = () => {
      const num = formValues.contacts;
      if (!num) return {};
      const data = num.map((val) => {
        const contactPerson = val.contact_person;
        if (!contactPerson || contactPerson <= 0) return {};
        const phoneNums = contactPerson.phone_numbers;
        if (!phoneNums || phoneNums <= 0) return {};
        const phoneNumbers = contactPerson.phone_numbers.map((item) => item);
        return phoneNumbers;
      });
      return data;
    };
    // Gather all phone numbers
    const phoneCollection = _.assign(getPhoneNum(), getPrimary(), ...getAdditional());
    // Update state
    if (!_.isEqual(phoneCollection, prevState.phoneCollection)) {
      return { phoneCollection };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      sections: {
        summarySection: false,
        contactInformationSection: true,
        contactPeopleSection: true,
        agreementsSection: false,
        vendorInformationSection: false,
        EDIInformationSection: false,
        interfaceSection: false,
        accountsSection: false,
      },
      sectionErrors: {
        summaryErr: false,
        contactInfoErr: false,
        contactPeopleErr: false,
        agreementsErr: false,
        accountsErr: false,
      },
      phoneCollection: []
    };
    this.deleteVendor = this.deleteVendor.bind(this);
    this.onToggleSection = this.onToggleSection.bind(this);
    this.handleExpandAll = this.handleExpandAll.bind(this);
    this.updateSectionErrors = this.updateSectionErrors.bind(this);
  }

  updateSectionErrors(obj) {
    this.setState({ sectionErrors: obj });
  }

  onToggleSection({ id }) {
    this.setState((curState) => {
      const newState = _.cloneDeep(curState);
      newState.sections[id] = !curState.sections[id];
      return newState;
    });
  }

  handleExpandAll(obj) {
    this.setState((curState) => {
      const newState = _.cloneDeep(curState);
      newState.sections = obj;
      return newState;
    });
  }

  deleteVendor(ID) {
    const { parentMutator } = this.props;
    parentMutator.records.DELETE({ id: ID }).then(() => {
      parentMutator.query.update({
        _path: '/vendors',
        layer: null
      });
    });
  }

  render() {
    const { initialValues } = this.props;
    const { sectionErrors, phoneCollection } = this.state;
    const showDeleteButton = initialValues.id || false;

    // Errors
    const arrSections = ['name', 'code', 'vendor_status', 'addresses', 'phone_numbers', 'email', 'urls', 'contacts', 'agreements', 'accounts'];
    const message = (
      <em className={css.requiredIcon} style={{ color: 'red', display: 'flex', alignItems: 'center' }}>
        <Icon icon="validation-error" size="medium" />
        Required fields!
      </em>
    );
    const summaryErr = sectionErrors.summaryErr ? message : null;
    const contactInfoErr = sectionErrors.contactInfoErr ? message : null;
    const contactPeopleErr = sectionErrors.contactPeopleErr ? message : null;
    const agreementsErr = sectionErrors.agreementsErr ? message : null;
    const accountsErr = sectionErrors.accountsErr ? message : null;


    return (
      <div id="form-add-new-vendor">
        <Row center="xs" style={{ textAlign: 'left' }}>
          <Col xs={12} md={8}>
            <Fields names={arrSections} component={HandleErrors} data={sectionErrors} updateSectionErrors={this.updateSectionErrors} />
          </Col>
          <Col xs={12} md={8}>
            <Row end="xs"><Col xs><ExpandAllButton accordionStatus={this.state.sections} onToggle={this.handleExpandAll} /></Col></Row>
          </Col>
          <Col xs={12} md={8}>
            <AccordionSet accordionStatus={this.state.sections} onToggle={this.onToggleSection}>
              <Accordion label="Summary" id="summarySection" displayWhenClosed={summaryErr} displayWhenOpen={summaryErr}>
                <SummaryForm {...this.props} />
              </Accordion>
              <Accordion label="Contact Information" id="contactInformationSection" displayWhenClosed={contactInfoErr} displayWhenOpen={contactInfoErr}>
                <ContactInformationForm phoneCollection={phoneCollection} {...this.props} />
              </Accordion>
              <Accordion label="Contact People" id="contactPeopleSection" displayWhenClosed={contactPeopleErr} displayWhenOpen={contactPeopleErr}>
                <ContactPeopleForm phoneCollection={phoneCollection} {...this.props} />
              </Accordion>
              <Accordion label="Agreements" id="agreementsSection" displayWhenClosed={agreementsErr} displayWhenOpen={agreementsErr}>
                <AgreementsForm {...this.props} />
              </Accordion>
              <Accordion label="Vendor Information" id="vendorInformationSection">
                <VendorInformationForm {...this.props} />
              </Accordion>
              <Accordion label="EDI Information" id="EDIInformationSection">
                <EdiInformationForm {...this.props} />
              </Accordion>
              <Accordion label="Interface" id="interfaceSection">
                <InterfaceForm {...this.props} />
              </Accordion>
              <Accordion label="Accounts" id="accountsSection" displayWhenClosed={accountsErr} displayWhenOpen={accountsErr}>
                <AccountsForm {...this.props} />
              </Accordion>
            </AccordionSet>
            <IfPermission perm="vendor.item.delete">
              <Row end="xs">
                <Col xs={12}>
                  {
                    showDeleteButton &&
                    <Button type="button" buttonStyle="danger" onClick={() => { this.deleteVendor(this.props.initialValues.id); }}>
                      Delete - &nbsp;
                      <strong><i>{this.props.initialValues.name}</i></strong>
                    </Button>
                  }
                </Col>
              </Row>
            </IfPermission>
          </Col>
        </Row>
      </div>

    );
  }
}
export default FormVendor;
