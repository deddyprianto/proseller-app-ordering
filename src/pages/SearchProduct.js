/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {ScrollView} from 'react-native-gesture-handler';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';

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

import Theme from '../theme';
import ProductCategoryList from '../components/productCategoryList';
import {
  setSearchProductHistory,
  clearSearchProductHistory,
} from '../actions/search.action';
import ProductSubCategoryList from '../components/productSubCategoryList';
import SearchSuggestionList from '../components/searchSuggestionList/SearchSuggestionList';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    header: {
      height: 140,
    },
    body: {
      flex: 1,
      marginTop: 10,
      width: '100%',
      paddingHorizontal: 16,
    },
    footer: {
      elevation: 5,
      position: 'absolute',
      bottom: 10,
      width: '100%',
      paddingHorizontal: 16,
    },
    textBody: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    textButtonCart: {
      fontWeight: 'bold',
      fontSize: 11,
      color: 'white',
    },
    viewTextAndSearch: {
      paddingHorizontal: 16,
      width: '100%',
    },
    viewBodyText: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16,
      marginBottom: 16,
    },
    viewProductList: {
      paddingHorizontal: 16,
      flex: 1,
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
    icon: {
      width: 18,
      height: 18,
      marginRight: 7,
      color: theme.colors.text4,
    },
  });
  return styles;
};

