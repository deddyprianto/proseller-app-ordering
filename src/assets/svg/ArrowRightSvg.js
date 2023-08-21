import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const ArrowRight = props => (
  <Svg
    width={24}
    height={25}
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M9 18.5547L15 12.5547L9 6.55469"
      stroke="black"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default ArrowRight;
