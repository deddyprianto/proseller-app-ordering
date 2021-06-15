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
  FlatList,
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
// import DropDownPicker from 'react-native-dropdown-picker';
import {getTimeslot} from '../../actions/order.action';

class PickUpTime extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screenWidth: Dimensions.get('window').width,
      date: null,
      dateSelected: null,
      time: null,
      timeSelected: null,
      dateVisible: false,
      timeVisible: false,
      hour: null,
      minute: null,
      openTimePicker: false,
      selectedTimeSlot: this.props.selectedTimeSlot,
      moreDates: false,
    };
  }

  goBack = async () => {
    Actions.pop();
  };

  componentDidMount = async () => {
    const {date, time} = this.props;
    try {
      this.setState({date, time});
      // await this.getDefaultTime(time);
    } catch (e) {}
    this.scrollToData();
  };

  scrollToData = () => {
    try {
      const dataTimeSlot = this.props.timeslots.findIndex(
        item => item.date === this.state.selectedTimeSlot.date,
      );
      let wait = new Promise(resolve => setTimeout(resolve, 500));
      wait.then(() => {
        this.DateRef.scrollToIndex({
          animated: true,
          index: dataTimeSlot,
        });
      });
    } catch (e) {}
    try {
      let wait = new Promise(resolve => setTimeout(resolve, 500));
      wait.then(() => {
        const dataTimeSlot = this.state.selectedTimeSlot.timeSlot.filter(
          item => item.isAvailable,
        );
        const find = dataTimeSlot.findIndex(
          item => item.time === this.state.time,
        );
        this.TimeRef.scrollToIndex({
          animated: true,
          index: find,
        });
      });
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

      if (this.state.time != null && this.state.time != undefined) {
        this.props.setPickupTime(this.state.time);
        this.props.setPickupDate(this.state.date);
        this.props.setSelectedTimeSlot(this.state.selectedTimeSlot);
      } else {
        if (this.checkTimeslotAvailibility()) {
          Alert.alert('Sorry', 'Please select order timeslot.');
          this.setState({loading: false});
          return;
        } else {
          this.props.setPickupDate(this.state.date);
        }
      }

      this.setState({loading: false});

      Actions.pop();
    } catch (e) {
      Alert.alert('Sorry', 'Something went wrong, please try again');
      this.setState({loading: false});
    }
  };

  hideDatePicker = () => {
    this.setState({dateVisible: false});
  };

  handleConfirmDate = async date => {
    let formattedDate = date;
    const {timeslots} = this.props;
    try {
      formattedDate = format(date, 'yyyy-MM-dd');
    } catch (e) {}
    const selectedDate = timeslots.find(item => item.date === formattedDate);
    if (selectedDate !== undefined) {
      formattedDate = selectedDate.date;
      this.setState({selectedTimeSlot: selectedDate});
    } else {
      this.setState({selectedTimeSlot: {}});
    }
    console.log(timeslots, 'selectedDate');
    console.log(formattedDate, 'date');
    await this.setState({date: formattedDate, time: null});
    this.hideDatePicker();
  };

  getTimeslot = async () => {
    const {outlet, orderType} = this.props;
    const outletID = outlet.id;
    await this.setState({loading: true});
    try {
      const clientTimeZone = Math.abs(new Date().getTimezoneOffset());
      const response = await this.props.dispatch(
        getTimeslot(outletID, this.state.date, clientTimeZone, orderType),
      );
      if (response === false || isEmptyArray(response)) {
        Alert.alert(
          'Sorry',
          'Ordering timeslot is not available on this date, please choose other date.',
        );
      }
    } catch (e) {}
    await this.setState({loading: false});
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
      let maxDays = 90;
      if (!isEmptyObject(outlet.orderValidation)) {
        if (orderType == 'DELIVERY') {
          if (
            !isEmptyObject(outlet.orderValidation.delivery) &&
            outlet.orderValidation.delivery.maxDays != undefined &&
            outlet.orderValidation.delivery.maxDays != null
          ) {
            maxDays = outlet.orderValidation.delivery.maxDays;
          }
        } else if (orderType == 'DINEIN') {
          if (
            !isEmptyObject(outlet.orderValidation.dineIn) &&
            outlet.orderValidation.dineIn.maxDays != undefined &&
            outlet.orderValidation.dineIn.maxDays != null
          ) {
            maxDays = outlet.orderValidation.dineIn.maxDays;
          }
        } else if (orderType == 'TAKEAWAY') {
          if (
            !isEmptyObject(outlet.orderValidation.takeAway) &&
            outlet.orderValidation.takeAway.maxDays != undefined &&
            outlet.orderValidation.takeAway.maxDays != null
          ) {
            maxDays = outlet.orderValidation.takeAway.maxDays;
          }
        } else if (orderType == 'STOREPICKUP') {
          if (
            !isEmptyObject(outlet.orderValidation.storePickUp) &&
            outlet.orderValidation.storePickUp.maxDays != undefined &&
            outlet.orderValidation.storePickUp.maxDays != null
          ) {
            maxDays = outlet.orderValidation.storePickUp.maxDays;
          }
        } else if (orderType == 'STORECHECKOUT') {
          if (
            !isEmptyObject(outlet.orderValidation.storeCheckOut) &&
            outlet.orderValidation.storeCheckOut.maxDays != undefined &&
            outlet.orderValidation.storeCheckOut.maxDays != null
          ) {
            maxDays = outlet.orderValidation.storeCheckOut.maxDays;
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
    const {outlet, timeslots, orderType} = this.props;
    let type = 'Pickup';
    if (orderType === 'DELIVERY') type = 'Delivery';
    let pickerItem = [{label: `Select ${type} Time`, value: null}];
    let value = '';
    try {
      for (let i = 0; i < timeslots.length; i++) {
        if (timeslots[i].isAvailable == true) {
          value = timeslots[i].time;
          value = pickerItem.push({label: value, value});
        }
      }
      return pickerItem;
    } catch (e) {
      return pickerItem;
    }
  };

  getDefaultTime = async time => {
    try {
      const {timeslots} = this.props;
      const find = timeslots.find(item => item.time == time);
      if (find == undefined) {
        await this.setState({time: null});
      } else {
        await this.setState({time: find.time});
      }
    } catch (e) {
      return null;
    }
  };

  checkTimeslotAvailibility = () => {
    try {
      const {timeslots} = this.props;
      if (isEmptyArray(timeslots)) {
        return false;
      } else {
        return true;
      }
    } catch (e) {
      return false;
    }
  };

  getMinimumDate = () => {
    try {
      if (
        this.props.minimumDate != null &&
        this.props.minimumDate != undefined
      ) {
        return new Date(this.props.minimumDate);
      } else {
        return new Date();
      }
    } catch (e) {
      return new Date();
    }
  };

  renderItem = ({item}) => {
    const {dateSelected, date, timeSelected, time} = this.state;
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({date: item.date, selectedTimeSlot: item, time: null});
        }}
        style={
          date === item.date ? styles.cardSelected : styles.cardNotSelected
        }>
        <Text
          style={
            date === item.date
              ? styles.selectedTextSmall
              : styles.notSelectedTextSmall
          }>
          {format(new Date(item.date), 'iii')}
        </Text>
        <Text
          style={
            date === item.date ? styles.selectedText : styles.notSelectedText
          }>
          {format(new Date(item.date), 'dd')}
        </Text>
        <Text
          style={
            date === item.date
              ? styles.selectedTextSmall
              : styles.notSelectedTextSmall
          }>
          {format(new Date(item.date), 'LLL')}
        </Text>
      </TouchableOpacity>
    );
  };

  renderItemTimeslot = ({item}) => {
    const {
      dateSelected,
      date,
      timeSelected,
      selectedTimeSlot,
      time,
    } = this.state;
    if (item.isAvailable) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.setState({time: item.time});
          }}
          style={
            time === item.time && date === selectedTimeSlot.date
              ? styles.timeSelected
              : styles.timeNotSelected
          }>
          <Text
            style={
              time === item.time && date === selectedTimeSlot.date
                ? styles.selectedTextTime
                : styles.notSelectedTextTime
            }>
            {item.time}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  render() {
    const {date, time, moreDates} = this.state;
    const {timeslots} = this.props;
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
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <Text style={[styles.option, {marginBottom: 10}]}>Date</Text>
            <TouchableOpacity
              onPress={() => this.setState({moreDates: !this.state.moreDates})}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                size={19}
                name={Platform.OS === 'ios' ? 'ios-calendar' : 'md-calendar'}
                style={{
                  color: colorConfig.store.defaultColor,
                  marginRight: 10,
                  marginBottom: 6,
                }}
              />
              <Text
                style={[
                  styles.option,
                  {marginBottom: 10, color: colorConfig.store.defaultColor},
                ]}>
                {moreDates ? 'Less dates' : 'More dates'}
              </Text>
            </TouchableOpacity>
          </View>
          {!moreDates && (
            <FlatList
              ref={ref => {
                this.DateRef = ref;
              }}
              data={timeslots}
              horizontal={true}
              renderItem={this.renderItem}
              keyExtractor={item => item.id}
            />
          )}

          {moreDates && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({dateVisible: !this.state.dateVisible});
                }}
                style={{
                  width: '96%',
                  borderWidth: 0.6,
                  borderColor: colorConfig.pageIndex.grayColor,
                  padding: 7,
                  borderRadius: 5,
                }}>
                <Text style={styles.option}>
                  {format(new Date(date), 'dd MMM yyyy')}
                </Text>
                <DateTimePickerModal
                  minimumDate={this.getMinimumDate()}
                  maximumDate={this.getMaximumDate()}
                  isVisible={this.state.dateVisible}
                  mode="date"
                  date={new Date(this.state.date)}
                  onConfirm={this.handleConfirmDate}
                  onCancel={this.hideDatePicker}
                />
              </TouchableOpacity>
            </View>
          )}

          {!isEmptyObject(this.state.selectedTimeSlot) && (
            <Text style={[styles.option, {marginVertical: 15}]}>Time :</Text>
          )}
          <FlatList
            ref={ref => {
              this.TimeRef = ref;
            }}
            initialNumToRender={100}
            data={this.state.selectedTimeSlot.timeSlot}
            horizontal={true}
            renderItem={this.renderItemTimeslot}
            keyExtractor={item => item.id}
          />

          {/*{this.checkTimeslotAvailibility() && (*/}
          {/*  <View*/}
          {/*    style={{*/}
          {/*      flexDirection: 'row',*/}
          {/*      alignItems: 'center',*/}
          {/*      paddingVertical: 10,*/}
          {/*      paddingBottom: this.state.openTimePicker ? 250 : 10,*/}
          {/*    }}>*/}
          {/*    <View style={{width: '20%'}}>*/}
          {/*      <Text style={styles.option}>Time </Text>*/}
          {/*    </View>*/}
          {/*    <View*/}
          {/*      style={{*/}
          {/*        width: '60%',*/}
          {/*      }}>*/}
          {/*      <DropDownPicker*/}
          {/*        placeholder={'Select Pickup Time'}*/}
          {/*        items={this.getOperationalHours()}*/}
          {/*        defaultValue={time}*/}
          {/*        containerStyle={{*/}
          {/*          height: 50,*/}
          {/*        }}*/}
          {/*        style={{*/}
          {/*          backgroundColor: 'white',*/}
          {/*          marginTop: 5,*/}
          {/*          borderWidth: 0.6,*/}
          {/*          borderColor: colorConfig.pageIndex.grayColor,*/}
          {/*          borderRadius: 5,*/}
          {/*        }}*/}
          {/*        dropDownStyle={{*/}
          {/*          backgroundColor: '#fafafa',*/}
          {/*          // borderColor: 'red',*/}
          {/*          borderWidth: 0.6,*/}
          {/*          zIndex: 3,*/}
          {/*          height: 250,*/}
          {/*        }}*/}
          {/*        dropDownMaxHeight={250}*/}
          {/*        activeLabelStyle={{*/}
          {/*          color: 'white',*/}
          {/*          fontFamily: 'Poppins-Medium',*/}
          {/*        }}*/}
          {/*        activeItemStyle={{*/}
          {/*          backgroundColor: colorConfig.store.defaultColor,*/}
          {/*        }}*/}
          {/*        itemStyle={{*/}
          {/*          marginVertical: 4,*/}
          {/*          backgroundColor: 'white',*/}
          {/*          borderColor: 'gray',*/}
          {/*        }}*/}
          {/*        labelStyle={{*/}
          {/*          fontFamily: 'Poppins-Regular',*/}
          {/*          fontSize: 14,*/}
          {/*        }}*/}
          {/*        onOpen={() => {*/}
          {/*          this.setState({openTimePicker: true});*/}
          {/*        }}*/}
          {/*        onClose={() => {*/}
          {/*          this.setState({openTimePicker: false});*/}
          {/*        }}*/}
          {/*        onChangeItem={item => {*/}
          {/*          this.setState({time: item.value});*/}
          {/*        }}*/}
          {/*      />*/}
          {/*      /!*<Picker*!/*/}
          {/*      /!*  selectedValue={time}*!/*/}
          {/*      /!*  style={{width: '100%'}}*!/*/}
          {/*      /!*  onValueChange={(itemValue, itemIndex) =>*!/*/}
          {/*      /!*    this.setState({time: itemValue})*!/*/}
          {/*      /!*  }>*!/*/}
          {/*      /!*  {this.getOperationalHours()}*!/*/}
          {/*      /!*</Picker>*!/*/}
          {/*    </View>*/}
          {/*  </View>*/}
          {/*)}*/}

          <TouchableOpacity
            onPress={this.submit}
            style={{
              marginTop: 40,
              backgroundColor: colorConfig.store.defaultColor,
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
            }}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Poppins-Medium',
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
  timeslots: state.orderReducer.timeslot.timeslots,
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
    fontFamily: 'Poppins-Medium',
    color: colorConfig.store.titleSelected,
    fontSize: 16,
  },
  notSelectedText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: colorConfig.pageIndex.grayColor,
  },
  notSelectedTextSmall: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colorConfig.pageIndex.grayColor,
  },
  selectedTextSmall: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: colorConfig.store.title,
  },
  selectedText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 19,
    color: colorConfig.store.title,
  },
  selectedTextTime: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: colorConfig.store.title,
  },
  notSelectedTextTime: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: colorConfig.pageIndex.grayColor,
  },
  cardNotSelected: {
    backgroundColor: colorConfig.store.containerColor,
    borderRadius: 5,
    width: 75,
    maxWidth: 75,
    height: 100,
    maxHeight: 100,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colorConfig.store.titleSelected,
  },
  cardSelected: {
    backgroundColor: colorConfig.store.thirdColor,
    borderRadius: 5,
    width: 75,
    maxWidth: 75,
    height: 100,
    maxHeight: 100,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colorConfig.store.titleSelected,
  },
  timeSelected: {
    backgroundColor: colorConfig.store.thirdColor,
    borderRadius: 5,
    width: 100,
    maxWidth: 100,
    height: 60,
    maxHeight: 60,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colorConfig.store.titleSelected,
  },
  timeNotSelected: {
    backgroundColor: colorConfig.store.containerColor,
    borderRadius: 5,
    width: 100,
    maxWidth: 100,
    height: 60,
    maxHeight: 60,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colorConfig.store.titleSelected,
  },
});
