import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import TetherComponent from 'react-tether';
import { Field, getFormValues } from 'redux-form';
import { MultiSelection, Col, Select, TextField } from '@folio/stripes/components';
import css from './css/MultiForms.css';
import { Required } from '../Utils/Validate';

class UrlsMF extends Component {
  static propTypes = {
    dropdownCategories: PropTypes.arrayOf(PropTypes.string),
    dropdownLanguages: PropTypes.arrayOf(PropTypes.object),
    stripes: PropTypes.shape({
      store: PropTypes.object
    }),
    dispatch: PropTypes.func,
    change: PropTypes.func,
    name: PropTypes.string
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { stripes: { store } } = nextProps;
    const arrItems = [];
    const formValues = getFormValues('FormVendor')(store.getState());
    // Get Phone Number
    const getEmailNum = () => {
      const num = formValues.urls;
      if (!num) return false;
      return num.map((val) => arrItems.push(val));
    };
    getEmailNum();
    // Get Primary Phone Number
    const getPrimary = () => {
      const num = formValues.contacts;
      if (!num) return false;
      num.map((val) => {
        const item = ((val.contact_person || {}).primary_url || {});
        if (!_.isEmpty(item)) return false;
        return arrItems.push(item);
      });
      return false;
    };
    getPrimary();
    // Get Additional Phone Number
    const getAdditional = () => {
      const num = formValues.contacts;
      if (!num) return false;
      num.map((val) => {
        const contactPerson = val.contact_person;
        if (!contactPerson || contactPerson <= 0) return false;
        const urls = contactPerson.urls;
        if (!urls || urls <= 0) return false;
        contactPerson.urls.map((item) => arrItems.push(item));
        return false;
      });
      return false;
    };
    getAdditional();
    // Update state
    if (!_.isEqual(arrItems, prevState.itemCollection)) {
      return { itemCollection: arrItems };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      filteredCollection: []
    };
    // this.selectedValues = this.selectedValues.bind(this);
    this.onChangeSelect = this.onChangeSelect.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onInputClear = this.onInputClear.bind(this);
    this.onClickItem = this.onClickItem.bind(this);
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.renderItem = this.renderItem.bind(this);

    this.fieldRef = React.createRef();
    return false;
  }

  // Multi dropdown
  onChangeSelect = (e, elem, propertyName) => {
    const { dispatch, change } = this.props;
    return dispatch(change(`${elem}.${propertyName}`, e));
  }

  // selectedValues = (index, fields, propertyName) => {
  //   const { stripes: { store } } = this.props;
  //   const formValues = getFormValues('FormVendor')(store.getState());
  //   const currValues = formValues[fields.name][index][propertyName] || null;
  //   return currValues;
  // }

  toString = (option) => option;
  formatter = ({ option }) => <div>{option}</div>;
  filterItems = (filterText, list) => {
    const filterRegExp = new RegExp(`^${filterText}`, 'i');
    const renderedItems = filterText ? list.filter(item => item.search(filterRegExp) !== -1) : list;
    return { renderedItems };
  };
  // End Multi dropdown

  // Input Actions
  // variables and prop names needs to be change for other use
  onInputChange(obj, e) {
    const { isOpen, itemCollection } = this.state;
    if (!_.isEmpty(itemCollection) && (e.trim().length >= 1)) {
      const num = itemCollection;
      const objFiltered = _.filter(num, (o) => {
        const url = ((o.url || []).value || []);
        if (!_.includes(url, e)) return false;
        return o;
      });
      if (!_.isEmpty(objFiltered) && !isOpen) {
        return this.setState({ isOpen: true, filteredCollection: objFiltered });
      } else if (_.isEmpty(objFiltered) && isOpen) {
        return this.setState({ isOpen: false, filteredCollection: [] });
      }
      return false;
    }

    if (isOpen) this.setState({ isOpen: false, filteredCollection: [] });
    return false;
  }

  onInputClear() {
    const { isOpen } = this.state;
    if (isOpen) this.setState({ isOpen: false, filteredCollection: [] });
  }

  onClickItem(name, item) {
    const { isOpen } = this.state;
    const { dispatch, change } = this.props;
    dispatch(change(`${name}`, item));
    if (isOpen) this.setState({ isOpen: false, filteredCollection: [] });
    return false;
  }

  onKeyPressed = () => {
    return false;
  }

  renderItem = (name) => {
    const { filteredCollection } = this.state;
    const listItems = filteredCollection.map((item, i) => {
      return (
        <div key={i}>
          <div className={css.inlineButton} onClick={() => this.onClickItem(name, item)} onKeyPress={(e) => this.onKeyPressed(e)} role="presentation">
            {item.url.value}
          </div>
        </div>
      );
    });
    return (<div>{listItems}</div>);
  }
  // End Input Actions

  render() {
    const { isOpen } = this.state;
    const {
      name,
      dropdownCategories,
      dropdownLanguages
    } = this.props;
    const constraints = [{
      to: 'window',
      attachment: 'together',
    },
    {
      to: 'scrollParent',
      pin: false
    }];

    const defaultWidth = 100;
    const clientWidth = ((this.fieldRef || defaultWidth).current || defaultWidth).clientWidth || defaultWidth;

    return (
      <Fragment>
        <Col xs={12} md={3}>
          <TetherComponent
            attachment="top left"
            targetAttachment="bottom left"
            constraints={constraints}
          >
            <div ref={this.fieldRef} style={{ width:'100%' }}>
              <Field
                onChange={this.onInputChange}
                onClearField={this.onInputClear}
                label="URL*"
                name={`${name}.value`}
                id={`${name}.value`}
                component={TextField}
                validate={[Required]}
                fullWidth
              />
            </div>
            {
              isOpen && (
              <div className={css.dropdown} style={{ width:`${clientWidth}px` }}>
                <span className={css.dropDownItem}>
                  {this.renderItem(name)}
                </span>
              </div>
              )
            }
          </TetherComponent>
        </Col>
        <Col xs={12} md={3}>
          <Field label="Description" name={`${name}.description`} id={`${name}.description`} component={TextField} fullWidth />
        </Col>
        <Col xs={12} md={3}>
          <Field
            component={MultiSelection}
            label="Categories"
            name={`${name}.categories`}
            dataOptions={dropdownCategories}
            style={{ height: '80px' }}
            // value={this.selectedValues(index, fields, 'categories')}
            itemToString={this.toString}
            filter={this.filterItems}
            formatter={this.formatter}
            onChange={(e) => this.onChangeSelect(e, name, 'categories')}
            onBlur={(e) => { e.preventDefault(); }}
          />
        </Col>
        <Col xs={12} md={3}>
          <Field label="Default Language" name={`${name}.language`} id={`${name}.language`} component={Select} fullWidth dataOptions={dropdownLanguages} />
        </Col>
      </Fragment>
    );
  }
}


export default UrlsMF;
