import React, {Component} from 'react';
import {Text, TouchableOpacity, Platform, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import Icon from 'react-native-vector-icons/Ionicons';
import {navigate} from '../../utils/navigation.utils';

export default class ButtonNavMenu extends Component {
  constructor(props) {
    super(props);
  }

  goToCategorySelection = () => {
    try {
      const {products, selectedCategory, outlet} = this.props;
      navigate('menuCategory', {
        products,
        hideBackButton: this.props.hideBackButton,
        isSpecificPageActive: this.props.isSpecificPageActive,
        refreshPage: this.props.refreshPage,
        outlet: this.props.outlet,
        selectedCategory,
        updateCategory: this.props.updateCategory,
      });
    } catch (e) {}
  };

  goToHome = () => {
    try {
      if (Actions.currentScene != 'productsMode2') {
        Actions.pop();
      }
    } catch (e) {
      Actions.popTo('pageIndex');
    }
  };

  render() {
    return (
      <View
        style={{
          backgroundColor: 'white',
          width: '100%',
          marginTop: 2,
          paddingVertical: 13,
          flexDirection: 'row',
          alignItems: 'center',
          // justifyContent: 'center',
          shadowColor: '#00000021',
          shadowOffset: {
            width: 10,
            height: 10,
          },
          shadowOpacity: 1,
          shadowRadius: 7.49,
          elevation: 12,
        }}>
        <TouchableOpacity
          onPress={this.goToHome}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '48%',
          }}>
          <Icon
            size={27}
            name={Platform.OS === 'ios' ? 'ios-home' : 'md-home'}
            style={{color: colorConfig.store.defaultColor}}
          />
          <Text
            style={{
              fontSize: 15,
              color: colorConfig.store.defaultColor,
              fontFamily: 'Poppins-Medium',
              marginLeft: 10,
            }}>
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.goToCategorySelection}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '48%',
          }}>
          <Icon
            size={27}
            name={Platform.OS === 'ios' ? 'ios-apps' : 'md-apps'}
            style={{color: colorConfig.store.defaultColor}}
          />
          <Text
            style={{
              fontSize: 15,
              color: colorConfig.store.defaultColor,
              fontFamily: 'Poppins-Medium',
              marginLeft: 10,
            }}>
            Categories
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
