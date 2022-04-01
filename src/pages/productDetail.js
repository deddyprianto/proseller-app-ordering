/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useEffect, useState} from 'react';

import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';

import {CheckBox} from 'react-native-elements';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconAntDesign from 'react-native-vector-icons/AntDesign';

import colorConfig from '../config/colorConfig';
import EGiftCard from '../components/eGiftCard/EGiftCard';
import SearchBar from '../components/searchBar/SearchBar';
import ProductList from '../components/productList/ProductList';
import {SafeAreaView} from 'react-navigation';
import CartIcon from '../components/order/CartIcon';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  image: {
    height: 300,
    width: WIDTH,
    marginTop: 20,
  },
  viewProductModifier: {
    width: 30,
    height: 30,
    borderWidth: 1,
    marginRight: 20,
  },
  viewSelectedProductModifier: {
    width: 30,
    height: 30,
    borderWidth: 1,
    marginRight: 20,
    backgroundColor: colorConfig.primaryColor,
  },
  viewGroupProductModifier: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    marginBottom: 40,
  },
});

const ProductDetail = ({item, ...props}) => {
  const [selectedProductModifier, setSelectedProductModifier] = useState({});

  const datas = [
    {
      id: 1,
      name: 'choice of main',
      modifiers: [
        {id: 1, name: 'rice'},
        {id: 2, name: 'soft rice'},
        {id: 3, name: 'hard rice'},
        {id: 4, name: 'bun'},
        {id: 5, name: 'soft bun'},
        {id: 6, name: 'hard bun'},
      ],
    },
    {
      id: 1,
      name: 'choice of main',
      modifiers: [
        {id: 1, name: 'rice'},
        {id: 2, name: 'soft rice'},
        {id: 3, name: 'hard rice'},
        {id: 4, name: 'bun'},
        {id: 5, name: 'soft bun'},
        {id: 6, name: 'hard bun'},
      ],
    },
  ];

  const renderHeader = () => {
    return <Text style={{textAlign: 'center'}}>Fun Meal </Text>;
  };

  const renderImage = () => {
    return (
      <Image
        style={styles.image}
        resizeMode="stretch"
        source={{uri: item.image}}
      />
    );
  };

  const renderName = () => {
    return <Text style={{fontSize: 20}}>Curry Soft Bun</Text>;
  };

  const renderPrice = () => {
    return <Text style={{fontSize: 20}}>$6.00</Text>;
  };

  const renderQty = () => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 100,
        }}>
        <TouchableOpacity>
          <View
            style={{
              backgroundColor: colorConfig.primaryColor,
              width: 30,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: 'white', fontSize: 16}}>-</Text>
          </View>
        </TouchableOpacity>
        <Text style={{fontSize: 22, color: 'black'}}>1</Text>
        <TouchableOpacity>
          <View
            style={{
              backgroundColor: colorConfig.primaryColor,
              width: 30,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: 'white', fontSize: 16}}>+</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderButtonAdd = () => {
    return (
      <TouchableOpacity>
        <View
          style={{
            backgroundColor: colorConfig.primaryColor,
            width: 150,
            height: 30,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontSize: 16}}>Add to cart</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderStyleProductModifierItem = value => {
    if (value === selectedProductModifier.id) {
      return styles.viewSelectedProductModifier;
    }
    return styles.viewProductModifier;
  };

  const renderProductModifierItems = modifiers => {
    const result = modifiers.map(modifier => {
      return (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 10,
            marginTop: 10,
            minWidth: 175,
          }}>
          <TouchableOpacity
            onPress={() => {
              setSelectedProductModifier(modifier);
            }}>
            <View style={renderStyleProductModifierItem(modifier.id)} />
          </TouchableOpacity>
          <Text>{modifier.name}</Text>
        </View>
      );
    });

    return result;
  };

  const renderProductModifiers = () => {
    const result = datas.map(data => {
      return (
        <View>
          <Text>Choice of main</Text>
          <View style={styles.viewGroupProductModifier}>
            {renderProductModifierItems(data.modifiers)}
          </View>
        </View>
      );
    });

    return result;
  };

  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          marginTop: 20,
        }}>
        {renderHeader()}
      </View>
      {renderImage()}
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 20,
        }}>
        {renderName()}
        {renderPrice()}
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 20,
        }}>
        {renderQty()}
        {renderButtonAdd()}
      </View>
      <View
        style={{
          marginTop: 20,
        }}>
        {renderProductModifiers()}
      </View>
    </ScrollView>
  );
};

export default ProductDetail;
