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

  async getDataInbox() {
    try {
      await this.props.dispatch(dataInbox());
      // console.log(this.props.dataInboxNoRead);
    } catch (error) {
      console.log(error);
    }
  }

  inboxDetail = async item => {
    item.read = 'true';
    await AsyncStorage.setItem('@inbox' + item.id, 'true');
    Actions.inboxDetail({dataItem: item});
  };

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getDataInbox();
    this.setState({refreshing: false});
  };

  render() {
    return (
      <ScrollView
        style={styles.component}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }>
        {this.props.dataInbox == undefined ? null : this.props.dataInbox
            .length > 0 ? (
          this.props.dataInbox.map((item, key) => (
            <View key={key}>
              <TouchableOpacity
                style={styles.item}
                onPress={() => this.inboxDetail(item)}>
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
                      source={
                        item.image == undefined
                          ? appConfig.appImageNull
                          : {uri: item.image}
                      }
                    />
                    {item.read ? null : (
                      <View
                        style={{
                          backgroundColor: 'red',
                          height: 13,
                          width: 13,
                          position: 'absolute',
                          left: null,
                          borderRadius: 13,
                          borderColor: colorConfig.pageIndex.backgroundColor,
                          borderWidth: 2,
                          right: 8,
                          top: 7,
                        }}
                      />
                    )}
                  </View>
                  <View style={styles.detail}>
                    <Text style={styles.storeName}>{item.title}</Text>
                    <Text style={styles.paymentType}>{item.name}</Text>
                  </View>
                  <View style={styles.btnDetail}>
                    <Icon
                      size={20}
                      name={
                        Platform.OS === 'ios'
                          ? 'ios-arrow-dropright-circle'
                          : 'md-arrow-dropright-circle'
                      }
                      style={{
                        color: colorConfig.pageIndex.activeTintColor,
                      }}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text
            style={{
              color: colorConfig.pageIndex.grayColor,
              fontStyle: 'italic',
              textAlign: 'center',
            }}>
            Empty
          </Text>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  component: {
    marginTop: 10,
  },
  empty: {
    color: colorConfig.pageIndex.inactiveTintColor,
    textAlign: 'center',
  },
  item: {
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 2,
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
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
