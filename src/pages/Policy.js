import React from 'react';
import {Dimensions, SafeAreaView, View} from 'react-native';
import {WebView} from 'react-native-webview';
import Header from '../components/layout/header/Header';
const Policy = props => {
  console.log(props, 'lusia');
  const {params} = props.navigation.state;
  return (
    <SafeAreaView>
      <Header isMiddleLogo={true} />
      <View style={{backgroundColor: 'red', height: '100%'}}>
        <WebView
          source={{
            uri: params.url,
          }}
          style={{flex: 1}}
          containerStyle={{paddingBottom: 50}}
        />
      </View>
    </SafeAreaView>
  );
};

export default Policy;
