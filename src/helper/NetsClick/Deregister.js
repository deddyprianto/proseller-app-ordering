import {NativeModules} from 'react-native';

const {NetsClickReact} = NativeModules;

const Deregister = async () => {
  const ret = await NetsClickReact.doDeregister();
  console.log(ret);
  return ret;
};

export default Deregister;
