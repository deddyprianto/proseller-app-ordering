import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath, Rect} from 'react-native-svg';
const TruckSvg = props => (
  <Svg
    width={18}
    height={19}
    viewBox="0 0 18 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <G clipPath="url(#clip0_4805_17399)">
      <Path
        d="M12 2.30469H0.75V12.0547H12V2.30469Z"
        stroke="#343A4A"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 6.05469H15L17.25 8.30469V12.0547H12V6.05469Z"
        stroke="#343A4A"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4.125 15.8047C5.16053 15.8047 6 14.9652 6 13.9297C6 12.8942 5.16053 12.0547 4.125 12.0547C3.08947 12.0547 2.25 12.8942 2.25 13.9297C2.25 14.9652 3.08947 15.8047 4.125 15.8047Z"
        stroke="#343A4A"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.875 15.8047C14.9105 15.8047 15.75 14.9652 15.75 13.9297C15.75 12.8942 14.9105 12.0547 13.875 12.0547C12.8395 12.0547 12 12.8942 12 13.9297C12 14.9652 12.8395 15.8047 13.875 15.8047Z"
        stroke="#343A4A"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_4805_17399">
        <Rect
          width={18}
          height={18}
          fill="white"
          transform="translate(0 0.0546875)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);
export default TruckSvg;
