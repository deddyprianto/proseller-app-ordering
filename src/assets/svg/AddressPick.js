import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import Theme from '../../theme/Theme';
const AddressPick = props => {
  const {colors} = Theme();
  return (
    <Svg
      width={4}
      height={24}
      viewBox="0 0 4 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M0 0C2.20914 0 4 1.79086 4 4V20C4 22.2091 2.20914 24 0 24V0Z"
        fill={colors.primary}
      />
    </Svg>
  );
};
export default AddressPick;
