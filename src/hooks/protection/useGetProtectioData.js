import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../../config/awsConfig';
import {useSelector} from 'react-redux';

const useGetProtectionData = () => {
  const userDetail = useSelector(
    state => state.userReducer.getUser.userDetails,
  );
  const getUserDetail = () => {
    const userDecrypt = CryptoJS.AES.decrypt(
      userDetail,
      awsConfig.PRIVATE_KEY_RSA,
    );
    const result = JSON.parse(userDecrypt.toString(CryptoJS.enc.Utf8));
    return result;
  };

  return {
    getUserDetail,
  };
};

export default useGetProtectionData;
