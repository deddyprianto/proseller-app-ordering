import React, {useState} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Dimensions,
  Button,
  TouchableOpacity,
} from 'react-native';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import colorConfig from '../../config/colorConfig';
import appConfig from '../../config/appConfig';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    paddingLeft: WIDTH * 0.025,
    paddingRight: WIDTH * 0.025,
  },
  buttonWelcome: {
    width: WIDTH * 0.45,
  },
  buttonOrder: {
    height: HEIGHT * 0.25,
    width: WIDTH * 0.45,
  },
});

const Menu = () => {
  const renderWelcome = () => {
    return (
      <TouchableOpacity>
        <View
          style={{
            display: 'flex',
            borderRadius: 10,
            backgroundColor: '#F3F6FB',
            height: HEIGHT * 0.08,
            width: WIDTH * 0.45,
            elevation: 2,
          }}>
          <Text
            style={{
              color: colorConfig.store.defaultColor,
              textAlign: 'center',
              fontSize: 14,
              fontWeight: 'bold',
              marginTop: 5,
            }}>
            Welcome xxx,
          </Text>

          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 14,
            }}>
            55 PTS
          </Text>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              paddingRight: 10,
            }}>
            <Text
              style={{
                color: '#545455',
                fontSize: 8,
              }}>
              Redeem
            </Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              style={{
                color: '#545455',
                fontSize: 10,
                paddingTop: 1,
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMyFavoriteOutlet = () => {
    return (
      <TouchableOpacity>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            width: WIDTH * 0.45,
            height: HEIGHT * 0.08,
            backgroundColor: '#F3F6FB',
            elevation: 2,
          }}>
          <EvilIcons
            name="star"
            style={{
              fontSize: 18,
            }}
          />
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 14,
            }}>
            My Favorite Outlet
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderOrderHere = () => {
    return (
      <TouchableOpacity>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            backgroundColor: colorConfig.store.defaultColor,
            height: HEIGHT * 0.17,
            width: WIDTH * 0.45,
          }}>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: 18,
              fontWeight: 'bold',
            }}>
            ORDER
          </Text>

          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: 18,
              fontWeight: 'bold',
            }}>
            HERE
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              position: 'absolute',
              bottom: 6,
              right: 10,
            }}>
            <FontAwesome
              name="star"
              style={{
                color: 'white',
                fontSize: 3,
                paddingTop: 3,
                paddingRight: 2,
              }}
            />
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: 8,
              }}>
              For Dine-in and Takeaway Only
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEStore = () => {
    return (
      <TouchableOpacity>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            width: WIDTH * 0.28,
            height: HEIGHT * 0.14,
            backgroundColor: '#9CCEC2',
          }}>
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 13,
            }}>
            E-Store
          </Text>

          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 8,
            }}>
            merchandise and more
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMyECard = () => {
    return (
      <TouchableOpacity>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            width: WIDTH * 0.28,
            height: HEIGHT * 0.14,
            backgroundColor: '#E7A1A1',
          }}>
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 13,
            }}>
            My E-Card
          </Text>

          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 8,
            }}>
            scan for points
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSendGift = () => {
    return (
      <TouchableOpacity>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            width: WIDTH * 0.28,
            height: HEIGHT * 0.14,
            backgroundColor: '#F7DFD5',
          }}>
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 13,
            }}>
            Send A Gift
          </Text>

          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 8,
            }}>
            gift a friend a voucher
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: HEIGHT * 0.02,
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          {renderWelcome()}
          {renderMyFavoriteOutlet()}
        </View>
        {renderOrderHere()}
      </View>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: HEIGHT * 0.02,
        }}>
        {renderEStore()}
        {renderMyECard()}
        {renderSendGift()}
      </View>
      <Image
        style={{
          height: HEIGHT * 0.3,
          width: WIDTH * 0.95,
        }}
        source={appConfig.test}
        resizeMode="contain"
      />
    </SafeAreaView>
  );
};

export default Menu;
