import React from 'react';
import Theme from '../../theme/Theme';
import useBackHandler from '../../hooks/backHandler/useBackHandler';

const withHooksComponent = Component => props => {
  const theme = Theme();
  useBackHandler();
  return <Component {...theme} {...props} />;
};

export default withHooksComponent;
