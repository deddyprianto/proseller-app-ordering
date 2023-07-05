import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';
import Theme from '../../theme/Theme';

const AlertSvg = props => {
  const {colors} = Theme();
  return (
    <Svg
      width="57"
      height="56"
      viewBox="0 0 57 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G id="fluent:mail-28-regular">
        <Path
          d="M28.4974 4.66406C41.3844 4.66406 51.8307 15.1104 51.8307 27.9974C51.8307 40.8844 41.3844 51.3307 28.4974 51.3307C15.6104 51.3307 5.16406 40.8844 5.16406 27.9974C5.16406 15.1104 15.6104 4.66406 28.4974 4.66406ZM28.4974 7.91906C23.1723 7.91906 18.0653 10.0345 14.2999 13.7999C10.5345 17.5653 8.41906 22.6723 8.41906 27.9974C8.41906 33.3225 10.5345 38.4295 14.2999 42.1949C18.0653 45.9603 23.1723 48.0757 28.4974 48.0757C33.8225 48.0757 38.9295 45.9603 42.6949 42.1949C46.4603 38.4295 48.5757 33.3225 48.5757 27.9974C48.5757 22.6723 46.4603 17.5653 42.6949 13.7999C38.9295 10.0345 33.8225 7.91906 28.4974 7.91906ZM28.1591 21.4874C29.0574 21.4874 29.7854 22.2177 29.7854 23.1161V40.7514C29.7695 41.1724 29.591 41.5708 29.2875 41.863C28.9841 42.1552 28.5792 42.3184 28.1579 42.3184C27.7366 42.3184 27.3317 42.1552 27.0283 41.863C26.7248 41.5708 26.5463 41.1724 26.5304 40.7514V23.1137C26.5304 22.2154 27.2584 21.4851 28.1591 21.4851V21.4874ZM28.2244 14.9774C28.7999 14.9774 29.3519 15.206 29.7588 15.613C30.1658 16.0199 30.3944 16.5719 30.3944 17.1474C30.3944 17.7229 30.1658 18.2749 29.7588 18.6818C29.3519 19.0888 28.7999 19.3174 28.2244 19.3174C27.6489 19.3174 27.0969 19.0888 26.69 18.6818C26.283 18.2749 26.0544 17.7229 26.0544 17.1474C26.0544 16.5719 26.283 16.0199 26.69 15.613C27.0969 15.206 27.6489 14.9774 28.2244 14.9774Z"
          fill="#9D9D9D"
        />
      </G>
    </Svg>
  );
};

export default AlertSvg;
