import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath, Rect} from 'react-native-svg';
const CalendarBold = props => (
  <Svg
    width={18}
    height={19}
    viewBox="0 0 18 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <G clipPath="url(#clip0_4805_17409)">
      <Path
        d="M14.25 3.05469H3.75C2.92157 3.05469 2.25 3.72626 2.25 4.55469V15.0547C2.25 15.8831 2.92157 16.5547 3.75 16.5547H14.25C15.0784 16.5547 15.75 15.8831 15.75 15.0547V4.55469C15.75 3.72626 15.0784 3.05469 14.25 3.05469Z"
        stroke="#343A4A"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 1.55469V4.55469"
        stroke="#343A4A"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 1.55469V4.55469"
        stroke="#343A4A"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.25 7.55469H15.75"
        stroke="#343A4A"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_4805_17409">
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
export default CalendarBold;
