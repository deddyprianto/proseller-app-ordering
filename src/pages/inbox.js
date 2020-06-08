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
  Platform,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Icon from 'react-native-vector-icons/Ionicons';
import * as _ from 'lodash';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import {dataInbox, readMessage} from '../actions/inbox.action';
import DetailInbox from '../components/inbox/DetailInbox';
import {isEmptyArray} from '../helper/CheckEmpty';

class Inbox extends Component {
  constructor(props) {
    super(props);

    this.detailInbox = React.createRef();

    this.state = {
      refreshing: false,
    };
  }

  componentDidMount = () => {
    try {
      this.componentInboxFocused = this.props.navigation.addListener(
        'willFocus',
        () => {
          this.getDataInbox(0, 10);
        },
      );
    } catch (e) {}
  };

  componentWillUnmount(): void {
    try {
      this.componentInboxFocused.remove();
    } catch (e) {}
  }

  getDataInbox = async (skip, take) => {
    try {
      await this.props.dispatch(dataInbox(skip, take));
    } catch (error) {
      console.log(error);
    }
  };

  _onRefresh = async () => {
    await this.setState({refreshing: true});
    await this.getDataInbox(0, 10);
    await this.setState({refreshing: false});
  };

  openDetailMessage = (inbox, index) => {
    this.detailInbox.current.openDetail(inbox);
    setTimeout(() => {
      this.readMessage(inbox, index);
    }, 50);
  };

  isRead = item => {
    if (item.isRead == true) {
      return (
        <Icon
          size={35}
          style={{color: colorConfig.pageIndex.grayColor}}
          name={Platform.OS === 'ios' ? 'ios-mail-open' : 'md-mail-open'}
        />
      );
    } else {
      return (
        <Icon
          size={35}
          style={{color: colorConfig.store.defaultColor}}
          name={Platform.OS === 'ios' ? 'ios-mail' : 'md-mail'}
        />
      );
    }
  };

  templateInbox = (item, index) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => this.openDetailMessage(item, index)}>
        <View style={styles.sejajarSpace}>
          <View style={styles.imageDetail}>{this.isRead(item)}</View>
          <View style={styles.detail}>
            <Text style={styles.storeName}>{item.title}</Text>
            <Text style={styles.paymentType}>
              {item.message.substr(0, 25)}...
            </Text>
          </View>
          <View style={styles.btnDetail} />
        </View>
      </TouchableOpacity>
    );
  };

  handleLoadMoreItems = async item => {
    try {
      const {dataInbox} = this.props;
      if (!isEmptyArray(dataInbox.Data)) {
        if (dataInbox.dataLength > dataInbox.Data.length) {
          await this.getDataInbox(item.skip, 10);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  readMessage = async (item, index) => {
    try {
      await this.props.dispatch(readMessage(item, index));
    } catch (e) {}
  };

  renderInbox = () => {
    const {dataInbox} = this.props;
    return (
      <View style={{marginBottom: '8%'}}>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          data={dataInbox.Data}
          renderItem={({item, index}) => this.templateInbox(item, index)}
          onEndReachedThreshold={0.01}
          onEndReached={this.handleLoadMoreItems}
        />
      </View>
    );
  };

  renderEmptyInbox = () => {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            style={{
              marginTop: 100,
              width: 150,
              height: 150,
            }}
            source={appConfig.emptyBox}
          />
          <Text
            style={{
              marginTop: 20,
              fontFamily: 'Lato-Bold',
              fontSize: 20,
              color: colorConfig.store.title,
            }}>
            No incoming message yet
          </Text>
          <Text
            style={{
              marginTop: 10,
              fontFamily: 'Lato-Bold',
              fontSize: 17,
              marginHorizontal: 40,
              textAlign: 'center',
              color: colorConfig.pageIndex.inactiveTintColor,
            }}>
            If there is an incoming message, it will appear here.
          </Text>
        </View>
      </ScrollView>
    );
  };

  render() {
    let {dataInbox} = this.props;
    return (
      <SafeAreaView>
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
        </View>

        {dataInbox != undefined
          ? dataInbox.Data.length != 0
            ? this.renderInbox()
            : this.renderEmptyInbox()
          : null}

        <DetailInbox ref={this.detailInbox} />
      </SafeAreaView>
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
  dataInbox: state.inboxReducer.dataInbox.broadcast,
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
