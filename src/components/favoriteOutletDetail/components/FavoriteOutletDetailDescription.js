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
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';

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
  const [active, setActive] = useState(false);

  const handleStarClicked = value => {
    if (active) {
      setActive(false);
    } else {
      setActive(true);
    }
  };

  const activeStar = () => {
    return (
      <IconFontAwesome
        name="star"
        style={{
          fontSize: 24,
          color: 'red',
        }}
      />
    );
  };

  const inactiveStar = () => {
    return (
      <IconFontAwesome
        name="star-o"
        style={{
          fontSize: 24,
          color: 'red',
        }}
      />
    );
  };

  const renderStar = () => {
    const star = active ? activeStar() : inactiveStar();

    return (
      <TouchableOpacity
        onPress={() => {
          handleStarClicked();
        }}>
        {star}
      </TouchableOpacity>
    );
  };
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
        <Text>One Raffles Place</Text>
        {renderStar()}
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

    return (
      <>
        {detail}
        <View style={{backgroundColor: '#D6D6D6', height: 1}} />
      </>
    );
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
