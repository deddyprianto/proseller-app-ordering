import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import Theme from '../../theme/Theme';
const CardSvg = props => {
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
        d="M19.9375 3.4375H2.0625C1.68223 3.4375 1.375 3.74473 1.375 4.125V17.875C1.375 18.2553 1.68223 18.5625 2.0625 18.5625H19.9375C20.3178 18.5625 20.625 18.2553 20.625 17.875V4.125C20.625 3.74473 20.3178 3.4375 19.9375 3.4375ZM2.92188 4.98438H19.0781V7.5625H2.92188V4.98438ZM19.0781 17.0156H2.92188V9.45312H19.0781V17.0156ZM13.9863 15.6406H17.5312C17.6258 15.6406 17.7031 15.5633 17.7031 15.4688V13.9219C17.7031 13.8273 17.6258 13.75 17.5312 13.75H13.9863C13.8918 13.75 13.8145 13.8273 13.8145 13.9219V15.4688C13.8145 15.5633 13.8918 15.6406 13.9863 15.6406Z"
        fill={colors.primary}
      />
    </Svg>
  );
};
export default CardSvg;
