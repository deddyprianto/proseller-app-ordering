import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';
import Theme from '../../theme/Theme';

const SearchSvg = props => {
  const {colors} = Theme();
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G id="fluent:mail-28-regular">
        <Path
          d="M21.7075 20.2875L17.9975 16.6075C19.4376 14.8119 20.135 12.5328 19.9463 10.2388C19.7576 7.94476 18.6971 5.81025 16.983 4.27411C15.2688 2.73797 13.0313 1.91697 10.7304 1.97993C8.4295 2.04289 6.24018 2.98502 4.6126 4.6126C2.98502 6.24018 2.04289 8.4295 1.97993 10.7304C1.91697 13.0313 2.73797 15.2688 4.27411 16.983C5.81025 18.6971 7.94476 19.7576 10.2388 19.9463C12.5328 20.135 14.8119 19.4376 16.6075 17.9975L20.2875 21.6775C20.3804 21.7712 20.491 21.8456 20.6129 21.8964C20.7347 21.9471 20.8655 21.9733 20.9975 21.9733C21.1295 21.9733 21.2602 21.9471 21.382 21.8964C21.5039 21.8456 21.6145 21.7712 21.7075 21.6775C21.8877 21.491 21.9885 21.2418 21.9885 20.9825C21.9885 20.7231 21.8877 20.4739 21.7075 20.2875ZM10.9975 17.9975C9.61299 17.9975 8.25962 17.5869 7.10847 16.8178C5.95733 16.0486 5.06012 14.9553 4.53031 13.6762C4.00049 12.3972 3.86187 10.9897 4.13197 9.63183C4.40206 8.27396 5.06875 7.02668 6.04772 6.04772C7.02668 5.06875 8.27396 4.40206 9.63183 4.13197C10.9897 3.86187 12.3972 4.00049 13.6762 4.53031C14.9553 5.06012 16.0486 5.95733 16.8178 7.10847C17.5869 8.25962 17.9975 9.61299 17.9975 10.9975C17.9975 12.854 17.26 14.6345 15.9472 15.9472C14.6345 17.26 12.854 17.9975 10.9975 17.9975Z"
          fill={colors.greyScale2}
        />
      </G>
    </Svg>
  );
};

export default SearchSvg;
