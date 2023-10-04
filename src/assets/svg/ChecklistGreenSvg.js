import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const CheckListGreenSvg = props => (
  <Svg
    width={props?.width || 12}
    height={props?.height || 12}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M5.386 0.657674C5.71806 0.301987 6.28194 0.301987 6.614 0.657674L7.12888 1.20917C7.32631 1.42064 7.61867 1.51563 7.90269 1.4606L8.6434 1.31706C9.12112 1.22449 9.5773 1.55593 9.63688 2.03887L9.72926 2.78768C9.76469 3.07481 9.94537 3.3235 10.2075 3.44592L10.8911 3.76518C11.332 3.97108 11.5063 4.50735 11.2706 4.93308L10.9052 5.59319C10.7651 5.8463 10.7651 6.1537 10.9052 6.40681L11.2706 7.06692C11.5063 7.49265 11.332 8.02892 10.8911 8.23482L10.2075 8.55408C9.94537 8.6765 9.76469 8.92519 9.72926 9.21232L9.63688 9.96113C9.5773 10.4441 9.12112 10.7755 8.6434 10.6829L7.90269 10.5394C7.61867 10.4844 7.32631 10.5794 7.12888 10.7908L6.614 11.3423C6.28194 11.698 5.71806 11.698 5.386 11.3423L4.87111 10.7908C4.67369 10.5794 4.38133 10.4844 4.09731 10.5394L3.3566 10.6829C2.87888 10.7755 2.4227 10.4441 2.36312 9.96113L2.27074 9.21232C2.23531 8.92519 2.05463 8.6765 1.7925 8.55408L1.10888 8.23482C0.66799 8.02892 0.493745 7.49265 0.729408 7.06692L1.09481 6.40681C1.23492 6.1537 1.23492 5.8463 1.09481 5.59319L0.729408 4.93308C0.493745 4.50735 0.667991 3.97108 1.10888 3.76518L1.7925 3.44592C2.05463 3.3235 2.23531 3.07481 2.27074 2.78768L2.36312 2.03887C2.4227 1.55593 2.87888 1.22449 3.3566 1.31706L4.09731 1.4606C4.38133 1.51563 4.67369 1.42064 4.87112 1.20917L5.386 0.657674Z"
      fill="#1A883C"
    />
    <Path
      d="M8 4.5L5.25 7.25L4 6"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default CheckListGreenSvg;
