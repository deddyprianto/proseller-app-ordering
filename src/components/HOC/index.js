import React from 'react';
import Theme from '../../theme/Theme';

const withHooksComponent = Component => props => {
  const theme = Theme();
  return <Component {...theme} {...props} />;
};

export default withHooksComponent;
