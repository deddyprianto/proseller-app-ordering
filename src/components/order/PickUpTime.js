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
  Platform,
  SafeAreaView,
  Alert,
  Picker,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import {compose} from 'redux';
import {connect} from 'react-redux';
import Loader from '../loader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {format} from 'date-fns';
import {isEmptyArray, isEmptyObject} from '../../helper/CheckEmpty';
import DropDownPicker from 'react-native-dropdown-picker';
import {loginOther} from '../../actions/auth.actions';

class PickUpTime extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screenWidth: Dimensions.get('window').width,
      date: null,
      time: null,
      dateVisible: false,
      timeVisible: false,
      hour: null,
      minute: null,
      openTimePicker: false,
    };
  }

  goBack = async () => {
    Actions.pop();
  };

  componentDidMount = async () => {
    const {date, time} = this.props;
    try {
      // let date = format(new Date(), 'yyyy-MM-dd');
      // let time = format(new Date(), 'HH:mm');

      this.setState({date, time});
    } catch (e) {}
  };

  componentWillUnmount() {
    try {
      this.backHandler.remove();
    } catch (e) {}
  }

  handleBackPress = () => {
    this.goBack();
    return true;
  };

  submit = async () => {
    try {
      this.setState({loading: true});

      this.props.setPickupDate(this.state.date);
      this.props.setPickupTime(this.state.time);

      this.setState({loading: false});

      Actions.pop();
    } catch (e) {
      Alert.alert(e.message, 'Something went wrong, please try again');
      this.setState({loading: false});
    }
  };

  hideDatePicker = () => {
    this.setState({dateVisible: false});
  };

  handleConfirmDate = date => {
    let formattedDate = date;
    try {
      formattedDate = format(date, 'yyyy-MM-dd');
    } catch (e) {}
    this.setState({date: formattedDate});
    this.hideDatePicker();
  };

  hideTimePicker = () => {
    this.setState({timeVisible: false});
  };

  handleConfirmTime = time => {
    let formattedTime = time;
    try {
      formattedTime = format(time, 'HH:mm');
    } catch (e) {}

    this.setState({time: formattedTime});
    this.hideTimePicker();
  };

  getMaximumDate = () => {
    const {outlet, orderType} = this.props;
    let current = new Date().getTime();
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    try {
      let maxDays = 360;
      if (!isEmptyObject(outlet.timing)) {
        if (orderType == 'DELIVERY') {
          if (
            !isEmptyObject(outlet.timing.delivery) &&
            outlet.timing.delivery.maxDays != undefined &&
            outlet.timing.delivery.maxDays != null
          ) {
            maxDays = outlet.timing.delivery.maxDays;
          }
        } else if (orderType == 'DINEIN') {
          if (
            !isEmptyObject(outlet.timing.dineIn) &&
            outlet.timing.dineIn.maxDays != undefined &&
            outlet.timing.dineIn.maxDays != null
          ) {
            maxDays = outlet.timing.dineIn.maxDays;
          }
        } else if (orderType == 'TAKEAWAY') {
          if (
            !isEmptyObject(outlet.timing.takeAway) &&
            outlet.timing.takeAway.maxDays != undefined &&
            outlet.timing.takeAway.maxDays != null
          ) {
            maxDays = outlet.timing.takeAway.maxDays;
          }
        } else if (orderType == 'STOREPICKUP') {
          if (
            !isEmptyObject(outlet.timing.storePickUp) &&
            outlet.timing.storePickUp.maxDays != undefined &&
            outlet.timing.storePickUp.maxDays != null
          ) {
            maxDays = outlet.timing.storePickUp.maxDays;
          }
        } else if (orderType == 'STORECHECKOUT') {
          if (
            !isEmptyObject(outlet.timing.storeCheckOut) &&
            outlet.timing.storeCheckOut.maxDays != undefined &&
            outlet.timing.storeCheckOut.maxDays != null
          ) {
            maxDays = outlet.timing.storeCheckOut.maxDays;
          }
        }
      }

      if (maxDays < 0) {
        return new Date(`${year + 1}-${month}-${date}`);
      } else {
        let nextDate = maxDays * 86400000;
        return new Date(current + nextDate);
      }
    } catch (e) {
      return new Date();
    }
  };

  getMaxHours = () => {
    const {outlet} = this.props;

    try {
      const day = new Date().getDay();
      if (isEmptyArray(outlet.operationalHours)) {
        return 23;
      } else {
        const find = outlet.operationalHours.find(item => item.day == day);
        if (find == undefined) {
          return 0;
        } else {
          let maxHours = find.close.split(':');
          return parseInt(maxHours[0]);
        }
      }
    } catch (e) {
      return 23;
    }
  };

  getMaxMinutes = () => {
    const {outlet} = this.props;

    try {
      const day = new Date().getDay();
      if (isEmptyArray(outlet.operationalHours)) {
        return 23;
      } else {
        const find = outlet.operationalHours.find(item => item.day == day);
        if (find == undefined) {
          return 0;
        } else {
          let maxHours = find.close.split(':');
          if (maxHours[0] == this.state.hour) {
            return parseInt(maxHours[1]);
          } else {
            return 59;
          }
        }
      }
    } catch (e) {
      return 59;
    }
  };

  pad = item => {
    if (item.length == 1) return `0${item}`;
    else return item;
  };

  getOperationalHours = () => {
    const {outlet} = this.props;
    let pickerItem = [{label: 'Select Pickup Time', value: null}];
    let value = '';
    let label = '';
    try {
      const day = new Date().getDay();
      if (isEmptyArray(outlet.operationalHours)) {
        for (let i = 0; i < 24; i++) {
          value = `${this.pad(i.toString())}:00`;
          value = pickerItem.push({label: value, value});
        }
        return pickerItem;
      } else {
        const find = outlet.operationalHours.find(item => item.day == day);
        if (find == undefined) {
          for (let i = 0; i < 24; i++) {
            value = `${this.pad(i.toString())}:00`;
            value = pickerItem.push({label: value, value});
          }
          return pickerItem;
        } else {
          for (let i = parseInt(find.open); i <= parseInt(find.close); i++) {
            value = `${this.pad(i.toString())}:00`;
            if (parseInt(find.close) != i) {
              label = `${this.pad(i.toString())}:00 - ${this.pad(
                (i + 1).toString(),
              )}:00`;
            }
            value = pickerItem.push({label: label, value});
          }
          return pickerItem;
        }
      }
    } catch (e) {
      for (let i = 0; i < 24; i++) {
        value = `${this.pad(i.toString())}:00`;
        value = pickerItem.push(<Picker.Item label={value} value={value} />);
      }
      return pickerItem;
    }
  };

  render() {
    const {date, time} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading && <Loader />}
        <View
          style={[
            styles.header,
            {backgroundColor: colorConfig.pageIndex.backgroundColor},
          ]}>
          <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
            <Icon
              size={28}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
              }
              style={styles.btnBackIcon}
            />
            <Text style={styles.btnBackText}> Select {this.props.header} </Text>
          </TouchableOpacity>
        </View>
        <KeyboardAwareScrollView style={{padding: 15}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 10,
            }}>
            <View style={{width: '20%'}}>
              <Text style={styles.option}>Date </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.setState({dateVisible: !this.state.dateVisible});
              }}
              style={{
                width: '60%',
                borderWidth: 0.6,
                borderColor: colorConfig.pageIndex.grayColor,
                padding: 7,
                borderRadius: 5,
              }}>
              <Text style={styles.option}>
                {format(new Date(date), 'dd MMM yyyy')}
              </Text>
              <DateTimePickerModal
                minimumDate={new Date()}
                maximumDate={this.getMaximumDate()}
                isVisible={this.state.dateVisible}
                mode="date"
                onConfirm={this.handleConfirmDate}
                onCancel={this.hideDatePicker}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 10,
              paddingBottom: this.state.openTimePicker ? 250 : 10,
            }}>
            <View style={{width: '20%'}}>
              <Text style={styles.option}>Time </Text>
            </View>
            <View
              style={{
                width: '60%',
                // borderWidth: 0.6,
                // borderColor: colorConfig.store.defaultColor,
                // // padding: 7,
                // borderRadius: 5,
              }}>
              {/*<Text style={styles.option}>{time}</Text>*/}
              <DropDownPicker
                placeholder={'Select Pickup Time'}
                items={this.getOperationalHours()}
                defaultValue={time}
                containerStyle={{
                  height: 50,
                }}
                style={{
                  backgroundColor: 'white',
                  marginTop: 5,
                  borderWidth: 0.6,
                  borderColor: colorConfig.pageIndex.grayColor,
                  borderRadius: 5,
                }}
                dropDownStyle={{
                  backgroundColor: '#fafafa',
                  // borderColor: 'red',
                  borderWidth: 0.6,
                  zIndex: 3,
                  height: 250,
                }}
                dropDownMaxHeight={250}
                activeLabelStyle={{
                  color: 'white',
                  fontFamily: 'Lato-Bold',
                }}
                activeItemStyle={{
                  backgroundColor: colorConfig.store.defaultColor,
                }}
                itemStyle={{
                  marginVertical: 4,
                  backgroundColor: 'white',
                  borderColor: 'gray',
                }}
                labelStyle={{
                  fontFamily: 'Lato-Medium',
                  fontSize: 14,
                }}
                onOpen={() => {
                  this.setState({openTimePicker: true});
                }}
                onClose={() => {
                  this.setState({openTimePicker: false});
                }}
                onChangeItem={item => {
                  this.setState({time: item.value});
                }}
              />
              {/*<Picker*/}
              {/*  selectedValue={time}*/}
              {/*  style={{width: '100%'}}*/}
              {/*  onValueChange={(itemValue, itemIndex) =>*/}
              {/*    this.setState({time: itemValue})*/}
              {/*  }>*/}
              {/*  {this.getOperationalHours()}*/}
              {/*</Picker>*/}
            </View>
          </View>

          <TouchableOpacity
            onPress={this.submit}
            style={{
              marginTop: 40,
              backgroundColor: colorConfig.store.defaultColor,
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Lato-Bold',
                fontSize: 20,
              }}>
              Set
            </Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

