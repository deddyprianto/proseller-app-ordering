import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  AsyncStorage,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Icon from 'react-native-vector-icons/Ionicons';
import * as _ from 'lodash';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import {dataInbox} from '../actions/inbox.action';
import {Actions} from 'react-native-router-flux';

class Inbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      dataInbox: [],
      dataRead: [],
    };
  }

  componentDidMount = () => {
    this.getDataInbox();
  };

  getDataInbox = async () => {
    try {
      let response = await this.props.dispatch(dataInbox());
      return response.success;
    } catch (error) {
      console.log(error);
    }
  };

  inboxDetail = async item => {
    item.read = 'true';
    await AsyncStorage.setItem('@inbox' + item.id, 'true');
    await this.props.dispatch(dataInbox());
    Actions.inboxDetail({dataItem: item});
  };

  _onRefresh = async () => {
    this.setState({refreshing: true});
    await this.getDataInbox();
    this.setState({refreshing: false});
  };

  render() {
    console.log('this.props.dataInbox', this.props.dataInbox);
    return (
      <View>
        <View
          style={{
            backgroundColor: colorConfig.pageIndex.backgroundColor,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.navbarTitle}>Inbox</Text>
          </View>
          <View
            style={{
              borderBottomColor: colorConfig.store.defaultColor,
              borderBottomWidth: 2,
            }}
          />
        </View>
        <ScrollView
          style={styles.component}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          {/*{this.props.dataInbox !== undefined &&*/}
          {/*this.props.dataInbox.length > 0 ? (*/}
          {/*  this.props.dataInbox.map((item, key) => (*/}
          <View key={'key'}>
            <TouchableOpacity
              style={styles.item}
              onPress={() => this.inboxDetail('item')}>
              <View style={styles.sejajarSpace}>
                <View style={styles.imageDetail}>
                  <Image
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 40,
                      borderColor: colorConfig.pageIndex.activeTintColor,
                      borderWidth: 1,
                    }}
                    source={appConfig.appImageNull}
                  />
                </View>
                <View style={styles.detail}>
                  <Text style={styles.storeName}>Halo Bandung</Text>
                  <Text style={styles.paymentType}>Cash</Text>
                </View>
                <View style={styles.btnDetail}>
                  {/*<Icon*/}
                  {/*  size={20}*/}
                  {/*  name={*/}
                  {/*    Platform.OS === 'ios'*/}
                  {/*      ? 'ios-arrow-dropright-circle'*/}
                  {/*      : 'md-arrow-dropright-circle'*/}
                  {/*  }*/}
                  {/*  style={{*/}
                  {/*    color: colorConfig.pageIndex.activeTintColor,*/}
                  {/*  }}*/}
                  {/*/>*/}
                </View>
              </View>
            </TouchableOpacity>
          </View>
          {/*))*/}
          {/*) : (*/}
          {/*  <View style={styles.emptyNotice}>*/}
          {/*    <Text style={styles.empty}>Oppss, Your inbox is empty</Text>*/}
          {/*  </View>*/}
          {/*)}*/}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  component: {
    marginTop: 10,
  },
  navbarTitle: {
    fontSize: 15,
    color: colorConfig.store.defaultColor,
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  emptyNotice: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    marginTop: 100,
    fontSize: 22,
    color: colorConfig.pageIndex.grayColor,
    fontStyle: 'italic',
    fontFamily: 'Lato-Medium',
    textAlign: 'center',
  },
  item: {
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 2,
    padding: 10,
    // borderColor: colorConfig.pageIndex.activeTintColor,
    // borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
  sejajarSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detail: {
    paddingTop: 5,
    paddingRight: 5,
    paddingBottom: 5,
    width: Dimensions.get('window').width - 120,
  },
  storeName: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentTgl: {
    color: colorConfig.pageIndex.inactiveTintColor,
  },
  paymentTypeLogo: {
    width: 20,
    height: 15,
    marginTop: 2,
  },
  paymentType: {
    color: colorConfig.pageIndex.activeTintColor,
  },
  itemType: {
    color: colorConfig.pageIndex.inactiveTintColor,
    fontSize: 12,
    fontStyle: 'italic',
  },
  btnDetail: {
    alignItems: 'center',
    width: 40,
    paddingTop: 15,
  },
  imageDetail: {
    alignItems: 'center',
    width: 60,
    paddingTop: 5,
  },
});

mapStateToProps = state => ({
  dataInbox: state.inboxReducer.dataInbox.broadcas,
  dataInboxNoRead: state.inboxReducer.dataInbox.broadcasNoRead,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Inbox);
