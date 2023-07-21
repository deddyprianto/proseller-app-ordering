import * as React from 'react';
import Svg, {Circle} from 'react-native-svg';
const DotSvg = props => (
  <Svg
    width={6}
    height={7}
    viewBox="0 0 6 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Circle cx={3} cy={3.5} r={3} fill="#343A4A" />
  </Svg>
);
export default DotSvg;