mapStateToProps = state => ({
  updateUser: state.userReducer.updateUser,
  userDetail: state.userReducer.getUser.userDetails,
  intlData: state.intlData,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(PickUpTime);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnBackIcon: {
    marginLeft: 10,
    color: colorConfig.store.defaultColor,
    margin: 10,
  },
  header: {
    height: 60,
    marginBottom: 20,
    justifyContent: 'center',
    // backgroundColor: colorConfig.store.defaultColor,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  btnBack: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // width: 100,
    height: 80,
  },
  btnBackText: {
    color: colorConfig.store.defaultColor,
    fontWeight: 'bold',
    fontSize: 17,
  },
  primaryButton: {
    borderColor: colorConfig.pageIndex.activeTintColor,
    backgroundColor: colorConfig.pageIndex.activeTintColor,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    padding: 12,
    alignSelf: 'stretch',
    marginLeft: 10,
    marginRight: 10,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
    marginBottom: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
  card: {
    // margin: 10,
    // borderColor: colorConfig.pageIndex.activeTintColor,
    // borderWidth: 1,
    // borderRadius: 5,
    // backgroundColor: colorConfig.pageIndex.backgroundColor,
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
    fontSize: 18,
  },
  textChange: {
    color: colorConfig.pageIndex.inactiveTintColor,
    // color: 'gray',
    fontSize: 11,
    fontWeight: 'bold',
  },
  btnChange: {
    padding: 5,
    marginLeft: 'auto',
  },
  descAddress: {
    color: colorConfig.pageIndex.grayColor,
    marginLeft: 8,
    maxWidth: Dimensions.get('window').width / 2 + 20,
    textAlign: 'right',
  },
  option: {
    fontFamily: 'Lato-Bold',
    color: colorConfig.store.titleSelected,
    fontSize: 16,
  },
});
