import React from 'react';
import Theme from '../../theme/Theme';
import useCalculation from '../../hooks/calculation/useCalculation';

const withHooksComponent = Component => props => {
  const theme = Theme();
  const {removePointAmount} = useCalculation();
  return (
    <Component removePointAmount={removePointAmount} {...theme} {...props} />
  );
};

export default withHooksComponent;
