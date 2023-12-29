/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {FlatList, StyleSheet, View, BackHandler, Text} from 'react-native';
import colorConfig from '../../config/colorConfig';
import {Actions} from 'react-native-router-flux';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {getAllCategory, isParentCategory} from '../../actions/order.action';
import CategoryCard from './CategoryCard';
import {navigate} from '../../utils/navigation.utils';

class CategoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories2: [],
      categories: [],
      selectedCategory: this.props.selectedCategory,
      loading: true,
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
  }

  loadCategory = async () => {
    try {
      const response = await this.props.dispatch(getAllCategory(0, 10, null));
      if (response !== false) {
        response.data.unshift({
          name: 'See All',
          type: 'all',
        });
        await this.setState({
          categories: response.data,
        });
      }
    } catch (e) {}
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

  updateCategory = async (categoryDetail, index) => {
    try {
      let {outlet} = this.props;
      if (categoryDetail.type === 'all') {
        navigate('menuCategory');
      } else {
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
      }
    } catch (e) {}
  };

  render() {
    let {categories} = this.state;
    let {productPlaceholder} = this.props;
    return (
      <>
        <View style={styles.container}>
          <Text style={[styles.titleCategory]}>Categories</Text>
          <FlatList
            style={{marginLeft: 2}}
            data={categories}
            horizontal={true}
            renderItem={(item, index) => {
              return (
                <CategoryCard
                  key={index}
                  item={item}
                  productPlaceholder={productPlaceholder}
                  onPress={() => this.updateCategory(item.item, item.index)}
                />
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </>
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
)(CategoryList);

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    backgroundColor: 'white',
    paddingBottom: 15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleCategory: {
    color: colorConfig.store.title,
    fontSize: 20,
    textAlign: 'left',
    fontFamily: 'Poppins-Medium',
    padding: 14,
    // marginBottom: 15,
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
    marginLeft: '25%',
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
