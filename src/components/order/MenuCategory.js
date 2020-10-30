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
import {isEmptyArray} from '../../helper/CheckEmpty';
import Icon from 'react-native-vector-icons/Ionicons';
import colorConfig from '../../config/colorConfig';
import {Actions} from 'react-native-router-flux';
import GridItem from './GridItem';
import LoaderDarker from '../LoaderDarker';
import Loader from '../loader';

export default class MenuCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
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
    try {
      setTimeout(() => {
        this.setState({products: this.props.products, loading: false});
      }, 2500);
    } catch (e) {}
  }

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
    let {products, selectedCategory} = this.state;
    if (key == '' || key == null) {
      this.setState({products: this.props.products});
    }

    try {
      let list = JSON.stringify(this.props.products);
      list = JSON.parse(list);
      if (!isEmptyArray(this.props.products)) {
        list = list.filter(item =>
          item.name.toLowerCase().includes(key.toLowerCase()),
        );

        this.setState({products: list});
      }
    } catch (e) {}
  };

  updateCategory = (item, index) => {
    try {
      const {products} = this.props;
      index = products.findIndex(data => data.id == item.id);
      this.props.updateCategory(item, index);
      this.goBack();
    } catch (e) {}
  };

  render() {
    let {products, selectedCategory} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading && <Loader />}
        <View style={styles.container}>
          <View
            style={[
              styles.header,
              {backgroundColor: colorConfig.pageIndex.backgroundColor},
            ]}>
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
              <Text style={styles.btnBackText}> Categories </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            onChangeText={search => this.search(search)}
            placeholder="Search"
            style={styles.searchBar}
          />
          <FlatList
            style={{marginLeft: 2}}
            data={products}
            numColumns={3}
            renderItem={(item, index) => {
              return (
                <GridItem
                  key={index}
                  item={item}
                  onPress={() => this.updateCategory(item.item, item.index)}
                />
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 65,
    marginBottom: 20,
    justifyContent: 'center',
    // backgroundColor: colorConfig.store.defaultColor,
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
    color: colorConfig.store.defaultColor,
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
    color: colorConfig.store.defaultColor,
    fontWeight: 'bold',
    fontSize: 17,
  },
  searchBar: {
    backgroundColor: colorConfig.store.transparentBG,
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
