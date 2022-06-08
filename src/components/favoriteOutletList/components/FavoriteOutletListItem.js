import React, {useEffect, useState} from 'react';

import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';
import {useDispatch} from 'react-redux';
import {
  setFavoriteOutlet,
  unsetFavoriteOutlet,
} from '../../../actions/stores.action';

const styles = StyleSheet.create({
  root: {
    marginTop: 10,
    marginBottom: 10,
    width: '48%',
  },
  image: {
    width: '100%',
    height: 113,
  },
  iconStar: {
    fontSize: 16,
    color: 'red',
  },
  textName: {
    width: '100%',
    textAlign: 'center',
    marginTop: 8,
  },
  viewStar: {
    backgroundColor: 'white',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 9,
    right: 7,
  },
});

const FavoriteOutletListItem = ({item}) => {
  const dispatch = useDispatch();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(item.isFavorite);
  }, [item]);

  const handleSetFavoriteOutlet = async () => {
    await dispatch(setFavoriteOutlet({outletId: item?.id}));
  };

  const handleUnsetFavoriteOutlet = async () => {
    await dispatch(unsetFavoriteOutlet({outletId: item?.id}));
  };

  const handleStarClicked = () => {
    if (isFavorite) {
      handleUnsetFavoriteOutlet();
      setIsFavorite(false);
    } else {
      handleSetFavoriteOutlet();
      setIsFavorite(true);
    }
  };

  const renderStar = () => {
    const star = isFavorite ? 'star' : 'star-o';

    return (
      <View style={styles.viewStar}>
        <TouchableOpacity
          onPress={() => {
            handleStarClicked();
          }}>
          <IconFontAwesome name={star} style={styles.iconStar} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderImage = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          Actions.favoriteOutletDetail({outlet: item});
        }}>
        <Image style={styles.image} source={{uri: item?.defaultImageURL}} />
      </TouchableOpacity>
    );
  };

  const renderText = () => {
    return <Text style={styles.textName}>{item?.name}</Text>;
  };

  return (
    <View style={styles.root}>
      {renderImage()}
      {renderStar()}
      {renderText()}
    </View>
  );
};

export default FavoriteOutletListItem;
