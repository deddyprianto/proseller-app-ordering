import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath, Rect} from 'react-native-svg';
const CreditCard = props => (
  <Svg
    width={22}
    height={23}
    viewBox="0 0 22 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <G clipPath="url(#clip0_5547_170647)">
      <Path
        d="M19.2513 4.22266H2.7513C1.73878 4.22266 0.917969 5.04347 0.917969 6.05599V17.056C0.917969 18.0685 1.73878 18.8893 2.7513 18.8893H19.2513C20.2638 18.8893 21.0846 18.0685 21.0846 17.056V6.05599C21.0846 5.04347 20.2638 4.22266 19.2513 4.22266Z"
        stroke="black"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M0.917969 9.72266H21.0846"
        stroke="black"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_5547_170647">
        <Rect
          width={22}
          height={22}
          fill="white"
          transform="translate(0 0.554688)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);
export default CreditCard;
