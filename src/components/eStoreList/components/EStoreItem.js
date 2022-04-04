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
    height: 120,
    width: 125,
    borderRadius: 30,
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
    <TouchableOpacity
      onPress={() => {
        Actions.productDetail({item});
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 370,
          margin: 10,
          padding: 10,
          borderRadius: 10,
          backgroundColor: colorConfig.fifthColor,
        }}>
        <Image
          style={styles.image}
          resizeMode="stretch"
          source={{uri: item.image}}
        />
        <View
          style={{
            marginLeft: 10,
            width: 180,
            marginRight: 20,
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}>
          <Text style={{textAlign: 'right'}}>
            Curry soft bun Curry soft bun
          </Text>
          <Text
            style={{
              marginBottom: 10,
            }}>
            $6.00
          </Text>
          <TouchableOpacity>
            <View
              style={{
                width: 160,
                height: 35,
                backgroundColor: colorConfig.primaryColor,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: 'white', fontSize: 16}}>ADD TO CART</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Product;
