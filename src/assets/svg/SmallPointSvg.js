import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import Theme from '../../theme/Theme';
const PointSmall = props => {
  const {colors} = Theme();
  return (
    <Svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M15.8594 9.85547V12.4269C15.8594 13.5412 13.1731 14.9983 9.85938 14.9983C6.54566 14.9983 3.85938 13.5412 3.85938 12.4269V10.284"
        stroke={colors.primary}
        strokeWidth={1.14286}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4.10938 10.5083C4.8508 11.4923 7.14366 12.4154 9.85737 12.4154C13.1711 12.4154 15.8574 11.0388 15.8574 9.85598C15.8574 9.1917 15.0114 8.46398 13.6837 7.95312"
        stroke={colors.primary}
        strokeWidth={1.14286}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.2891 5.57031V8.14174C13.2891 9.25603 10.6028 10.7132 7.28906 10.7132C3.97535 10.7132 1.28906 9.25603 1.28906 8.14174V5.57031"
        stroke={colors.primary}
        strokeWidth={1.14286}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.28906 8.12914C10.6028 8.12914 13.2891 6.75257 13.2891 5.56971C13.2891 4.386 10.6028 3 7.28906 3C3.97535 3 1.28906 4.386 1.28906 5.56971C1.28906 6.75257 3.97535 8.12914 7.28906 8.12914Z"
        stroke={colors.primary}
        strokeWidth={1.14286}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
export default PointSmall;
