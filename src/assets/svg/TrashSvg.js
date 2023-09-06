import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const TrashSvg = props => (
  <Svg
    width={23}
    height={22}
    viewBox="0 0 23 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M3.25 5.5H5.08333H19.75"
      stroke="#003F24"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.83594 5.4987V3.66536C7.83594 3.17913 8.02909 2.71282 8.37291 2.369C8.71673 2.02519 9.18304 1.83203 9.66927 1.83203H13.3359C13.8222 1.83203 14.2885 2.02519 14.6323 2.369C14.9761 2.71282 15.1693 3.17913 15.1693 3.66536V5.4987M17.9193 5.4987V18.332C17.9193 18.8183 17.7261 19.2846 17.3823 19.6284C17.0385 19.9722 16.5722 20.1654 16.0859 20.1654H6.91927C6.43304 20.1654 5.96672 19.9722 5.62291 19.6284C5.27909 19.2846 5.08594 18.8183 5.08594 18.332V5.4987H17.9193Z"
      stroke="#003F24"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default TrashSvg;
