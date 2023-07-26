import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath, Rect} from 'react-native-svg';
const NotesSvg = props => (
  <Svg
    width={18}
    height={19}
    viewBox="0 0 18 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <G clipPath="url(#clip0_4805_17420)">
      <Path
        d="M9.75 1.55469H4.5C4.10218 1.55469 3.72064 1.71272 3.43934 1.99403C3.15804 2.27533 3 2.65686 3 3.05469V15.0547C3 15.4525 3.15804 15.834 3.43934 16.1153C3.72064 16.3967 4.10218 16.5547 4.5 16.5547H13.5C13.8978 16.5547 14.2794 16.3967 14.5607 16.1153C14.842 15.834 15 15.4525 15 15.0547V6.80469L9.75 1.55469Z"
        stroke="#343A4A"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.75 1.55469V6.80469H15"
        stroke="#343A4A"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_4805_17420">
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
export default NotesSvg;
