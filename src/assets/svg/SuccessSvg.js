import * as React from 'react';
import Svg, {G, Mask, Path, Defs, ClipPath, Rect} from 'react-native-svg';
const SuccessSvg = props => (
  <Svg
    width={201}
    height={200}
    viewBox="0 0 201 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <G clipPath="url(#clip0_9156_95113)">
      <Mask
        id="mask0_9156_95113"
        style={{
          maskType: 'luminance',
        }}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={201}
        height={200}>
        <Path d="M200.5 0H0.5V200H200.5V0Z" fill="white" />
      </Mask>
      <G mask="url(#mask0_9156_95113)">
        <Path
          d="M100.332 28.7109C61.036 28.7109 29.1797 60.5672 29.1797 99.8637C29.1797 139.16 61.036 171.016 100.332 171.016C139.629 171.016 171.485 139.16 171.485 99.8637C171.485 60.5672 139.629 28.7109 100.332 28.7109Z"
          fill="#40B816"
        />
        <Path
          d="M132.538 77.4219L84.8801 122.545L68.6562 106.321"
          stroke="white"
          strokeWidth={9.46392}
          strokeLinecap="round"
        />
      </G>
    </G>
    <Defs>
      <ClipPath id="clip0_9156_95113">
        <Rect
          width={200}
          height={200}
          fill="white"
          transform="translate(0.5)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SuccessSvg;
