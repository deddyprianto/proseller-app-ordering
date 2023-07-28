import React from 'react';
import {SafeAreaView, View, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import Header from '../components/layout/header/Header';

const styles = StyleSheet.create({
  webContainer: {
    paddingBottom: 100,
  },
  webStyle: {
    flex: 1,
  },
  parentWebstyle: {
    height: '100%',
  },
});

const WebviewPage = props => {
  const {params} = props.navigation.state;
  return (
    <SafeAreaView>
      <Header isMiddleLogo={true} />
      <View style={styles.parentWebstyle}>
        <WebView
          source={{
            uri: params.url,
          }}
          style={styles.webStyle}
          containerStyle={styles.webContainer}
        />
      </View>
    </SafeAreaView>
  );
};

export default WebviewPage;
