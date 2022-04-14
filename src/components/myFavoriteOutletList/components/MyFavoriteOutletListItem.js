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
import appConfig from '../../../config/appConfig';

import colorConfig from '../../../config/colorConfig';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
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

const MyFavoriteOutletItemList = ({item, selectedOutlet}) => {
  const outletItem = () => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: WIDTH,
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: selectedOutlet ? '#F9F9F9' : 'white',
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            style={{width: 24, height: 24, tintColor: colorConfig.primaryColor}}
            resizeMode="stretch"
            source={appConfig.star}
          />
          <Text style={{marginLeft: 16}}>One Raffles Place</Text>
        </View>
        <Image
          style={{width: 24, height: 24}}
          resizeMode="stretch"
          source={appConfig.warning}
        />
      </View>
    );
  };

  const outletItemDetail = () => {
    const detail = (
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 16,
        }}>
        <Text>1 Raffles Place, #B1-02</Text>
        <Text>Singapore 048616</Text>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 16,
          }}>
          <Text style={{fontWeight: 'bold'}}>Mon-Fri: </Text>
          <Text>645am-7pm (last order 6.30pm)</Text>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={{fontWeight: 'bold'}}>Saturday: </Text>
          <Text>815am-430pm (last order 4pm)</Text>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 16,
          }}>
          <Text style={{fontWeight: 'bold'}}>PH/Sunday: </Text>
          <Text>Close</Text>
        </View>
      </View>
    );

    if (selectedOutlet) {
      return (
        <>
          {detail}
          <View style={{backgroundColor: '#D6D6D6', height: 1}} />
        </>
      );
    }
    return;
  };
  return (
    <View>
      {outletItem()}
      <View style={{backgroundColor: '#D6D6D6', height: 1}} />
      {outletItemDetail()}
    </View>
  );
};

export default MyFavoriteOutletItemList;
