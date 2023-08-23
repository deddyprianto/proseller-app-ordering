import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const CloseSvg = props => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.3756 12.5L2 20.8756L3.6244 22.5L12 14.1244L20.3756 22.5L22 20.8756L13.6244 12.5L22 4.1244L20.3756 2.5L12 10.8756L3.6244 2.5L2 4.1244L10.3756 12.5Z"
      fill="black"
    />
  </Svg>
);
export default CloseSvg;
