import React from 'react';
import Svg, {Path} from 'react-native-svg';
import Theme from '../../theme/Theme';

const ReferralSvg = props => {
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
        d="M28.5 12.4c-6 2.7-10.1 10.2-9 16.8 2.6 15.2 24.6 17.6 30 3.3 5.1-13.3-8-25.9-21-20.1zM38 19c2 0 5 4.5 5 7.5 0 6.1-5.4 9.8-11 7.5-2.8-1.1-5-4.6-5-7.8 0-3.9 5.6-8.7 8.8-7.6.8.2 1.8.4 2.2.4zm48-5.8c-7.5 5.2-9.9 13.1-6.1 20.5 3.1 6.1 7.8 8.6 15.2 8.1 5-.4 6.4-.9 9.3-3.7 6.2-6 6.8-14.8 1.4-21.6-4.4-5.7-14-7.2-19.8-3.3zm13.8 8.4c6.7 7.5-4.2 18.1-11.3 10.9-4.2-4.1-3.2-10.8 1.9-13.1 3.8-1.6 6.4-1 9.4 2.2zM61.3 38.1C47.4 41 44.4 59.6 56.6 66.8c7.6 4.5 18.1 1.5 21.8-6.2 5.7-12.1-4.3-25.3-17.1-22.5zm8.3 9.3c2.1 1.8 2.8 3.2 2.8 6.1 0 9.6-14.2 10.3-16 .8-.5-2.7-.1-3.7 2.4-6.3 3.7-3.6 7.1-3.9 10.8-.6zm-53.8 2.1c-3.4 1.9-5.2 7.3-4.5 13.7.8 6.8 3.4 10.8 8.7 13.5 5.3 2.6 16 4.2 16 2.3 0-.6.9-2.5 2.1-4.1l2-2.9H34c-6.9 0-12.3-1.9-13.9-4.8-.6-1.2-1.1-4.1-1.1-6.6V56h24v-8H30.8c-8.8.1-13.1.5-15 1.5zm70 2.5.4 4H110v3.2c0 2.6.7 3.7 3.4 5.5 1.9 1.2 3.7 1.9 4 1.6 1-1 .7-8.8-.5-12.2-1.8-5-5.1-6.1-19.1-6.1H85.4l.4 4zm0 13.3C77 67.8 70.4 74 66.4 83.5c-2.5 6-1.6 17.8 1.9 23.7 3.2 5.4 8.6 10.4 14.1 12.9 5.1 2.3 15.5 2.5 21.8.3 9.7-3.3 17.3-13.4 18.5-24.6 2-19.7-17.6-35.9-36.9-30.5zM97 83v7h6.3c6.9 0 10.2 1.5 9.1 4.3-.5 1.4-1.9 1.7-8 1.7H97v6.7c0 7.6-.9 9.7-3.6 9.1-1.6-.3-1.9-1.4-2.2-8.1l-.3-7.7h-7.5c-5.7 0-7.6-.3-8-1.5-1.2-3.1 1.5-4.5 8.7-4.5H91v-6.8c0-7.4 1.2-9.7 4.2-8.1 1.5.8 1.8 2.2 1.8 7.9zm-53.5-5.5c-2.2 2.1-2.5 3.3-2.5 9.7 0 8.4 1.9 12.6 7.2 15.8 3 1.8 11.4 3.7 12.3 2.8.3-.2 0-2.1-.6-4.1-.8-3-1.5-3.7-3.4-3.7-4.1 0-7.6-4-8.2-9.4-.7-5.8.2-6.6 7.3-6.6 4.8 0 5.1-.2 6.7-3.5L64 75h-9.1c-8.2 0-9.2.2-11.4 2.5z"
        fill={colors.primary}
      />
    </Svg>
  );
};

export default ReferralSvg;
