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
  Picker,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import {Form, TextValidator} from 'react-native-validator-form';
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
              <Text style={styles.title}>Edit Profile</Text>
            </View>
            <Form ref="form">
              <View style={styles.detail}>
                <View style={styles.detailItem}>
                  <Text style={[styles.desc, {marginLeft: 2}]}>Name</Text>
                  <TextValidator
                    style={{marginBottom: -10}}
                    name="password"
                    label="password"
                    validators={['required']}
                    errorStyle={{
                      container: {top: 5, left: 5},
                      text: {color: 'red'},
                      underlineValidColor:
                        colorConfig.pageIndex.activeTintColor,
                      underlineInvalidColor: 'red',
                    }}
                    errorMessages={['This field is required']}
                    placeholder="Name"
                    type="text"
                    under
                    value={this.props.dataDiri.name}
                    onChangeText={value => this.setState({name: value})}
                  />
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.desc}>Email</Text>
                  <Text style={{paddingTop: 12}}>
                    {this.props.dataDiri.email}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.desc}>Phone Number</Text>
                  <Text style={{paddingTop: 12}}>
                    {this.props.dataDiri.phone_number}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={[styles.desc, {marginLeft: 2}]}>Birth Date</Text>
                  <Text style={styles.desc}>
                    {this.props.dataDiri.birthdate}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={[styles.desc, {marginLeft: 2}]}>Gender</Text>
                  <Picker
                    selectedValue={this.state.gender}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({gender: itemValue})
                    }>
                    <Picker.Item label="Select one" value="" />
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Female" value="female" />
                  </Picker>
                </View>
                <View style={styles.detailItem}>
                  <Text style={[styles.desc, {marginLeft: 2}]}>Address</Text>
                  <TextValidator
                    style={{marginTop: 10}}
                    name="address"
                    label="address"
                    validators={['required']}
                    errorStyle={{
                      container: {top: 5, left: 5},
                      text: {color: 'red'},
                      underlineValidColor:
                        colorConfig.pageIndex.activeTintColor,
                      underlineInvalidColor: 'red',
                    }}
                    errorMessages={['This field is required']}
                    placeholder="Your address"
                    type="text"
                    under
                    value={this.state.address}
                    onChangeText={value => this.setState({address: value})}
                  />
                </View>
              </View>
            </Form>
          </View>
          <View
            style={{
              alignItems: 'center',
              marginTop: 15
            }}>
            <TouchableOpacity
              style={{
                borderColor: colorConfig.pageIndex.activeTintColor,
                backgroundColor: colorConfig.pageIndex.activeTintColor,
                borderRadius: 10,
                padding: 12,
                alignSelf: 'stretch',
                marginLeft: 10,
                marginRight: 10,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 19,
                  alignSelf: 'center',
                }}>
                Save
              </Text>
            </TouchableOpacity>
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
    margin: 10,
  },
  title: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detail: {
    marginLeft: 30,
    marginRight: 30,
  },
  detailItem: {
    padding: 10,
    justifyContent: 'space-between',
    // borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    // borderBottomWidth: 1,
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
