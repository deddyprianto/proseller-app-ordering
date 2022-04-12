import React, {useState} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import appConfig from '../config/appConfig';

import colorConfig from '../config/colorConfig';

// import StarIcon from '../assets/img/star.svg';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewImage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 38,
  },
  image: {height: 235, width: 340},
  marginTop20: {marginTop: 20},
  textSeeAll: {color: 'white', fontSize: 12},
  touchableSeeAll: {
    height: 34,
    width: 130,
    backgroundColor: colorConfig.primaryColor,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const MyFavoriteOutlet = () => {
  const images = [
    'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
  ];

  const renderImages = () => {
    return (
      <View style={styles.viewImage}>
        <Image
          style={styles.image}
          resizeMode="stretch"
          source={{uri: images[0]}}
        />
      </View>
    );
  };

  const renderSeeAllButton = () => {
    return (
      <TouchableOpacity
        style={styles.touchableSeeAll}
        onPress={() => {
          Actions.login();
        }}>
        <Text style={styles.textSeeAll}>See All Outlet</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          height: 53,
          borderBottomWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: WIDTH,
        }}>
        <Text>My Favorite Outlets</Text>
      </View>
      {renderImages()}
      <View
        style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <Image
          style={{width: 20, height: 20, tintColor: colorConfig.primaryColor}}
          resizeMode="stretch"
          source={appConfig.star}
        />
        <Text>One Raffles Place</Text>
        <Image
          style={{width: 20, height: 20}}
          resizeMode="stretch"
          source={appConfig.warning}
        />

        {/* <View>
          <StarIcon width={30} height={30} />
        </View> */}
      </View>
      {renderSeeAllButton()}
    </SafeAreaView>
  );
};

export default MyFavoriteOutlet;
