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
  Platform,
  TouchableOpacity,
  ScrollView,
  Image,
  TouchableHighlight,
  BackHandler, SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import createOpenLink from 'react-native-open-maps';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';

export default class StoreDetailStores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
    };
  }

  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackPress = () => {
    this.goBack();
    return true;
  };

  goBack = async () => {
    Actions.pop();
  };

  storeMap(coordinate, storeName) {
    // Actions.storeSeeMap({coordinate});
    createOpenLink({
      query: storeName,
      // latitude: coordinate.lat,
      // longitude: coordinate.lng,
    });
  }

  render() {
    const {intlData} = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <View style={{backgroundColor: colorConfig.pageIndex.backgroundColor}}>
          <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
            <Icon
              size={28}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
              }
              style={styles.btnBackIcon}
            />
            <Text style={styles.btnBackText}> {intlData.messages.back} </Text>
          </TouchableOpacity>
          <View style={styles.line} />
        </View>
        <ScrollView>
          <View style={styles.cardImage}>
            {this.props.item.defaultImageURL != undefined ? (
              <Image
                resizeMode="cover"
                style={styles.imageNotNull}
                source={{
                  uri: this.props.item.defaultImageURL,
                }}
              />
            ) : (
              <Image
                resizeMode="stretch"
                style={styles.image}
                source={appConfig.appImageNull}
              />
            )}
          </View>
          <View style={styles.card}>
            <View style={styles.item}>
              <Text style={styles.title}>{this.props.item.storeName}</Text>
            </View>
            <View style={styles.detail}>
              <View style={styles.detailItem}>
                <Text style={[styles.desc, {fontWeight: 'bold'}]}>
                  {intlData.messages.city}
                </Text>
                <Text style={styles.desc}>
                  {this.props.item.city != undefined
                    ? this.props.item.city
                    : '-'}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.desc, {fontWeight: 'bold'}]}>
                  {intlData.messages.region}
                </Text>
                <Text style={styles.desc}>
                  {this.props.item.region != undefined
                    ? this.props.item.region
                    : '-'}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.desc, {fontWeight: 'bold'}]}>
                  {intlData.messages.address}
                </Text>
                <Text style={styles.descAddress}>
                  {this.props.item.address}
                </Text>
              </View>
              {this.props.item.storeJarak == '-' ? null : (
                <View style={styles.detailItem}>
                  <Text style={[styles.desc, {fontWeight: 'bold'}]}>
                    {intlData.messages.distance}
                  </Text>
                  <Text style={styles.desc}>
                    {this.props.item.storeJarak.toFixed(1) + ' KM'}
                  </Text>
                </View>
              )}
              <View style={styles.detailItem}>
                <Text style={[styles.desc, {fontWeight: 'bold'}]}>Status</Text>
                <Text style={styles.desc}>
                  {this.props.item.storeStatus ? (
                    <Text
                      style={{
                        color: colorConfig.store.colorSuccess,
                        fontWeight: 'bold',
                      }}>
                      {intlData.messages.open}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color: colorConfig.store.colorError,
                        fontWeight: 'bold',
                      }}>
                      {intlData.messages.closed}
                    </Text>
                  )}
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                }}>
                {/*<TouchableOpacity*/}
                {/*  style={{*/}
                {/*    borderColor: colorConfig.pageIndex.activeTintColor,*/}
                {/*    borderWidth: 1,*/}
                {/*    borderRadius: 10,*/}
                {/*    paddingLeft: 10,*/}
                {/*    paddingRight: 10,*/}
                {/*    paddingTop: 5,*/}
                {/*    paddingBottom: 5,*/}
                {/*  }}*/}
                {/*  onPress={() =>*/}
                {/*    this.storeMap(*/}
                {/*      this.props.item.coordinate,*/}
                {/*      this.props.item.storeName,*/}
                {/*    )*/}
                {/*  }>*/}
                {/*  <Text*/}
                {/*    style={{*/}
                {/*      color: colorConfig.pageIndex.activeTintColor,*/}
                {/*      fontWeight: 'bold',*/}
                {/*    }}>*/}
                {/*    Open Map*/}
                {/*  </Text>*/}
                {/*</TouchableOpacity>*/}
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.item}>
              <Text style={styles.title}>
                {intlData.messages.operationalHours}
              </Text>
            </View>
            {this.props.item.operationalHours != undefined ? (
              this.props.item.operationalHours
                .filter(item => item.active == true)
                .map((data, key) => (
                  <View key={key} style={styles.detail}>
                    <View style={styles.detailItem}>
                      <Text style={[styles.desc, {fontWeight: 'bold'}]}>
                        {data.nameOfDay}
                      </Text>
                      <Text style={styles.desc}>
                        {data.open} {intlData.messages.until} {data.close}
                      </Text>
                    </View>
                  </View>
                ))
            ) : this.props.item.openAllDays ? (
              <View style={styles.detail}>
                <Text
                  style={[
                    styles.title,
                    {
                      color: colorConfig.pageIndex.grayColor,
                      marginTop: 20,
                      marginBottom: 30,
                    },
                  ]}>
                  This outlet is open all days
                </Text>
              </View>
            ) : (
              <View style={styles.detail}>
                <Text
                  style={[
                    styles.title,
                    {
                      color: colorConfig.pageIndex.grayColor,
                      marginTop: 20,
                      marginBottom: 30,
                    },
                  ]}>
                  No description for operational hours
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
        <TouchableHighlight
          style={styles.btnBottom}
          onPress={() =>
            this.storeMap(this.props.item.coordinate, this.props.item.storeName)
          }>
          <Text style={styles.textBtnBottom}>
            <Icon
              size={18}
              name={Platform.OS === 'ios' ? 'ios-locate' : 'md-locate'}
              style={{color: 'white', paddingRight: 10}}
            />
            <Text> {intlData.messages.location}</Text>
          </Text>
        </TouchableHighlight>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnBottom: {
    backgroundColor: colorConfig.store.defaultColor,
    height: 56,
    justifyContent: 'center',
  },
  textBtnBottom: {
    color: colorConfig.splash.container,
    fontSize: 18,
    textAlign: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
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
  cardImage: {
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
  card: {
    marginHorizontal: 7,
    marginVertical: 10,
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
  item: {
    alignItems: 'center',
    borderBottomColor: colorConfig.pageIndex.grayColor,
    borderBottomWidth: 1,
    margin: 10,
  },
  title: {
    color: colorConfig.store.defaultColor,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 10,
  },
  imageNotNull: {
    height: 200,
    resizeMode: 'stretch',
  },
  image: {
    height: 200,
    resizeMode: 'stretch',
    width: '100%',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 10,
  },
  desc: {
    color: colorConfig.pageIndex.grayColor,
  },
  descAddress: {
    color: colorConfig.pageIndex.grayColor,
    marginLeft: 8,
    maxWidth: Dimensions.get('window').width / 2 + 20,
    textAlign: 'right',
  },
});
