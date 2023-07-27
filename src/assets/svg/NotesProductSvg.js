import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const NotesProduct = props => (
  <Svg
    width={18}
    height={19}
    viewBox="0 0 18 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.6875 2.30469H16.3125L16.875 2.86719V14.1172L16.3125 14.6797H1.6875L1.125 14.1172V2.86719L1.6875 2.30469ZM2.25 3.42969V13.5547H15.75V3.42969H2.25ZM4.5 5.67969H13.5V6.80469H4.5V5.67969ZM11.25 7.92969H4.5V9.05469H11.25V7.92969ZM4.5 10.1797H9V11.3047H4.5V10.1797Z"
      fill="#B7B7B7"
    />
  </Svg>
);
export default NotesProduct;
