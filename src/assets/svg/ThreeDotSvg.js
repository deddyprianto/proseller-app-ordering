import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import Theme from '../../theme/Theme';
const ThreeDot = props => {
  const {colors} = Theme();
  return (
    <Svg
      width={50}
      height={37}
      viewBox="0 0 50 37"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.5 18.5C23.5 17.6716 24.1716 17 25 17C25.8284 17 26.5 17.6716 26.5 18.5C26.5 19.3284 25.8284 20 25 20C24.1716 20 23.5 19.3284 23.5 18.5Z"
        fill={colors.primary}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28.75 18.5C28.75 17.6716 29.4216 17 30.25 17C31.0784 17 31.75 17.6716 31.75 18.5C31.75 19.3284 31.0784 20 30.25 20C29.4216 20 28.75 19.3284 28.75 18.5Z"
        fill={colors.primary}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.25 18.5C18.25 17.6716 18.9216 17 19.75 17C20.5784 17 21.25 17.6716 21.25 18.5C21.25 19.3284 20.5784 20 19.75 20C18.9216 20 18.25 19.3284 18.25 18.5Z"
        fill={colors.primary}
      />
    </Svg>
  );
};
export default ThreeDot;
