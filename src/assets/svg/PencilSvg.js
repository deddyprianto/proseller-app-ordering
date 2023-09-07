import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import Theme from '../../theme/Theme';
const PencilSvg = props => {
  const {colors} = Theme();
  return (
    <Svg
      width={22}
      height={22}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M15.583 2.75158C15.8238 2.51082 16.1096 2.31984 16.4241 2.18955C16.7387 2.05925 17.0759 1.99219 17.4163 1.99219C17.7568 1.99219 18.094 2.05925 18.4085 2.18955C18.7231 2.31984 19.0089 2.51082 19.2497 2.75158C19.4904 2.99234 19.6814 3.27816 19.8117 3.59272C19.942 3.90728 20.0091 4.24443 20.0091 4.58491C20.0091 4.92539 19.942 5.26254 19.8117 5.57711C19.6814 5.89167 19.4904 6.17749 19.2497 6.41825L6.87467 18.7932L1.83301 20.1682L3.20801 15.1266L15.583 2.75158Z"
        stroke={colors.primary}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
export default PencilSvg;