const SearchProduct = ({category}) => {
  const theme = Theme();
  const styles = useStyles();
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchTextInput, setSearchTextInput] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState({});
  const [selectedSubCategory, setSelectedSubCategory] = useState({});
  const [productsSearch, setProductsSearch] = useState([]);

  const categories = useSelector(
    state => state.productReducer.productCategories,
  );

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
    setSelectedCategory(category);
  }, [category]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const subCategories = await dispatch(
        getProductSubCategories({
          outletId: defaultOutlet.id,
          categoryId: selectedCategory.id,
          searchQuery,
        }),
      );

      if (!isEmptyArray(subCategories)) {
        setSelectedSubCategory(subCategories[0]);
      }

      setIsLoading(false);
    };

    if (selectedCategory?.id) {
      loadData();
    }
  }, [dispatch, defaultOutlet, selectedCategory, searchQuery]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await dispatch(
        getProductBySubCategory({
          outletId: defaultOutlet.id,
          subCategoryId: selectedSubCategory.id,
          searchQuery,
        }),
      );
      setIsLoading(false);
    };

    if (selectedSubCategory?.id) {
      loadData();
    }
  }, [dispatch, defaultOutlet, selectedSubCategory, searchQuery]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const response = await dispatch(
        getProductBySearch({
          outletId: defaultOutlet.sortKey,
          search: searchQuery,
        }),
      );

      setProductsSearch(response);

      setIsLoading(false);
    };

    if (searchQuery && !selectedCategory?.id) {
      loadData();
    }
  }, [dispatch, defaultOutlet, searchQuery, selectedCategory]);

  const handleSearchProduct = async value => {
    setSelectedCategory({});
    setSelectedSubCategory({});
    setSearchTextInput('');
    setSearchQuery(value);
    await dispatch(setSearchProductHistory({searchQuery: value}));
  };

  const handleSearchProductWithCategory = async value => {
    setSearchTextInput('');
    setSearchQuery(value);
    await dispatch(setSearchProductHistory({searchQuery: value}));
  };

  const handleClearSearchHistory = async value => {
    await dispatch(clearSearchProductHistory());
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
            <Image source={appConfig.iconCart} style={styles.icon} />
            <Text style={styles.textButtonCart}>
              {basket?.details?.length} Items in Cart
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
          style={{
            marginLeft: 16,
            color: theme.colors.buttonActive,
            fontSize: theme.fontSize[14],
            fontFamily: theme.fontFamily.poppinsMedium,
          }}>
          Clear
        </Text>
      );
    } else {
      return (
        <Text
          onPress={() => {
            Actions.pop();
          }}
          style={{
            marginLeft: 16,
            color: theme.colors.buttonActive,
            fontSize: theme.fontSize[14],
            fontFamily: theme.fontFamily.poppinsMedium,
          }}>
          Cancel
        </Text>
      );
    }
  };

  const renderHeaderSearch = () => {
    return (
      <View
        style={{
          width: '100%',
          elevation: 3,
          paddingHorizontal: 16,
          paddingVertical: 8,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme.colors.background,
        }}>
        <FieldSearch
          value={searchTextInput}
          onChange={value => {
            setSearchTextInput(value);
          }}
          placeholder="Try to search “toast”"
          onSubmit={value => {
            handleSearchProduct(value);
          }}
        />
        {renderCancelOrClear()}
      </View>
    );
  };

  const renderRecentSearchHeader = () => {
    if (!isEmptyArray(searchProductHistory)) {
      return (
        <View
          style={{
            width: '100%',
            paddingHorizontal: 16,
            paddingVertical: 8,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.colors.greyScale4,
          }}>
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontSize: theme.fontSize[16],
              fontFamily: theme.fontFamily.poppinsMedium,
            }}>
            Recent Search
          </Text>
          <Text
            onPress={() => {
              handleClearSearchHistory();
            }}
            style={{
              color: theme.colors.buttonActive,
              fontSize: theme.fontSize[14],
              fontFamily: theme.fontFamily.poppinsMedium,
            }}>
            Clear Recent
          </Text>
        </View>
      );
    }
  };

  const renderRecentSearchItem = value => {
    return (
      <Text
        style={{
          marginVertical: 8,
          marginHorizontal: 16,
          color: theme.colors.textPrimary,
          fontSize: theme.fontSize[14],
          fontFamily: theme.fontFamily.poppinsMedium,
        }}
        onPress={() => {
          handleSearchProduct(value);
        }}>
        {value}
      </Text>
    );
  };

  const renderRecentSearchList = () => {
    const history = searchProductHistory?.map(value => {
      return renderRecentSearchItem(value);
    });
    return <View>{history}</View>;
  };

  const renderSearchByCategory = () => {
    return (
      <View>
        <View
          style={{
            width: '100%',
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: theme.colors.greyScale4,
          }}>
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontSize: theme.fontSize[16],
              fontFamily: theme.fontFamily.poppinsMedium,
            }}>
            Search by Category
          </Text>
        </View>
        <ProductCategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onCLick={item => {
            setSelectedCategory(item);
          }}
          itemSize={'small'}
        />
      </View>
    );
  };

  const renderDefaultBody = () => {
    return (
      <ScrollView>
        {renderRecentSearchHeader()}
        {renderRecentSearchList()}
        {renderSearchByCategory()}
      </ScrollView>
    );
  };

  const renderProductSearchByQuery = () => {
    return (
      <ProductSearchList
        basket={basket}
        products={productsSearch}
        searchQuery={searchQuery}
      />
    );
  };

  const renderProductSearchByCategory = () => {
    const text =
      selectedCategory?.name && searchQuery
        ? `Search result for “${searchQuery}” in “${
            selectedCategory?.name
          }” category`
        : `Item list for “${selectedCategory?.name}” category`;

    return (
      <View
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          marginTop: 16,
        }}>
        <Text
          style={{
            marginHorizontal: 16,
            marginBottom: 16,
            color: theme.colors.textTertiary,
            fontSize: theme.fontSize[14],
            fontFamily: theme.fontFamily.poppinsMedium,
          }}>
          {text}
        </Text>
        <ProductSubCategoryList
          subCategories={subCategories}
          selectedSubCategory={selectedSubCategory}
          onChange={item => {
            setSelectedSubCategory(item);
          }}
        />
        <ProductList products={productsBySubCategory} basket={basket} />
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
    <View style={styles.root}>
      <LoadingScreen loading={isLoading} />
      {renderHeaderSearch()}
      {renderBody()}
      <View style={styles.footer}>{renderButtonCart()}</View>
    </View>
  );
};

export default SearchProduct;
