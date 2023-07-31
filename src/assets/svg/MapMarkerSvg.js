import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath, Rect} from 'react-native-svg';
const MapMarkerSvg = props => (
  <Svg
    width={18}
    height={19}
    viewBox="0 0 18 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <G clipPath="url(#clip0_4805_17388)">
      <Path
        d="M15.75 8C15.75 13.25 9 17.75 9 17.75C9 17.75 2.25 13.25 2.25 8C2.25 6.20979 2.96116 4.4929 4.22703 3.22703C5.4929 1.96116 7.20979 1.25 9 1.25C10.7902 1.25 12.5071 1.96116 13.773 3.22703C15.0388 4.4929 15.75 6.20979 15.75 8Z"
        stroke="#343A4A"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 10.25C10.2426 10.25 11.25 9.24264 11.25 8C11.25 6.75736 10.2426 5.75 9 5.75C7.75736 5.75 6.75 6.75736 6.75 8C6.75 9.24264 7.75736 10.25 9 10.25Z"
        stroke="#343A4A"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_4805_17388">
        <Rect
          width={18}
          height={18}
          fill="white"
          transform="translate(0 0.5)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);
export default MapMarkerSvg;
