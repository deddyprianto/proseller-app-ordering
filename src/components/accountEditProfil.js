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
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

import colorConfig from '../config/colorConfig';

export default class AccountEditProfil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
    };
  }

  goBack() {
    Actions.pop();
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
              <Text style={styles.title}>Detail User</Text>
            </View>
            <View style={styles.detail}>
              <View style={styles.detailItem}>
                <Text style={styles.desc}>Name</Text>
                <Text style={styles.desc}>{this.props.dataDiri.name}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.desc}>Email</Text>
                <Text style={styles.desc}>{this.props.dataDiri.email}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.desc}>Phone Number</Text>
                <Text style={styles.desc}>
                  {this.props.dataDiri.phone_number}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.desc}>Birth Date</Text>
                <Text style={styles.desc}>{this.props.dataDiri.birthdate}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.desc}>Gender</Text>
                <Text style={styles.desc}>-</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.desc}>Address</Text>
                <Text style={styles.desc}>-</Text>
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
                  }}>
                  <Text
                    style={{
                      color: colorConfig.pageIndex.activeTintColor,
                      fontWeight: 'bold',
                    }}>
                    Save
                  </Text>
                </TouchableOpacity>
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
