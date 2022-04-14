import React, {useState} from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({});

const FavoriteOutletListItem = ({item}) => {
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
          fontSize: 16,
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
          fontSize: 16,
          color: 'red',
        }}
      />
    );
  };

  const renderStar = () => {
    const star = active ? activeStar() : inactiveStar();

    return (
      <View
        style={{
          backgroundColor: 'white',
          width: 30,
          height: 30,
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: 9,
          right: 7,
        }}>
        <TouchableOpacity
          onPress={() => {
            handleStarClicked();
          }}>
          {star}
        </TouchableOpacity>
      </View>
    );
  };

  const renderImage = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          Actions.favoriteOutletDetail();
        }}>
        <Image
          style={{
            width: WIDTH * 0.44,
            height: HEIGHT * 0.2,
          }}
          source={{uri: item.image}}
        />
      </TouchableOpacity>
    );
  };

  const renderText = () => {
    return (
      <Text
        style={{
          width: WIDTH * 0.44,
          textAlign: 'center',
          marginTop: 8,
        }}>
        One Raffles Place
      </Text>
    );
  };

  return (
    <View
      style={{
        marginTop: 16,
        width: WIDTH * 0.44,
      }}>
      {renderImage()}
      {renderStar()}
      {renderText()}
    </View>
  );
};

export default FavoriteOutletListItem;
