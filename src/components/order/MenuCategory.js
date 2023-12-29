/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Platform,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {
  isEmptyArray,
  isEmptyData,
  isEmptyObject,
} from '../../helper/CheckEmpty';
import Icon from 'react-native-vector-icons/Ionicons';
import colorConfig from '../../config/colorConfig';
import {Actions} from 'react-native-router-flux';
import GridItem from './GridItem';
import Loader from '../loader';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {
  getAllCategory,
  getSetting,
  isParentCategory,
} from '../../actions/order.action';
import {dataStores, setDefaultOutlet} from '../../actions/stores.action';
import {navigate} from '../../utils/navigation.utils';

class MenuCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories2: [],
      categories: [],
      selectedCategory: this.props.selectedCategory,
      loading: true,
      productPlaceholder: null,
    };
  }

  goBack = async () => {
    Actions.pop();
  };

  componentDidMount() {
    try {
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackPress,
      );
    } catch (e) {}

    this.loadCategory();
    this.getDefaultOutlet();
  }

  getDefaultOutlet = async () => {
    try {
      let {outlet} = this.props;
      if (isEmptyObject(outlet)) {
        const outlets = await this.props.dispatch(dataStores());
        const find = outlets.find(
          item => item.orderingStatus !== 'UNAVAILABLE',
        );
        if (find !== undefined) {
          await this.props.dispatch(setDefaultOutlet(find));
        }
      }
    } catch (e) {}
  };

  loadCategory = async () => {
    try {
      const productPlaceholder = await this.props.dispatch(
        getSetting('ProductPlaceholder'),
      );
      if (!isEmptyData(productPlaceholder)) {
        await this.setState({productPlaceholder});
      }

      const response = await this.props.dispatch(
        getAllCategory(0, 10, this.props.parentCategoryID || null),
      );

      if (response !== false) {
        let categoriesData = response.data;

        if (this.props.parentCategoryID === undefined) {
          categoriesData = response.data.filter(
            item =>
              item.parentCategoryID === undefined ||
              item.parentCategoryID === null,
          );
        }

        await this.setState({
          categories: categoriesData,
          categories2: response.data,
          loading: false,
        });

        if (response.dataLength > 10) {
          this.loadMoreCategory(response.dataLength);
        }
      }
    } catch (e) {}
    await this.setState({
      loading: false,
    });
  };

  loadMoreCategory = async length => {
    try {
      let skip = 10;
      for (let i = 0; i < Math.floor(length / 10); i++) {
        const response = await this.props.dispatch(
          getAllCategory(skip, 10, this.props.parentCategoryID || null),
        );
        if (response !== false) {
          let categoriesData = response.data;

          if (this.props.parentCategoryID === undefined) {
            categoriesData = response.data.filter(
              item =>
                item.parentCategoryID === undefined ||
                item.parentCategoryID === null,
            );
          }
          let categories = [...this.state.categories, ...categoriesData];
          await this.setState({categories, categories2: categories});
        }
        skip += 10;
      }
    } catch (e) {
      console.log(e);
    }
  };

  componentWillUnmount() {
    try {
      this.backHandler.remove();
    } catch (e) {}
  }

  handleBackPress = () => {
    this.goBack();
    return true;
  };

  search = key => {
    let {categories2, categories, selectedCategory} = this.state;
    if (key == '' || key == null) {
      this.setState({categories: this.state.categories2});
    }

    try {
      let list = JSON.stringify(this.state.categories2);
      list = JSON.parse(list);
      if (!isEmptyArray(this.state.categories2)) {
        list = list.filter(item =>
          item.name.toLowerCase().includes(key.toLowerCase()),
        );

        this.setState({categories: list});
      }
    } catch (e) {}
  };

  updateCategory = async (categoryDetail, index) => {
    try {
      let {outlet} = this.props;
      await this.setState({loading: true});
      const isParent = await this.props.dispatch(
        isParentCategory(categoryDetail.sortKey),
      );

      if (isParent === true) {
        navigate('menuCategory', {
          parentCategoryID: categoryDetail.sortKey,
          categoryName: categoryDetail.name,
        });
      } else {
        navigate('specificCategory', {categoryDetail, item: outlet});
      }
      await this.setState({loading: false});
    } catch (e) {
      await this.setState({loading: false});
    }
  };

  render() {
    let {categories, productPlaceholder} = this.state;
    const {categoryName} = this.props;

    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading && <Loader />}
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
              <Icon
                size={28}
                name={
                  Platform.OS === 'ios'
                    ? 'ios-arrow-back'
                    : 'md-arrow-round-back'
                }
                style={styles.btnBackIcon}
              />
            </TouchableOpacity>
            <Text style={[styles.btnBackText]}>
              {' '}
              {categoryName || 'Categories'}{' '}
            </Text>
          </View>
          {this.props.parentCategoryID === undefined && (
            <TextInput
              onChangeText={search => this.search(search)}
              placeholder="Search"
              style={styles.searchBar}
            />
          )}
          <FlatList
            style={{marginLeft: 2}}
            data={categories}
            numColumns={3}
            renderItem={(item, index) => {
              if (item.item && item.item.name) {
                return (
                  <GridItem
                    key={index}
                    item={item}
                    productPlaceholder={productPlaceholder}
                    onPress={() => this.updateCategory(item.item, item.index)}
                  />
                );
              }
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </SafeAreaView>
    );
  }
}

mapStateToProps = state => ({
  intlData: state.intlData,
  outlet: state.storesReducer.defaultOutlet.defaultOutlet,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(MenuCategory);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorConfig.store.containerColor,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    marginBottom: 20,
    // justifyContent: 'center',
    backgroundColor: colorConfig.store.defaultColor,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  btnBackIcon: {
    marginLeft: 10,
    color: 'white',
    margin: 10,
  },
  btnBack: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // width: 100,
    height: 80,
  },
  btnBackText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 17,
  },
  searchBar: {
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'gray',
    width: '85%',
    alignSelf: 'center',
    marginBottom: 10,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
});
