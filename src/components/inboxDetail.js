/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {compose} from 'redux';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import {dataInbox} from '../actions/inbox.action';

class InboxDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
    };
  }

  componentDidMount = async () => {
    // console.log(await AsyncStorage.getItem('@inbox' + this.props.dataItem.id));
    // await AsyncStorage.removeItem('@inbox' + this.props.dataItem.id);
  };

  goBack = async () => {
    await this.props.dispatch(dataInbox());
    Actions.pop();
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{backgroundColor: colorConfig.pageIndex.backgroundColor}}>
          <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
            <Icon
              size={28}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
              }
              style={styles.btnBackIcon}
            />
            <Text style={styles.btnBackText}> Back </Text>
          </TouchableOpacity>
          <View style={styles.line} />
        </View>
        <View style={styles.card}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              margin: 10,
              paddingBottom: 10,
              borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
              borderBottomWidth: 1,
            }}>
            <View
              style={{
                height: 70,
                width: 70,
                borderColor: colorConfig.pageIndex.activeTintColor,
                borderWidth: 1,
                borderRadius: 70,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{
                  height: 70,
                  width: 70,
                  borderRadius: 70,
                  borderColor: colorConfig.pageIndex.activeTintColor,
                  borderWidth: 1,
                }}
                source={
                  this.props.dataItem.image == undefined
                    ? appConfig.appImageNull
                    : {uri: this.props.dataItem.image}
                }
              />
            </View>
            <Text
              style={{
                color: colorConfig.pageIndex.activeTintColor,
                fontWeight: 'bold',
              }}>
              {this.props.dataItem.title}
            </Text>
            <Text
              style={{
                color: colorConfig.pageIndex.grayColor,
              }}>
              {this.props.dataItem.name}
            </Text>
          </View>
          <View
            style={{
              marginLeft: 10,
              marginBottom: 10,
              marginRight: 10,
            }}>
            <Text
              style={{
                textAlign: 'justify',
              }}>
              {this.props.dataItem.message}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnBackIcon: {
    color: colorConfig.pageIndex.activeTintColor,
    margin: 10,
  },
  btnBack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnBackText: {
    color: colorConfig.pageIndex.activeTintColor,
    fontWeight: 'bold',
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
  card: {
    margin: 5,
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
  },
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    null,
    mapDispatchToProps,
  ),
)(InboxDetail);
