/* eslint-disable react-hooks/exhaustive-deps */
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
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';

import {isEmptyArray} from '../../../helper/CheckEmpty';
import Theme from '../../../theme';
import {useSelector} from 'react-redux';
import ImageZoomModal from '../../modal/ImageZoomModal';

const useStyle = () => {
  const theme = Theme();
  const result = StyleSheet.create({
    textIndex: {
      position: 'absolute',
      right: 16,
      bottom: 16,
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewImageList: {
      width: '100%',
    },
    viewImageItem: {
      height: 54,
      width: 54,
      marginRight: 16,
      marginTop: 18,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: theme.colors.greyScale2,
    },
    viewImageItemSelected: {
      height: 54,
      width: 54,
      marginRight: 16,
      marginTop: 18,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: theme.colors.brandPrimary,
    },
    image: {
      width: '100%',
      maxWidth: '100%',
      height: undefined,
      aspectRatio: 1 / 1,
    },
  });
  return result;
};

const ProductImages = ({product}) => {
  const styles = useStyle();
  const [selected, setSelected] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpenImageZoom, setIsOpenImageZoom] = useState(false);

  const imageSettings = useSelector(
    state => state.settingReducer.imageSettings,
  );

  useEffect(() => {
    const isMultipleImage = !isEmptyArray(product?.imageFiles);
    if (isMultipleImage) {
      setSelected(product?.imageFiles[0]);
      setSelectedIndex(0);
    }
  }, [product]);

  const handleOpenImageZoom = () => {
    setIsOpenImageZoom(true);
  };

  const handleCloseImageZoom = () => {
    setIsOpenImageZoom(false);
  };

  const handleImageSelected = () => {
    if (selected) {
      return selected;
    } else if (product?.defaultImageURL) {
      return product?.defaultImageURL;
    } else {
      return imageSettings.productPlaceholderImage;
    }
  };

  const handleImage = () => {
    if (!isEmptyArray(product?.imageFiles)) {
      return product?.imageFiles;
    } else if (product?.defaultImageURL) {
      return product?.defaultImageURL;
    } else {
      return imageSettings.productPlaceholderImage;
    }
  };

  const renderImageItem = (item, index) => {
    const isSelected = item === selected;
    const styleButton = isSelected
      ? styles.viewImageItemSelected
      : styles.viewImageItem;

    return (
      <TouchableOpacity
        onPress={() => {
          setSelected(item);
          setSelectedIndex(index);
        }}>
        <Image source={{uri: item}} style={styleButton} />
      </TouchableOpacity>
    );
  };

  const renderImageList = () => {
    const isImageList = !isEmptyArray(product?.imageFiles);
    if (isImageList) {
      return (
        <FlatList
          style={styles.viewImageList}
          data={product?.imageFiles}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => renderImageItem(item, index)}
        />
      );
    }
  };

  const renderTextIndex = () => {
    const isMultipleImage = !isEmptyArray(product?.imageFiles);
    if (isMultipleImage) {
      const choose = selectedIndex + 1;
      const imagesQty = product?.imageFiles?.length;
      return (
        <Text style={styles.textIndex}>
          {choose}/{imagesQty}
        </Text>
      );
    }
  };

  const renderImage = () => {
    const image = handleImageSelected();

    return (
      <TouchableOpacity onPress={handleOpenImageZoom}>
        <Image
          style={styles.image}
          resizeMode="stretch"
          source={{uri: image}}
        />
      </TouchableOpacity>
    );
  };

  const renderImageAndIndex = () => {
    return (
      <View>
        {renderImage()}
        {renderTextIndex()}
      </View>
    );
  };

  const renderImageZoomModal = () => {
    const image = handleImage();

    if (isOpenImageZoom) {
      return (
        <ImageZoomModal
          images={image}
          open={isOpenImageZoom}
          handleClose={() => {
            handleCloseImageZoom();
          }}
        />
      );
    }
  };

  return (
    <View>
      {renderImageAndIndex()}
      {renderImageList()}
      {renderImageZoomModal()}
    </View>
  );
};

export default ProductImages;
