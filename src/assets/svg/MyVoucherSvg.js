import React from 'react';
import Svg, {Path} from 'react-native-svg';
import Theme from '../../theme/Theme';

const MyVoucherSvg = props => {
  const {colors} = Theme();
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 129 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M15.7 28.1c-3.1 1.8-4.7 6.5-4.7 13.8 0 7.2 1.4 10.1 4.7 10.1C20.5 52 26 58.7 26 64.5 26 69.9 20.2 76 15.1 76c-3.3 0-4.4 3.5-3.9 12.3.4 7.2.8 8.3 3.2 10.4l2.7 2.3h47c30.4 0 47.7-.4 49-1 3.2-1.8 4.9-6.4 4.9-13.9 0-7.2-1.4-10.1-4.7-10.1-4.8 0-10.3-6.7-10.3-12.5 0-5.4 5.8-11.5 10.9-11.5 2.9 0 4.1-2.9 4.1-10 0-6.9-1.9-12.3-4.8-13.9-2.8-1.5-95-1.5-97.5 0zm94.1 11.6c.3 4.5 0 5.2-1.8 5.8-3.1 1-8.8 6.3-10.7 9.9-2.1 4-2.1 13.2 0 17.2 1.9 3.6 7.6 8.9 10.7 9.9 1.8.6 2.1 1.3 1.8 5.8l-.3 5.2h-90l-.3-5.2c-.3-4.5 0-5.2 1.8-5.8 3.1-1 8.8-6.3 10.7-9.9 2.1-4 2.1-13.2 0-17.2-1.8-3.6-7.6-8.9-10.6-9.9C19.4 45 19 44 19 40.1c0-2.6.3-5.1.7-5.4.3-.4 20.7-.6 45.2-.5l44.6.3.3 5.2z"
        fill={colors.primary}
      />
    </Svg>
  );
};

export default MyVoucherSvg;
