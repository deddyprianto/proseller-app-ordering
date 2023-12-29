import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import {dataInbox, readMessage} from '../actions/inbox.action';
import DetailInbox from '../components/inbox/DetailInbox';
import {isEmptyArray} from '../helper/CheckEmpty';
import {Body} from '../components/layout';
import withHooksComponent from '../components/HOC';
import ListInbox from '../components/inbox/ListInbox';
import InboxLoading from '../components/shimmerLoading/InboxLoading';
import {HistoryNotificationModal} from '../components/modal';
import {openPopupNotification} from '../actions/order.action';
import {navigate} from '../utils/navigation.utils';

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
          this.getDataInbox(0, 50, true);
        },
      );
    } catch (e) {}
  };

  componentWillUnmount() {
    try {
      this.componentInboxFocused.remove();
    } catch (e) {}
  }

  getDataInbox = async (skip, take, isOpenTab) => {
    try {
      await this.props.dispatch(dataInbox(skip, take, isOpenTab));
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
    navigate('inboxDetailMessage', {data: inbox});
    setTimeout(() => {
      this.readMessage(inbox, index);
    }, 50);
  };

  templateInbox = (item, index) => {
    return (
      <ListInbox
        item={item}
        index={index}
        openDetailMessage={() => this.openDetailMessage(item, index)}
      />
    );
  };

  handleLoadMoreItems = async item => {
    try {
      const {dataInbox} = this.props;
      if (!isEmptyArray(dataInbox.Data)) {
        if (dataInbox.DataLength > dataInbox.Data.length) {
          await this.getDataInbox(dataInbox.skip, 10);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  renderFooter = () => {
    try {
      const {dataInbox} = this.props;
      if (!isEmptyArray(dataInbox.Data)) {
        if (dataInbox.DataLength > dataInbox.Data.length) {
          return (
            <ActivityIndicator
              size={30}
              color={colorConfig.store.secondaryColor}
            />
          );
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  readMessage = async (item, index) => {
    try {
      await this.props.dispatch(readMessage(item, index));
    } catch (e) {}
  };

  renderInbox = () => {
    const {dataInbox, isLoading} = this.props;
    if (isLoading) {
      return <InboxLoading numberList={4} />;
    }
    return (
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
        ListFooterComponent={() => this.renderFooter()}
        contentContainerStyle={styles.scrollContainer}
      />
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
              fontFamily: 'Poppins-Medium',
              fontSize: 20,
              color: colorConfig.store.title,
            }}>
            No incoming message yet
          </Text>
          <Text
            style={{
              marginTop: 10,
              fontFamily: 'Poppins-Medium',
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

  closePopup = () => {
    this.props.dispatch(openPopupNotification(false));
  };

  render() {
    let {dataInbox} = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <Body>
          <View
            style={{
              backgroundColor: colorConfig.pageIndex.backgroundColor,
            }}>
            <View style={[styles.containerNavbar, styles.shadowBox]}>
              <Text
                style={[
                  styles.navbarTitle,
                  {color: this.props.colors.primary},
                ]}>
                Inbox
              </Text>
            </View>
          </View>

          {dataInbox != undefined
            ? dataInbox.Data.length != 0
              ? this.renderInbox()
              : this.renderEmptyInbox()
            : null}

          <DetailInbox ref={this.detailInbox} />
        </Body>
        <HistoryNotificationModal
          value={this.props.dataNotification}
          open={this.props.popupNotification}
          handleClose={this.closePopup}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  containerNavbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  shadowBox: {
    shadowColor: 'black',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  navbarTitle: {
    fontSize: 18,
    padding: 13,
    color: 'white',
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
});

const mapStateToProps = state => ({
  dataInbox: state.inboxReducer.dataInbox.broadcast,
  isLoading: state.inboxReducer?.dataInbox?.isLoading,
  popupNotification: state.orderReducer?.popupNotification?.openPopup,
  dataNotification: state?.orderReducer?.notificationData?.notificationData,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default withHooksComponent(
  compose(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    ),
  )(Inbox),
);
