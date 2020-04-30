import React from 'react';
import { FormattedMessage } from 'react-intl';

const isURLValid = (value) => {
  const REGEXP_URL = new RegExp('^$|([Hh][Tt][Tt][Pp]|[Ff][Tt][Pp])([Ss])?://.+$');
  const isTrue = REGEXP_URL.test(value);

  if (value === undefined || isTrue) return undefined;

  return <FormattedMessage id="ui-organizations.valid.isURLValid" />;
};

export { isURLValid };
