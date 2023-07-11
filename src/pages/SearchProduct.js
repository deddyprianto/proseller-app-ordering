/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {ScrollView} from 'react-native-gesture-handler';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import Io from 'react-native-vector-icons/MaterialCommunityIcons';
import FieldSearch from '../components/fieldSearch';
import ProductList from '../components/productList';
import LoadingScreen from '../components/loadingScreen';
import ProductSearchList from '../components/productSearchList';

import {
  getProductBySearch,
  getProductBySubCategory,
  getProductSubCategories,
} from '../actions/product.action';

import {isEmptyArray, isEmptyObject} from '../helper/CheckEmpty';
import CurrencyFormatter from '../helper/CurrencyFormatter';

import appConfig from '../config/appConfig';

import ProductCategoryList from '../components/productCategoryList';
import {
  setSearchProductHistory,
  clearSearchProductHistory,
} from '../actions/search.action';
import ProductSubCategoryList from '../components/productSubCategoryList';
import SearchSuggestionList from '../components/searchSuggestionList/SearchSuggestionList';

import Theme from '../theme';
import AnimationMessage from '../components/animationMessage';
import {normalizeLayoutSizeHeight} from '../helper/Layout';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    footer: {
      elevation: 5,
      position: 'absolute',
      bottom: normalizeLayoutSizeHeight(50),
      width: '100%',
      paddingHorizontal: 16,
    },
    textButtonCart: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textProductSearchByCategory: {
      marginHorizontal: 16,
      marginBottom: 16,
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textCategoryListHeader: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textRecentSearchItem: {
      marginVertical: 8,
      marginHorizontal: 16,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textCancel: {
      marginLeft: 16,
      color: theme.colors.buttonActive,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textClear: {
      marginLeft: 16,
      color: theme.colors.buttonActive,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textRecentSearchHeader: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textClearRecent: {
      color: theme.colors.buttonActive,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textEmpty: {
      marginTop: 16,
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    viewEmpty: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    viewButtonCart: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      padding: 14,
      justifyContent: 'space-between',
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
    },
    viewIconAndTextCart: {
      display: 'flex',
      flexDirection: 'row',
    },
    viewHeader: {
      width: '100%',
      elevation: 3,
      paddingHorizontal: 16,
      paddingVertical: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.background,
    },
    viewRecentSearchHeader: {
      width: '100%',
      paddingHorizontal: 16,
      paddingVertical: 8,
      display: 'flex',
      flexDirection: 'row',
      // alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.greyScale4,
    },
    viewProductSearchByCategory: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      marginTop: 16,
    },
    viewCategoryListHeader: {
      width: '100%',
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.colors.greyScale4,
    },
    iconCart: {
      width: 18,
      height: 18,
      marginRight: 7,
      color: theme.colors.text4,
    },
    iconEmpty: {
      width: 100,
      height: 100,
      tintColor: theme.colors.textTertiary,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    errorText: {
      color: 'white',
    },
    rowDirection: {
      flexDirection: 'row',
    },
    centerAlign: {
      alignItems: 'center',
    },
    errorIcon: {
      marginRight: 5,
    },
  });
  return styles;
};

const SearchProduct = ({category}) => {
  const ref = useRef();
  const styles = useStyles();
  const dispatch = useDispatch();
  const [basketLength, setBasketLength] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchTextInput, setSearchTextInput] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState({});
  const [selectedSubCategory, setSelectedSubCategory] = useState({});
  const [productsSearch, setProductsSearch] = useState([]);
  const [isErrorSearch, setIsErrorSearch] = useState(false);
  const categories =
    useSelector(state => state.productReducer?.productsOutlet?.data) || [];

  const subCategories = useSelector(
    state => state.productReducer.productSubCategories,
  );

  const productsBySubCategory = useSelector(
    state => state.productReducer.productsBySubCategory,
  );

  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );
  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);
  const searchProductHistory = useSelector(
    state => state.searchReducer?.searchProductHistory,
  );

  useEffect(() => {
    let length = 0;
    if (basket && basket.details) {
      basket.details.forEach(cart => {
        length += cart.quantity;
      });
    }
    setBasketLength(length);
  }, [basket]);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  const getBySubCategory = async id => {
    await dispatch(
      getProductBySubCategory({
        outletId: defaultOutlet.id,
        subCategoryId: id,
        searchQuery,
      }),
    );
  };

  const getSubCategories = async id => {
    const response = await dispatch(
      getProductSubCategories({
        outletId: defaultOutlet.id,
        categoryId: id,
        searchQuery,
      }),
    );
    if (!isEmptyArray(response)) {
      setSelectedSubCategory(response[0]);
      getBySubCategory(response[0]?.id);
    }
  };

  const getCategoryProduct = async id => {
    setIsLoading(true);
    await getBySubCategory(id);
    await getSubCategories(id);
    setTimeout(() => {
      setIsLoading(false);
    }, 350);
  };

  const handleSearchMoreProducts = async () => {
    setIsLoading(true);
    const products = productsSearch;
    const skip = products.length;

    const response = await dispatch(
      getProductBySearch({
        outletId: defaultOutlet.sortKey,
        search: searchQuery,
        skip: skip,
      }),
    );

    const result = products.concat(response);
    setProductsSearch(result);
    setIsLoading(false);
  };

  const getSearchProduct = async value => {
    setIsLoading(true);
    const response = await dispatch(
      getProductBySearch({
        outletId: defaultOutlet.sortKey,
        search: value,
        skip: 0,
      }),
    );

    setProductsSearch(response);
    ref.current.scrollTo(0);
    setIsLoading(false);
  };

  const handleSearchProduct = async value => {
    if (value.length >= 2) {
      setSelectedCategory({});
      setSelectedSubCategory({});
      setSearchTextInput('');
      setSearchQuery(value);
      getSearchProduct(value);
      await dispatch(setSearchProductHistory({searchQuery: value}));
    } else {
      setIsErrorSearch(true);
    }
  };

  const handleSearchProductWithCategory = async value => {
    setSearchTextInput('');
    setSearchQuery(value);
    await dispatch(setSearchProductHistory({searchQuery: value}));
  };

  const handleClearSearchHistory = async () => {
    dispatch(clearSearchProductHistory());
  };

  const handlePressSubCategry = item => {
    setSelectedSubCategory(item);
    getBySubCategory(item.id);
  };

  const renderButtonCart = () => {
    if (!isEmptyArray(basket?.details)) {
      return (
        <TouchableOpacity
          style={styles.viewButtonCart}
          onPress={() => {
            Actions.cart();
          }}>
          <View style={styles.viewIconAndTextCart}>
            <Image source={appConfig.iconCart} style={styles.iconCart} />
            <Text style={styles.textButtonCart}>
              {basketLength} Items in Cart
            </Text>
          </View>
          <Text style={styles.textButtonCart}>
            {CurrencyFormatter(basket?.totalNettAmount)}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  const renderCancelOrClear = () => {
    if (searchQuery || selectedCategory?.id) {
      return (
        <Text
          onPress={() => {
            setSelectedCategory({});
            setSearchQuery('');
            setSearchTextInput('');
          }}
          style={styles.textClear}>
          Clear
        </Text>
      );
    } else {
      return (
        <Text
          onPress={() => {
            Actions.pop();
          }}
          style={styles.textCancel}>
          Cancel
        </Text>
      );
    }
  };

  const renderHeaderSearch = () => {
    return (
      <>
        <View style={styles.viewHeader}>
          <View style={styles.searchContainer}>
            <FieldSearch
              value={searchTextInput}
              onChange={value => {
                setSearchTextInput(value);
              }}
              placeholder="Try to search anything"
              onSubmit={value => {
                handleSearchProduct(value);
              }}
            />
            {renderCancelOrClear()}
          </View>
          <AnimationMessage
            containerStyle={{bottom: -45}}
            show={isErrorSearch}
            setShow={setIsErrorSearch}>
            <View style={[styles.rowDirection, styles.centerAlign]}>
              <Io
                style={styles.errorIcon}
                name="alert-circle-outline"
                size={26}
                color="white"
              />
              <Text style={styles.errorText}>
                Input minimal 2 characters to search.
              </Text>
            </View>
          </AnimationMessage>
        </View>
      </>
    );
  };

  const renderRecentSearchHeader = () => {
    if (!isEmptyArray(searchProductHistory)) {
      return (
        <View style={styles.viewRecentSearchHeader}>
          <View>
            <Text style={styles.textRecentSearchHeader}>Recent Search</Text>
          </View>
          <TouchableOpacity onPress={handleClearSearchHistory}>
            <Text style={styles.textClearRecent}>Clear Recent</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderRecentSearchItem = value => {
    return (
      <Text
        style={styles.textRecentSearchItem}
        onPress={() => {
          handleSearchProduct(value);
        }}>
        {value}
      </Text>
    );
  };

  const renderRecentSearchList = () => {
    if (!isEmptyArray(searchProductHistory)) {
      const history = searchProductHistory?.map((value, index) => {
        if (index < 3) {
          return renderRecentSearchItem(value);
        }
      });
      return (
        <View>
          {renderRecentSearchHeader()}
          {history}
        </View>
      );
    }
  };

  const onSelectCategory = item => {
    const newId = item?.categoryID.replace('category::', '');
    setSelectedCategory(item);
    getCategoryProduct(newId);
  };

  const renderCategoryList = () => {
    return (
      <View>
        <View style={styles.viewCategoryListHeader}>
          <Text style={styles.textCategoryListHeader}>Search by Category</Text>
        </View>
        <ProductCategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onClick={onSelectCategory}
          itemSize={'small'}
        />
      </View>
    );
  };

  const renderDefaultBody = () => {
    return (
      <ScrollView>
        {renderRecentSearchList()}
        {renderCategoryList()}
      </ScrollView>
    );
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const renderProductSearchByQuery = () => {
    return (
      <ScrollView
        ref={ref}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            handleSearchMoreProducts();
          }
        }}
        scrollEventThrottle={400}>
        <ProductSearchList
          basket={basket}
          products={productsSearch}
          searchQuery={searchQuery}
          isLoading={isLoading}
        />
      </ScrollView>
    );
  };

  const renderProductSearchByCategoryBody = () => {
    if (!isLoading) {
      if (isEmptyArray(subCategories) && isEmptyArray(productsBySubCategory)) {
        return (
          <View style={styles.viewEmpty}>
            <Image
              source={appConfig.iconInformation}
              style={styles.iconEmpty}
            />
            <Text style={styles.textEmpty}>
              Item can’t be found. Please try another keyword.
            </Text>
          </View>
        );
      }
      return (
        <>
          <ProductSubCategoryList
            subCategories={subCategories}
            selectedSubCategory={selectedSubCategory}
            onChange={handlePressSubCategry}
          />
          <ScrollView>
            <ProductList products={productsBySubCategory} basket={basket} />
          </ScrollView>
        </>
      );
    }
    return null;
  };

  const renderProductSearchByCategory = () => {
    const text =
      selectedCategory?.name && searchQuery
        ? `Search result for “${searchQuery}” in “${
            selectedCategory?.name
          }” category`
        : `Item list for “${selectedCategory?.name}” category`;
    if (isLoading) return null;

    return (
      <View style={styles.viewProductSearchByCategory}>
        <Text numberOfLines={1} style={styles.textProductSearchByCategory}>
          {text}
        </Text>
        {renderProductSearchByCategoryBody()}
      </View>
    );
  };

  const renderSearchSuggestions = () => {
    const suggestions = [
      {
        name: selectedCategory?.name,
        onClick: () => {
          handleSearchProductWithCategory(searchTextInput);
        },
      },
      {
        name: 'all category',
        onClick: () => {
          handleSearchProduct(searchTextInput);
        },
      },
    ];

    return (
      <SearchSuggestionList
        searchText={searchTextInput}
        suggestions={suggestions}
      />
    );
  };

  const renderBody = () => {
    const isSelectedCategory = !isEmptyObject(selectedCategory);
    if (searchQuery && !isSelectedCategory) {
      return renderProductSearchByQuery();
    } else if (isSelectedCategory && searchTextInput) {
      return renderSearchSuggestions();
    } else if (isSelectedCategory) {
      return renderProductSearchByCategory();
    } else {
      return renderDefaultBody();
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <LoadingScreen loading={isLoading} />
      {renderHeaderSearch()}
      {renderBody()}
      <View style={styles.footer}>{renderButtonCart()}</View>
    </SafeAreaView>
  );
};

export default SearchProduct;
