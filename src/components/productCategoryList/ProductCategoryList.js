/* eslint-disable react-hooks/exhaustive-deps */
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

import ProductCategorySmallItem from './components/ProductCategorySmallItem';
import ProductCategoryLargeItem from './components/ProductCategoryLargeItem';

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
      justifyContent: 'space-between',
      width: WIDTH,
      paddingHorizontal: 16,
    },
    viewMoreCategories: {
      elevation: 2,
      padding: 8,
      width: 120,
      height: 160,
      borderRadius: 8,
      marginVertical: 8,
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      backgroundColor: 'white',
    },
    imageMoreCategories: {
      width: 86,
      height: 86,
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

const ProductCategoryList = ({
  categories,
  selectedCategory,
  onCLick,
  horizontal,
  itemSize,
  isScroll,
  isIndicator,
  isMoreCategoryButton,
}) => {
  const styles = useStyles();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [activeGroupEGift, setActiveGroupEGift] = useState(0);
  const [groupCategories, setGroupCategories] = useState([]);

  const handleGroupCategories = values => {
    let parents = [];
    let children = [];

    const formatted = [...values];

    if (isMoreCategoryButton) {
      formatted.push({
        id: 'moreCategories',
        name: 'More Categories',
      });
    }

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
    if (onCLick) {
      onCLick(item);
    }
  };

  const renderDot = () => {
    const dots = groupCategories?.map((_, index) => {
      return <View key={index} style={handleStyleDot(index)} />;
    });

    if (isIndicator) {
      return <View style={styles.WrapDot}>{dots}</View>;
    }
  };

  const renderProductCategoryItem = item => {
    switch (itemSize) {
      case 'large':
        return (
          <ProductCategoryLargeItem
            category={item}
            selected={selectedCategory}
            onPress={() => {
              handleSelectCategory(item);
            }}
          />
        );

      case 'small':
        return (
          <ProductCategorySmallItem
            category={item}
            selected={selectedCategory}
            onPress={() => {
              handleSelectCategory(item);
            }}
          />
        );

      default:
        return (
          <ProductCategoryLargeItem
            category={item}
            selected={selectedCategory}
            onPress={() => {
              handleSelectCategory(item);
            }}
          />
        );
    }
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

  const renderCategoriesValue = item => {
    if (item.id === 'moreCategories') {
      return renderMoreCategories();
    } else {
      return renderProductCategoryItem(item);
    }
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
        horizontal={horizontal}>
        {result}
      </ScrollView>
    );
  };

  const renderCategories = () => {
    const result = categories?.map(item => {
      return renderCategoriesValue(item);
    });

    if (isScroll) {
      return <ScrollView>{result}</ScrollView>;
    } else {
      return <View style={styles.viewGroupCategories}>{result}</View>;
    }
  };

  const renderList = () => {
    if (horizontal) {
      return renderGroupCategories();
    } else {
      return renderCategories();
    }
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
      {renderList()}
      {renderDot()}
      {renderMoreCategoryListModal()}
    </View>
  );
};

export default ProductCategoryList;
