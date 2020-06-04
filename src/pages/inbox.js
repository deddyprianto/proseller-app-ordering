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
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Icon from 'react-native-vector-icons/Ionicons';
import * as _ from 'lodash';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import {dataInbox} from '../actions/inbox.action';
import {Actions} from 'react-native-router-flux';
import DetailInbox from '../components/inbox/DetailInbox';

class Inbox extends Component {
  constructor(props) {
    super(props);

    this.detailInbox = React.createRef();

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
    // item.read = 'true';
    // await AsyncStorage.setItem('@inbox' + item.id, 'true');
    // await this.props.dispatch(dataInbox());
    Actions.inboxDetail({dataItem: item});
  };

  _onRefresh = async () => {
    this.setState({refreshing: true});
    await this.getDataInbox();
    this.setState({refreshing: false});
  };

  openDetailMessage = () => {
    this.detailInbox.current.openDetail();
  };

  render() {
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
              backgroundColor: colorConfig.store.defaultColor,
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
              onPress={this.openDetailMessage}>
              <View style={styles.sejajarSpace}>
                <View style={styles.imageDetail}>
                  <Icon
                    size={35}
                    style={{color: colorConfig.store.defaultColor}}
                    name={Platform.OS === 'ios' ? 'ios-mail' : 'md-mail'}
                  />
                </View>
                <View style={styles.detail}>
                  <Text style={styles.storeName}>Title Inbox</Text>
                  <Text style={styles.paymentType}>Desc Inbox</Text>
                </View>
                <View style={styles.btnDetail} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.item}
              onPress={this.openDetailMessage}>
              <View style={styles.sejajarSpace}>
                <View style={styles.imageDetail}>
                  <Icon
                    size={35}
                    style={{color: colorConfig.pageIndex.grayColor}}
                    name={
                      Platform.OS === 'ios' ? 'ios-mail-open' : 'md-mail-open'
                    }
                  />
                </View>
                <View style={styles.detail}>
                  <Text style={styles.storeName}>Title Inbox</Text>
                  <Text style={styles.paymentType}>Desc Inbox</Text>
                </View>
                <View style={styles.btnDetail} />
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

        <DetailInbox ref={this.detailInbox} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  component: {
    marginTop: 10,
  },
  navbarTitle: {
    fontSize: 18,
    padding: 13,
    color: 'white',
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
    marginVertical: 8,
    padding: 10,
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
    alignItems: 'center',
  },
  detail: {
    paddingTop: 5,
    paddingRight: 5,
    paddingBottom: 5,
    width: Dimensions.get('window').width - 120,
  },
  storeName: {
    color: colorConfig.store.title,
    fontSize: 15,
    fontFamily: 'Lato-Bold',
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
    color: colorConfig.pageIndex.grayColor,
    fontSize: 12,
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
