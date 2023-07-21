import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const PhoneSvg = props => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.48801 3.28143L10.4999 6.47732C10.8732 6.87363 10.8734 7.49463 10.5005 7.89127L9.04455 9.43982C9.95876 12.2348 12.0032 14.4708 14.5944 15.5281L14.8845 15.6407L16.2646 14.1729C16.6523 13.7606 17.2985 13.7427 17.708 14.133L20.7199 17.3289C21.0931 17.7252 21.0934 18.3462 20.7205 18.7428L19.9715 19.5395C18.6035 20.9944 16.5203 21.4045 14.6906 20.5789C12.1042 19.412 10.0172 17.9857 8.42964 16.3C6.84206 14.6143 5.49814 12.3976 4.39787 9.65009C3.65062 7.78412 3.97473 5.66885 5.21213 4.21538L5.37155 4.03721L6.04467 3.32128C6.43231 2.90899 7.07851 2.89115 7.48801 3.28143Z"
      stroke="black"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default PhoneSvg;
