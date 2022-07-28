import React, {useEffect, useState} from 'react';
import {Actions} from 'react-native-router-flux';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import colorConfig from '../config/colorConfig';
import {useDispatch, useSelector} from 'react-redux';
import {getGiftCardCategories} from '../actions/gift.action';
import LoadingScreen from '../components/loadingScreen';
import {isEmptyArray} from '../helper/CheckEmpty';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    marginTop: HEIGHT * 0.01,
    marginBottom: HEIGHT * 0.01,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  viewImage: {
    height: HEIGHT * 0.22,
    width: WIDTH * 0.85,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
  viewHeader: {
    width: WIDTH,
    display: 'flex',
    alignItems: 'center',
  },
  viewBody: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,

    width: WIDTH * 0.35,
    height: HEIGHT * 0.035,
    backgroundColor: colorConfig.fifthColor,
  },
  textTitle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  textDescription: {
    color: 'black',
    textAlign: 'center',
    fontSize: 12,
    width: WIDTH * 0.6,
    letterSpacing: 0.2,
    marginTop: 30,
    marginBottom: 20,
  },
});

const EGift = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const giftCardCategories = useSelector(
    state => state.giftReducer.giftCardCategories.categories,
  );

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await dispatch(getGiftCardCategories());
      setIsLoading(false);
    };
    loadData();
  }, [dispatch]);

  const renderCategories = () => {
    const result = giftCardCategories?.map((category, index) => {
      return (
        <TouchableOpacity
          style={styles.viewImage}
          disabled={isEmptyArray(giftCardCategories)}
          onPress={() => {
            Actions.sendEGift({categoryId: category.id});
          }}>
          <Image
            key={index}
            style={styles.image}
            resizeMode="contain"
            source={{uri: category.image}}
          />
        </TouchableOpacity>
      );
    });
    return result;
  };

  return (
    <ScrollView style={styles.container}>
      <LoadingScreen loading={isLoading} />
      <View style={styles.viewHeader}>
        <View style={styles.viewTitle}>
          <Text style={styles.textTitle}>Send A Gift</Text>
        </View>
        <Text style={styles.textDescription}>
          Send a gift to your love ones or friends with a custom design voucher
        </Text>
      </View>
      <View style={styles.viewBody}>{renderCategories()}</View>
    </ScrollView>
  );
};

export default EGift;
