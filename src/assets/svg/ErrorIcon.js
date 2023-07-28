import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath, Rect} from 'react-native-svg';
const ErrorIcon = props => (
  <Svg
    width={22}
    height={22}
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <G clipPath="url(#clip0_6157_24821)">
      <Path
        d="M10.9987 20.1654C16.0613 20.1654 20.1654 16.0613 20.1654 10.9987C20.1654 5.93609 16.0613 1.83203 10.9987 1.83203C5.93609 1.83203 1.83203 5.93609 1.83203 10.9987C1.83203 16.0613 5.93609 20.1654 10.9987 20.1654Z"
        fill="#CE1111"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.75 8.25L8.25 13.75"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.25 8.25L13.75 13.75"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_6157_24821">
        <Rect width={22} height={22} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default ErrorIcon;
