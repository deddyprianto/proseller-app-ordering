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
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import createOpenLink from 'react-native-open-maps';

import colorConfig from '../config/colorConfig';

export default class StoreDetailStores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
    };
  }

  goBack() {
    Actions.pop();
  }

  storeMap(coordinate, storeName) {
    // Actions.storeSeeMap({coordinate});
    createOpenLink({
      query: storeName,
      // latitude: coordinate.lat,
      // longitude: coordinate.lng,
    });
  }

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
        <ScrollView>
          <View style={styles.card}>
            <View style={styles.item}>
              <Text style={styles.title}>{this.props.item.storeName}</Text>
            </View>
            <View style={styles.detail}>
              <View style={styles.detailItem}>
                <Text style={styles.desc}>Region</Text>
                <Text style={styles.desc}>{this.props.item.region}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.desc}>Address</Text>
                <Text style={styles.descAddress}>
                  {this.props.item.address}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.desc}>Distance</Text>
                <Text style={styles.desc}>
                  {this.props.item.storeJarak.toFixed(1) + ' KM'}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.desc}>Status</Text>
                <Text style={styles.desc}>{this.props.item.storeStatus}</Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    borderColor: colorConfig.pageIndex.activeTintColor,
                    borderWidth: 1,
                    borderRadius: 10,
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 5,
                    paddingBottom: 5,
                  }}
                  onPress={() =>
                    this.storeMap(
                      this.props.item.coordinate,
                      this.props.item.storeName,
                    )
                  }>
                  <Text
                    style={{
                      color: colorConfig.pageIndex.activeTintColor,
                      fontWeight: 'bold',
                    }}>
                    Open Map
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.item}>
              <Text style={styles.title}>Operating Hours</Text>
            </View>
            <View style={styles.detail}>
              <View style={styles.detailItem}>
                <Text style={styles.desc}>Monday</Text>
                <Text style={styles.desc}>
                  {this.props.item.operationalHours[1].monday.open +
                    ' to ' +
                    this.props.item.operationalHours[1].monday.close}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.desc}>Tuesday</Text>
                <Text style={styles.desc}>
                  {this.props.item.operationalHours[2].tuesday.open +
                    ' to ' +
                    this.props.item.operationalHours[2].tuesday.close}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.desc}>Wednesday</Text>
                <Text style={styles.desc}>
                  {this.props.item.operationalHours[3].wednesday.open +
                    ' to ' +
                    this.props.item.operationalHours[3].wednesday.close}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.desc}>Thursday</Text>
                <Text style={styles.desc}>
                  {this.props.item.operationalHours[4].thursday.open +
                    ' to ' +
                    this.props.item.operationalHours[4].thursday.close}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.desc}>Friday</Text>
                <Text style={styles.desc}>
                  {this.props.item.operationalHours[5].friday.open +
                    ' to ' +
                    this.props.item.operationalHours[5].friday.close}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.desc}>Saturday</Text>
                <Text style={styles.desc}>
                  {this.props.item.operationalHours[6].saturday.open +
                    ' to ' +
                    this.props.item.operationalHours[6].saturday.close}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.desc}>Sunday</Text>
                <Text style={styles.desc}>
                  {this.props.item.operationalHours[0].sunday.open +
                    ' to ' +
                    this.props.item.operationalHours[0].sunday.close}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
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
    margin: 10,
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
  },
  item: {
    alignItems: 'center',
    borderBottomColor: colorConfig.pageIndex.activeTintColor,
    borderBottomWidth: 1,
    margin: 10,
  },
  title: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 10,
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
