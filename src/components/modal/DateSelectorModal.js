/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Text, TouchableOpacity, View, ScrollView} from 'react-native';
import {Dialog, Portal, Provider} from 'react-native-paper';
import colorConfig from '../../config/colorConfig';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import CalenderModal from './CalenderModal';
import moment from 'moment';
import {isEmptyArray} from '../../helper/CheckEmpty';

import {resetProvider, setTimeSlotSelected} from '../../actions/order.action';
import Theme from '../../theme';
import GlobalText from '../globalText';
import GlobalButton from '../button/GlobalButton';
import usePayment from '../../hooks/payment/usePayment';
import LoadingScreen from '../loadingScreen';
import useCalculation from '../../hooks/calculation/useCalculation';
import InformationSvg from '../../assets/svg/InformationSvg';

const useStyles = () => {
  const theme = Theme();
  const styles = {
    root: {
      borderRadius: 8,
    },
    header: {
      paddingVertical: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    body: {
      marginTop: 16,
      paddingHorizontal: 16,
    },
    footer: {
      marginVertical: 16,
      paddingHorizontal: 16,
    },
    textSave: {
      color: 'white',
      fontSize: 12,
    },
    textChooseDate: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textTitleChooseDate: {
      color: theme.colors.primary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textSeeMore: {
      fontSize: theme.fontSize[16],
      color: theme.colors.primary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textDeliveryTime: {
      fontSize: 12,
      fontWeight: '400',
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewSeeMore: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    viewDeliveryTime: {
      marginBottom: 16,
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: 11,
      paddingHorizontal: 16,
      borderColor: '#B7B7B7',
    },
    viewTimeListModal: {
      borderRadius: 8,
      paddingVertical: 13,
    },
    viewDate: {
      marginTop: 16,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },
    textDayAvailable: {
      fontSize: 12,
      color: 'black',
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textDateAvailable: {
      fontSize: 22,
      color: 'black',
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textMonthAvailable: {
      fontSize: 12,
      color: 'black',
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textDayUnavailable: {
      fontSize: 12,
      color: theme.colors.greyScale5,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textDateUnavailable: {
      fontSize: 22,
      color: theme.colors.greyScale5,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textMonthUnavailable: {
      fontSize: 12,
      color: theme.colors.greyScale5,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textDaySelected: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textDateSelected: {
      fontSize: 22,
      color: 'white',
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textMonthSelected: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    touchableItemSelected: {
      width: 53,
      borderWidth: 1,
      borderColor: colorConfig.primaryColor,
      backgroundColor: colorConfig.primaryColor,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
    },
    touchableItemAvailable: {
      width: 53,
      // borderWidth: 1,
      borderColor: colorConfig.primaryColor,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
    },
    touchableItemUnavailable: {
      width: 53,
      // borderWidth: 1,
      borderColor: '#B7B7B7',
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      backgroundColor: theme.colors.greyScale4,
    },
    circleSelected: {
      width: 26,
      height: 26,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      marginVertical: 4,
    },
    circleAvailable: {
      width: 26,
      height: 26,
      backgroundColor: '#F9F9F9',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      marginVertical: 4,
    },
    circleUnavailable: {
      width: 26,
      height: 26,
      backgroundColor: '#F9F9F9',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      marginVertical: 4,
    },

    touchableSave: {
      paddingVertical: 10,
      backgroundColor: colorConfig.primaryColor,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
    },
    touchableSaveDisabled: {
      paddingVertical: 10,
      backgroundColor: '#B7B7B7',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
    },
    iconCaretDown: {
      width: 14,
      height: 14,
      color: colorConfig.primaryColor,
    },
    divider: {
      borderTopWidth: 1,
      borderTopColor: '#D6D6D6',
    },
    ct: {
      fontSize: 16,
      fontFamily: theme.fontFamily.poppinsBold,
    },
    ts: {
      fontSize: 14,
      fontFamily: theme.fontFamily.poppinsMedium,
      marginTop: 8,
    },
    listTime: {
      fontSize: 14,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    required: {
      fontFamily: theme.fontFamily.poppinsMedium,
      color: theme.colors.errorColor,
    },
    noMarginVertical: {
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      width: '48%',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    pv8: {
      paddingVertical: 8,
    },
    ph16: {
      paddingHorizontal: 16,
    },
    informationLastDelivery: {
      marginHorizontal: 16,
      marginTop: 16,
      padding: 8,
      backgroundColor: theme.colors.accent,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 4,
      flexWrap: 'wrap',
    },
    informationText: {
      fontSize: 12,
      fontFamily: theme.fontFamily.poppinsSemiBold,
      marginLeft: 8,
    },
  };

  return styles;
};

const DateSelectorModal = ({
  open,
  handleClose,
  value,
  preOrderDate,
  availableDates,
}) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const {getDeliveryProviderFee, isLoading} = usePayment();
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const {isDeliveryAvailable} = useCalculation();
  const [seeMore, setSeeMore] = useState(false);
  const [isOpenTimeSelector, setIsOpenTimeSelector] = useState(false);
  const [initDate, setInitDate] = useState(null);

  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);
  const maxDate = useSelector(
    state => state.orderReducer?.latestTimeSlotDate?.latestTime,
  );

  useEffect(() => {
    const selectedDateFormatter = moment(selectedDate).format('YYYY-MM-DD');
    if (!isEmptyArray(availableDates)) {
      setInitDate(availableDates[0]?.date);
      const dateTimes = availableDates.find(
        val => val.date === selectedDateFormatter,
      );
      const timeSlot = dateTimes?.timeSlot || [];
      const availableTimeSlot = timeSlot?.filter(time => time.isAvailable);

      if (!isEmptyArray(availableTimeSlot)) {
        setSelectedTime(availableTimeSlot[0]?.time);
      } else {
        setSelectedTime('');
      }
      setTimes(timeSlot);
    }
  }, [availableDates, selectedDate]);

  const initAllDate = async date => {
    let dateTime = '';
    if (initDate) {
      dateTime = await moment(initDate).subtract(1, 'day');
    } else {
      dateTime = await moment().subtract(1, 'day');
    }

    if (selectedDate.length > 0) {
      dateTime = await moment(selectedDate).subtract(1, 'day');
    }
    const result = await Array(5)
      .fill(0)
      .map(() => {
        return dateTime.add(1, 'day').format('ddd DD MMMM YYYY');
      });
    setDates(result);
  };

  useEffect(() => {
    initAllDate();
  }, [seeMore, initDate, availableDates]);
  useEffect(() => {
    if (value?.date) {
      setInitDate(value.date);
    }
  }, [value]);

  const handleSave = async () => {
    const joinDateTime = `${selectedDate}`;
    const newFormatDate = moment(joinDateTime).format('YYYY-MM-DD');
    await dispatch(
      setTimeSlotSelected({date: selectedDate, time: selectedTime}),
    );

    if (basket?.orderingMode === 'DELIVERY') {
      await dispatch(resetProvider());
      await getDeliveryProviderFee(newFormatDate);
    }
    handleClose();
  };

  const handleOpenCalender = () => {
    setSeeMore(true);
  };

  const handleCloseCalender = () => {
    setSeeMore(false);
  };

  const handleOpenDeliveryTimes = () => {
    setIsOpenTimeSelector(true);
  };

  const handleCloseDeliveryTimes = () => {
    setIsOpenTimeSelector(false);
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.textTitleChooseDate}>Choose Date & Time</Text>
      </View>
    );
  };

  const handleDateItemSelected = item => {
    setSelectedDate(item);
  };

  const renderDateItemSelected = ({day, date, month}) => {
    return (
      <TouchableOpacity style={styles.touchableItemSelected} activeOpacity={1}>
        <Text style={styles.textDaySelected}>{day}</Text>
        <Text style={styles.textDateSelected}>{date}</Text>
        <Text style={styles.textMonthSelected}>{month}</Text>
      </TouchableOpacity>
    );
  };

  const renderDateItemAvailable = ({item, day, date, month}) => {
    return (
      <TouchableOpacity
        style={styles.touchableItemAvailable}
        activeOpacity={1}
        onPress={() => {
          handleDateItemSelected(item);
        }}>
        <Text style={styles.textDayAvailable}>{day}</Text>
        <Text style={styles.textDateAvailable}>{date}</Text>
        <Text style={styles.textMonthAvailable}>{month}</Text>
      </TouchableOpacity>
    );
  };

  const renderDateItemUnavailable = ({day, date, month}) => {
    return (
      <TouchableOpacity
        style={styles.touchableItemUnavailable}
        activeOpacity={1}
        disabled>
        <Text style={styles.textDayUnavailable}>{day}</Text>
        <Text style={styles.textDateUnavailable}>{date}</Text>
        <Text style={styles.textMonthUnavailable}>{month}</Text>
      </TouchableOpacity>
    );
  };

  const renderDateItem = item => {
    let isCanDelivery = true;
    const today =
      moment(item).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');

    const day = today
      ? 'TODAY'
      : moment(item)
          .format('ddd')
          .toUpperCase();

    const date = moment(item).format('DD');
    const month = moment(item)
      .format('MMM')
      .toUpperCase();

    const selected = selectedDate === item;
    if (maxDate) {
      isCanDelivery = isDeliveryAvailable(maxDate, item);
    }
    const dateFormatter = moment(item).format('YYYY-MM-DD');

    const available =
      !isEmptyArray(availableDates) &&
      availableDates?.find(val => val?.date === dateFormatter) &&
      isCanDelivery;

    if (selected && available) {
      return renderDateItemSelected({item, day, date, month});
    } else if (available) {
      return renderDateItemAvailable({item, day, date, month});
    } else {
      return renderDateItemUnavailable({item, day, date, month});
    }
  };

  const renderDate = () => {
    const result = dates.map(date => {
      return renderDateItem(date);
    });

    return <View style={styles.viewDate}>{result}</View>;
  };

  const renderSeeMore = () => {
    if (availableDates?.length > 5) {
      return (
        <TouchableOpacity
          onPress={() => {
            handleOpenCalender();
          }}>
          <Text style={styles.textSeeMore}>See More Date</Text>
        </TouchableOpacity>
      );
    }
  };

  const renderChooseDate = () => {
    return (
      <View style={styles.viewSeeMore}>
        <Text style={styles.textChooseDate}>Choose Date</Text>
        {renderSeeMore()}
      </View>
    );
  };

  const renderBody = () => {
    return (
      <View style={styles.body}>
        {renderChooseDate()}
        {renderDate()}
      </View>
    );
  };

  const renderDeliveryTime = () => {
    const disabled = isEmptyArray(times);
    const text = selectedTime || 'Choose Time';

    return (
      <View>
        <GlobalText style={styles.ct}>Choose Time</GlobalText>
        <GlobalText style={styles.ts}>
          Timeslot <GlobalText style={styles.required}>*</GlobalText>{' '}
        </GlobalText>
        <TouchableOpacity
          disabled={disabled}
          onPress={() => {
            handleOpenDeliveryTimes();
          }}
          style={styles.viewDeliveryTime}>
          <Text style={styles.textDeliveryTime}>{text}</Text>
          <IconAntDesign style={styles.iconCaretDown} name="caretdown" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderSaveButton = () => {
    const disabled = !selectedTime || !selectedDate;

    return (
      <View style={styles.row}>
        <GlobalButton
          buttonStyle={styles.noMarginVertical}
          isOutline
          title="Cancel"
          onPress={handleClose}
        />
        <GlobalButton
          disabled={disabled}
          buttonStyle={styles.noMarginVertical}
          title="Save"
          onPress={handleSave}
        />
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        {renderDeliveryTime()}
        {renderSaveButton()}
      </View>
    );
  };
  const renderCalender = () => {
    if (seeMore) {
      return (
        <CalenderModal
          open={seeMore}
          value={selectedDate}
          availableDates={availableDates}
          handleClose={() => {
            handleCloseCalender();
          }}
          handleOnChange={val => {
            initAllDate(val);
            setSelectedDate(moment(val).format('ddd DD MMMM YYYY'));
          }}
        />
      );
    }
  };

  const handleDeliveryTimeListItemSelected = item => {
    setSelectedTime(item?.time);
    setIsOpenTimeSelector(false);
  };

  const renderDeliveryTimeListItem = item => {
    return (
      <TouchableOpacity
        style={[styles.pv8, styles.ph16]}
        onPress={() => {
          handleDeliveryTimeListItemSelected(item);
        }}>
        <Text style={styles.listTime}>{item?.time}</Text>
      </TouchableOpacity>
    );
  };
  const renderTimeListModal = () => {
    if (!isEmptyArray(times)) {
      const result = times.filter(item => item.isAvailable);
      return (
        <Provider>
          <Portal>
            <Dialog
              visible={isOpenTimeSelector}
              onDismiss={handleCloseDeliveryTimes}
              style={styles.viewTimeListModal}>
              <ScrollView>
                {result?.map(time => renderDeliveryTimeListItem(time))}
              </ScrollView>
            </Dialog>
          </Portal>
        </Provider>
      );
    }
  };

  const renderMessageLastDelivery = () => {
    if (maxDate) {
      return (
        <View style={styles.informationLastDelivery}>
          <InformationSvg />
          <GlobalText style={styles.informationText}>
            AVAILABLE DATES : {moment(initDate).format('DD MMM YY')} -{' '}
            {moment(maxDate).format('DD MMM YY')}
          </GlobalText>
        </View>
      );
    }
    return null;
  };

  return (
    <>
      <LoadingScreen loading={isLoading} />
      <Provider>
        <Portal>
          <Dialog visible={open} onDismiss={handleClose} style={styles.root}>
            {renderHeader()}
            <View style={styles.divider} />
            {renderMessageLastDelivery()}
            {renderBody()}
            {renderFooter()}
          </Dialog>
          {renderCalender()}
          {renderTimeListModal()}
        </Portal>
      </Provider>
    </>
  );
};

export default DateSelectorModal;
