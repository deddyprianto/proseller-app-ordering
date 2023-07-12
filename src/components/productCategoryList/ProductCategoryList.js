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
      width: WIDTH,
      paddingHorizontal: 16,
      paddingBottom: 5,
    },
    viewGroupCategoriesSmall: {
      flex: 1,
      flexWrap: 'wrap',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: WIDTH,
      paddingHorizontal: 16,
      paddingBottom: 1,
    },
    viewMoreCategories: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      padding: 8,
      flex: 1,
      width: ((WIDTH - 32) * 30) / 100,
      minWidth: ((WIDTH - 32) * 30) / 100,
      maxWidth: ((WIDTH - 32) * 30) / 100,
      marginHorizontal: ((WIDTH - 32) * 1.6) / 100,
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
      tintColor: theme.colors.buttonActive,
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
    marginBottom: {
      marginBottom: 30,
    },
  });
  return styles;
};

const ProductCategoryList = ({
  categories,
  selectedCategory,
  onClick,
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

  useEffect(() => {
    if (!isEmptyArray(categories)) {
      let parents = [];
      let children = [];

      const formatted = [...categories];

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
    }
  }, [categories, isMoreCategoryButton]);

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
          resizeMode="contain"
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
      const isItemSizeSmall = itemSize === 'small';
      const styleView = isItemSizeSmall
        ? styles.viewGroupCategoriesSmall
        : styles.viewGroupCategories;

      return (
        <View key={index} style={styleView}>
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
    const isItemSizeSmall = itemSize === 'small';
    const styleView = isItemSizeSmall
      ? styles.viewGroupCategoriesSmall
      : styles.viewGroupCategories;

    const result = categories?.map(item => {
      return renderCategoriesValue(item);
    });

    if (isScroll) {
      return (
        <ScrollView>
          {result}
          <View style={styles.marginBottom} />
        </ScrollView>
      );
    } else {
      return <View style={styleView}>{result}</View>;
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
