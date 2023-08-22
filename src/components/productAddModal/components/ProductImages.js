/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useEffect, useState, useRef} from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';

import Swiper from 'react-native-swiper';

import {isEmptyArray} from '../../../helper/CheckEmpty';
import Theme from '../../../theme';
import {useSelector} from 'react-redux';
import ImageZoomModal from '../../modal/ImageZoomModal';

const WIDTH = Dimensions.get('window').width;

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
    viewImagePreviewList: {
      width: '100%',
    },
    viewImagePreviewItem: {
      height: 54,
      width: 54,
      marginRight: 16,
      marginTop: 18,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: theme.colors.greyScale2,
    },
    viewImagePreviewItemSelected: {
      height: 54,
      width: 54,
      marginRight: 16,
      marginTop: 18,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: theme.colors.brandPrimary,
    },
    viewImageMultipleItem: {
      height: WIDTH - 32,
      width: WIDTH - 32,
    },
    viewImageMultiple: {
      height: WIDTH - 32,
      width: '100%',
    },
    viewSwiper: {
      height: WIDTH - 32,
    },
    image: {
      width: '100%',
      maxWidth: '100%',
      height: undefined,
      aspectRatio: 1,
    },
  });
  return result;
};

const ProductImages = ({product}) => {
  const styles = useStyle();
  const imagePreviewRef = useRef();
  const imageRef = useRef();
  const [selected, setSelected] = useState('');
  const [selectedIndex, setSelectedIndex] = useState('');
  const [isOpenImageZoom, setIsOpenImageZoom] = useState(false);
  const [isMultiple, setIsMultiple] = useState(false);

  const imageSettings = useSelector(
    state => state.settingReducer.imageSettings,
  );

  useEffect(() => {
    const isMultipleImage = !isEmptyArray(product?.imageFiles);
    if (isMultipleImage) {
      setIsMultiple(true);
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

  const renderImagePreviewItem = (item, index) => {
    const isSelected = index === selectedIndex;
    const styleButton = isSelected
      ? styles.viewImagePreviewItemSelected
      : styles.viewImagePreviewItem;

    return (
      <TouchableOpacity
        onPress={() => {
          setSelected(item);
          setSelectedIndex(index);
          imageRef.current.scrollTo(index);
        }}>
        <Image source={{uri: item}} style={styleButton} />
      </TouchableOpacity>
    );
  };

  const renderImagePreviewList = () => {
    const isImageList = !isEmptyArray(product?.imageFiles);
    if (isImageList) {
      return (
        <FlatList
          style={styles.viewImagePreviewList}
          data={product?.imageFiles}
          ref={imagePreviewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => renderImagePreviewItem(item, index)}
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

  const renderImageMultipleValue = () => {
    const result = product?.imageFiles?.map(image => {
      return (
        <TouchableOpacity onPress={handleOpenImageZoom} key={image}>
          <Image
            style={styles.viewImageMultipleItem}
            resizeMode="stretch"
            source={{uri: image}}
          />
        </TouchableOpacity>
      );
    });

    return result;
  };

  const renderImageMultiple = () => {
    return (
      <Swiper
        ref={imageRef}
        onIndexChanged={index => {
          setSelectedIndex(index);
          imagePreviewRef.current.scrollToIndex({
            animation: true,
            index: index,
          });
        }}
        showsPagination={false}
        style={styles.viewSwiper}
        loop={false}>
        {renderImageMultipleValue()}
      </Swiper>
    );
  };

  const renderImageSingle = () => {
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

  const renderImage = () => {
    if (isMultiple) {
      return renderImageMultiple();
    } else {
      return renderImageSingle();
    }
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
          index={selectedIndex}
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
      {renderImagePreviewList()}
      {renderImageZoomModal()}
    </View>
  );
};

export default ProductImages;
