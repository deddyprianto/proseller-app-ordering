/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';

import {StyleSheet, View, Text, Image, Dimensions} from 'react-native';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import colorConfig from '../../../config/colorConfig';

const styles = StyleSheet.create({
  image: {
    height: 160,
    width: 175,
    marginTop: 20,
  },
});

const Product = ({item}) => {
  return (
    <View>
      <Image
        style={styles.image}
        resizeMode="stretch"
        source={{uri: item.image}}
      />
      <View style={{display: 'flex', flexDirection: 'row', marginTop: 5}}>
        <Text style={{color: colorConfig.primaryColor, fontSize: 12}}>
          6 x{' '}
        </Text>
        <Text style={{fontSize: 12}}>Curry Soft Bun</Text>
      </View>
      <Text style={{marginTop: 5, fontSize: 12}}>$ 6.00</Text>

      <IconAntDesign
        name="shoppingcart"
        style={{
          width: 40,
          height: 25,
          fontSize: 15,
          backgroundColor: colorConfig.primaryColor,
          textAlign: 'center',
          textAlignVertical: 'center',
          color: 'white',
          borderRadius: 5,
          position: 'absolute',
          right: 0,
          bottom: 0,
        }}
      />
    </View>
  );
};

export default Product;
