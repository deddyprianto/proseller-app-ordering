import React from 'react';
import Svg, {Path} from 'react-native-svg';
import Theme from '../../theme/Theme';

const BgProfileSvg = props => {
  const {colors} = Theme();
  return (
    <Svg
      width="100%"
      height="118"
      viewBox="0 0 428 118"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M0 0H428V93.9526C428 93.9526 303.447 117.975 219.5 118C135.166 118.025 0 93.9526 0 93.9526V0Z"
        fill={colors.primary}
      />
    </Svg>
  );
};

export default BgProfileSvg;
