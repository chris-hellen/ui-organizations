import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';

import {
  LoadingPane,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  useAcqMethods,
  useOrganization,
  useIntegrationConfigMutation,
  useIntegrationConfigs,
} from '../../common/hooks';

import {
  EDI_CODE_TYPES,
  FTP_TYPES,
  TRANSMISSION_MODES,
  CONNECTION_MODES,
} from '../constants';
import { buildAvailableAccounts, findDefaultIntegration } from '../utils';
import { OrganizationIntegrationForm } from '../OrganizationIntegrationForm';

export const OrganizationIntegrationCreate = ({ orgId }) => {
  const location = useLocation();
  const history = useHistory();
  const sendCallout = useShowCallout();

  const initialValues = {
    schedulePeriod: 'NONE',
    type: 'EDIFACT_ORDERS_EXPORT',
    exportTypeSpecificParameters: {
      vendorEdiOrdersExportConfig: {
        vendorId: orgId,
        ediConfig: {
          vendorEdiType: EDI_CODE_TYPES[0].value,
          libEdiType: EDI_CODE_TYPES[0].value,
        },
        ediFtp: {
          ftpFormat: FTP_TYPES[0].value,
          ftpMode: TRANSMISSION_MODES[0].value,
          ftpConnMode: CONNECTION_MODES[0].value,
        },
      },
    },
  };

  const { organization, isLoading } = useOrganization(orgId);
  const { acqMethods, isLoading: isAcqMethodsLoading } = useAcqMethods();
  const { integrationConfigs, isLoading: isIntegrationsLoading } = useIntegrationConfigs({ organizationId: orgId });

  const closeForm = () => {
    history.push({
      pathname: `/organizations/view/${organization.id}`,
      search: location.search,
    });
  };

  const { mutateIntegrationConfig } = useIntegrationConfigMutation({
    onSuccess: () => {
      sendCallout({
        message: <FormattedMessage id="ui-organizations.integration.message.save.success" />,
      });
      closeForm();
    },
    onError: () => {
      sendCallout({
        message: <FormattedMessage id="ui-organizations.integration.message.save.error" />,
        type: 'error',
      });
    },
  });

  if (isLoading || isIntegrationsLoading || isAcqMethodsLoading) {
    return (
      <LoadingPane
        id="integration-create"
        onClose={closeForm}
      />
    );
  }

  return (
    <OrganizationIntegrationForm
      acqMethods={acqMethods}
      accounts={buildAvailableAccounts(organization, integrationConfigs)}
      defaultIntegration={findDefaultIntegration(integrationConfigs)}
      initialValues={initialValues}
      onSubmit={mutateIntegrationConfig}
      onClose={closeForm}
      paneTitle={<FormattedMessage id="ui-organizations.integration.create.paneTitle" />}
    />
  );
};

OrganizationIntegrationCreate.propTypes = {
  orgId: PropTypes.string,
};