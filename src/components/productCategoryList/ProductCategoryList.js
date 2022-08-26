import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';

import {useSelector} from 'react-redux';

import ProductCategoryItem from './components/ProductCategoryItem';

import Theme from '../../theme';
import {isEmptyArray} from '../../helper/CheckEmpty';
import appConfig from '../../config/appConfig';
import MoreCategoryListModal from '../moreCategoryListModal';

const WIDTH = Dimensions.get('window').width;

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    textMoreCategories: {
      marginTop: 8,
      textAlign: 'center',
      fontSize: theme.fontSize[12],
      color: theme.colors.textPrimary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewGroupCategories: {
      flex: 1,
      flexWrap: 'wrap',
      display: 'flex',
      flexDirection: 'row',
      width: WIDTH,
      paddingHorizontal: 16,
    },
    viewMoreCategories: {
      elevation: 2,
      padding: 8,
      flex: 1,
      width: (WIDTH * 29) / 100,
      minWidth: (WIDTH * 29) / 100,
      maxWidth: (WIDTH * 29) / 100,
      marginHorizontal: (WIDTH * 0.8) / 100,
      borderRadius: 8,
      marginVertical: 8,
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      backgroundColor: 'white',
    },
    imageMoreCategories: {
      width: '100%',
      maxWidth: '100%',
      height: undefined,
      aspectRatio: 1 / 1,
    },
    WrapDot: {
      flexDirection: 'row',
      alignSelf: 'center',
    },
    activeDot: {
      width: 30,
      height: 10,
      borderRadius: 100,
      margin: 3,
      backgroundColor: theme.colors.buttonActive,
    },
    inactiveDot: {
      width: 10,
      height: 10,
      borderRadius: 100,
      margin: 3,
      backgroundColor: theme.colors.accent,
    },
  });
  return styles;
};

const ProductCategoryList = ({categories, selectedCategory, onClick}) => {
  const styles = useStyles();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [activeGroupEGift, setActiveGroupEGift] = useState(0);
  const [groupCategories, setGroupCategories] = useState([]);

  const handleGroupCategories = values => {
    let parents = [];
    let children = [];

    const formatted = [
      ...values,
      {
        id: 'moreCategories',
        name: 'More Categories',
      },
    ];

    formatted.forEach((value, index) => {
      if (formatted.length - 1 === index) {
        children.push(value);
        parents.push(children);
        return (children = []);
      }

      if (children.length < 5) {
        return children.push(value);
      }

      if (children.length === 5) {
        children.push(value);
        parents.push(children);
        return (children = []);
      }
    });

    setGroupCategories(parents);
  };

  useEffect(() => {
    if (!isEmptyArray(categories)) {
      handleGroupCategories(categories);
    }
  }, [categories]);

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const handleOnChange = nativeEvent => {
    const group = Math.ceil(nativeEvent.contentOffset.x / WIDTH);
    if (group !== activeGroupEGift) {
      setActiveGroupEGift(group);
    }
  };

  const handleStyleDot = index => {
    if (activeGroupEGift === index) {
      return styles.activeDot;
    } else {
      return styles.inactiveDot;
    }
  };

  const handleSelectCategory = item => {
    if (onClick) {
      onClick(item);
    }
  };

  const renderDot = () => {
    const dots = groupCategories?.map((_, index) => {
      return <View key={index} style={handleStyleDot(index)} />;
    });

    return <View style={styles.WrapDot}>{dots}</View>;
  };

  const renderProductCategoryItem = item => {
    return (
      <ProductCategoryItem
        category={item}
        selected={selectedCategory}
        onPress={() => {
          handleSelectCategory(item);
        }}
      />
    );
  };

  const renderMoreCategories = () => {
    return (
      <TouchableOpacity
        style={styles.viewMoreCategories}
        onPress={() => {
          handleOpenModal();
        }}>
        <Image
          source={appConfig.iconMoreMenu}
          resizeMode="center"
          style={styles.imageMoreCategories}
        />
        <Text numberOfLines={2} style={styles.textMoreCategories}>
          More Categories
        </Text>
      </TouchableOpacity>
    );
  };

  const renderGroupCategoriesValue = items => {
    const result = items.map(item => {
      if (item.id === 'moreCategories') {
        return renderMoreCategories();
      } else {
        return renderProductCategoryItem(item);
      }
    });

    return result;
  };

  const renderGroupCategories = () => {
    const result = groupCategories?.map((items, index) => {
      return (
        <View key={index} style={styles.viewGroupCategories}>
          {renderGroupCategoriesValue(items)}
        </View>
      );
    });

    return (
      <ScrollView
        onScroll={({nativeEvent}) => {
          handleOnChange(nativeEvent);
        }}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        horizontal>
        {result}
      </ScrollView>
    );
  };

  const renderMoreCategoryListModal = () => {
    return (
      <MoreCategoryListModal
        open={isOpenModal}
        handleClose={() => {
          handleCloseModal();
        }}
      />
    );
  };

  return (
    <View>
      {renderGroupCategories()}
      {renderDot()}
      {renderMoreCategoryListModal()}
    </View>
  );
};

export default ProductCategoryList;
