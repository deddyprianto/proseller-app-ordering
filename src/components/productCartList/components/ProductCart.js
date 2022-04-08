/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import colorConfig from '../../../config/colorConfig';

const WIDTH = Dimensions.get('window').width;
const styles = StyleSheet.create({
  image: {
    height: 100,
    width: 125,
  },
});

const Product = ({item}) => {
  const renderQty = () => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 70,
        }}>
        <TouchableOpacity>
          <View
            style={{
              width: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
            }}>
            <Text style={{color: 'black', fontSize: 16}}>-</Text>
          </View>
        </TouchableOpacity>
        <Text style={{fontSize: 16, color: 'black'}}>1</Text>
        <TouchableOpacity>
          <View
            style={{
              width: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
            }}>
            <Text style={{color: 'black', fontSize: 16}}>+</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <TouchableOpacity>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: WIDTH,
          margin: 10,
        }}>
        <Image
          style={styles.image}
          resizeMode="stretch"
          source={{uri: item.image}}
        />
        <View style={{marginLeft: 10}}>
          <Text style={{fontWeight: 'bold'}}>Curry soft bun</Text>
          <Text style={{color: colorConfig.primaryColor, marginTop: 10}}>
            $6.00
          </Text>
          <Text style={{marginTop: 10, fontSize: 10, width: 160}}>
            Choice : Rice
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            position: 'absolute',
            bottom: 0,
            right: 20,
          }}>
          <IconIonicons
            name="md-trash"
            style={{
              color: colorConfig.primaryColor,
              fontSize: 20,
              marginRight: 10,
            }}
          />
          {renderQty()}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Product;
