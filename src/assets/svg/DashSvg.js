import * as React from 'react';
import Svg, {Line} from 'react-native-svg';
import Theme from '../../theme/Theme';
const DashSvg = props => {
  const {colors} = Theme();
  return (
    <Svg
      width={371}
      height={2}
      viewBox="0 0 371 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Line
        opacity={0.5}
        y1={1.05469}
        x2={371}
        y2={1.05469}
        stroke={colors.primary}
        strokeDasharray="4 4"
      />
    </Svg>
  );
};
export default DashSvg;
