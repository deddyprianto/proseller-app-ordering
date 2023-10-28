import * as React from 'react';
import Svg, {Mask, Path} from 'react-native-svg';
const PointSvg = props => {
  const {color} = props;
  return (
    <Svg
      width={22}
      height={22}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Mask id="path-1-inside-1_4195_17219" fill="white">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.7036 12.5713V16.4998C19.7036 18.2022 16.3238 20.4284 12.1545 20.4284C7.98529 20.4284 4.60547 18.2022 4.60547 16.4998V13.226"
        />
      </Mask>
      <Path
        d="M21.2036 12.5713C21.2036 11.7429 20.532 11.0713 19.7036 11.0713C18.8752 11.0713 18.2036 11.7429 18.2036 12.5713H21.2036ZM6.10547 13.226C6.10547 12.3976 5.4339 11.726 4.60547 11.726C3.77704 11.726 3.10547 12.3976 3.10547 13.226H6.10547ZM18.2036 12.5713V16.4998H21.2036V12.5713H18.2036ZM18.2036 16.4998C18.2036 16.435 18.2243 16.5591 17.9688 16.8587C17.7285 17.1406 17.3272 17.4741 16.7565 17.7955C15.6179 18.4367 13.9846 18.9284 12.1545 18.9284V21.9284C14.4937 21.9284 16.6349 21.3069 18.2286 20.4095C19.0239 19.9615 19.7281 19.4193 20.2518 18.805C20.7604 18.2084 21.2036 17.4159 21.2036 16.4998H18.2036ZM12.1545 18.9284C10.3245 18.9284 8.69118 18.4367 7.55258 17.7955C6.98184 17.4741 6.58051 17.1406 6.34021 16.8587C6.08479 16.5591 6.10547 16.435 6.10547 16.4998H3.10547C3.10547 17.4159 3.54863 18.2084 4.05721 18.805C4.58092 19.4193 5.28512 19.9615 6.08049 20.4095C7.67411 21.3069 9.81532 21.9284 12.1545 21.9284V18.9284ZM6.10547 16.4998V13.226H3.10547V16.4998H6.10547Z"
        fill={color || '#343A4A'}
        mask="url(#path-1-inside-1_4195_17219)"
      />
      <Mask id="path-3-inside-2_4195_17219" fill="white">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.91797 13.5638C5.85082 15.0671 8.73564 16.4775 12.15 16.4775C16.3192 16.4775 19.699 14.3744 19.699 12.5673C19.699 11.5524 18.6346 10.4406 16.9641 9.66016"
        />
      </Mask>
      <Path
        d="M6.19252 12.7729C5.75572 12.069 4.83099 11.8525 4.12707 12.2893C3.42316 12.7261 3.20662 13.6508 3.64342 14.3547L6.19252 12.7729ZM17.599 8.30116C16.8485 7.9505 15.9558 8.27467 15.6051 9.02523C15.2545 9.77578 15.5786 10.6685 16.3292 11.0191L17.599 8.30116ZM3.64342 14.3547C4.33483 15.4689 5.59903 16.359 7.01389 16.9637C8.46707 17.5848 10.2426 17.9775 12.15 17.9775V14.9775C10.643 14.9775 9.26896 14.665 8.19293 14.2051C7.07859 13.7288 6.43396 13.162 6.19252 12.7729L3.64342 14.3547ZM12.15 17.9775C14.4729 17.9775 16.6111 17.3946 18.2111 16.5142C19.0098 16.0748 19.7213 15.5352 20.2507 14.9097C20.7723 14.2935 21.199 13.4916 21.199 12.5673H18.199C18.199 12.5465 18.2033 12.6852 17.9609 12.9715C17.7263 13.2486 17.3322 13.5737 16.7649 13.8858C15.6326 14.5088 13.9963 14.9775 12.15 14.9775V17.9775ZM21.199 12.5673C21.199 11.533 20.6675 10.6506 20.048 9.99534C19.4126 9.32316 18.5592 8.74977 17.599 8.30116L16.3292 11.0191C17.0395 11.351 17.5536 11.7237 17.868 12.0563C18.1984 12.4057 18.199 12.5867 18.199 12.5673H21.199Z"
        fill={color || '#343A4A'}
        mask="url(#path-3-inside-2_4195_17219)"
      />
      <Mask id="path-5-inside-3_4195_17219" fill="white">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.4653 6.02344V9.95197C16.4653 11.6543 13.0855 13.8805 8.91625 13.8805C4.74701 13.8805 1.36719 11.6543 1.36719 9.95197V6.02344"
        />
      </Mask>
      <Path
        d="M17.9653 6.02344C17.9653 5.19501 17.2937 4.52344 16.4653 4.52344C15.6369 4.52344 14.9653 5.19501 14.9653 6.02344H17.9653ZM2.86719 6.02344C2.86719 5.19501 2.19561 4.52344 1.36719 4.52344C0.53876 4.52344 -0.132812 5.19501 -0.132812 6.02344H2.86719ZM14.9653 6.02344V9.95197H17.9653V6.02344H14.9653ZM14.9653 9.95197C14.9653 9.88711 14.986 10.0112 14.7306 10.3109C14.4903 10.5927 14.0889 10.9262 13.5182 11.2476C12.3796 11.8888 10.7463 12.3805 8.91625 12.3805V15.3805C11.2555 15.3805 13.3967 14.7591 14.9903 13.8616C15.7857 13.4137 16.4899 12.8714 17.0136 12.2571C17.5222 11.6605 17.9653 10.868 17.9653 9.95197H14.9653ZM8.91625 12.3805C7.08622 12.3805 5.4529 11.8888 4.3143 11.2476C3.74356 10.9262 3.34223 10.5927 3.10193 10.3109C2.84651 10.0112 2.86719 9.88711 2.86719 9.95197H-0.132812C-0.132812 10.868 0.310345 11.6605 0.818928 12.2571C1.34264 12.8714 2.04684 13.4137 2.84221 13.8616C4.43583 14.7591 6.57704 15.3805 8.91625 15.3805V12.3805ZM2.86719 9.95197V6.02344H-0.132812V9.95197H2.86719Z"
        fill={color || '#343A4A'}
        mask="url(#path-5-inside-3_4195_17219)"
      />
      <Path
        d="M15.7153 6.02064C15.7153 6.23614 15.6118 6.54061 15.2996 6.90943C14.9913 7.27363 14.5179 7.6523 13.8927 7.99631C12.6435 8.68362 10.8817 9.18084 8.91625 9.18084C6.95079 9.18084 5.18897 8.68362 3.9398 7.99631C3.31459 7.6523 2.84117 7.27363 2.53288 6.90943C2.22069 6.54061 2.11719 6.23614 2.11719 6.02064C2.11719 5.80435 2.22108 5.49845 2.53369 5.12788C2.84231 4.76205 3.31599 4.38157 3.94119 4.03586C5.19034 3.34511 6.95172 2.84473 8.91625 2.84473C10.8808 2.84473 12.6422 3.34511 13.8913 4.03586C14.5165 4.38157 14.9902 4.76205 15.2988 5.12788C15.6114 5.49845 15.7153 5.80435 15.7153 6.02064Z"
        stroke={color || '#343A4A'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
export default PointSvg;
