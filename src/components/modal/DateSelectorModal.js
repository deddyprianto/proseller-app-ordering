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

import {getTimeSlot, setTimeSlotSelected} from '../../actions/order.action';
import Theme from '../../theme';
import GlobalText from '../globalText';

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
      padding: 8,
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
      // marginHorizontal: 6,
    },
    touchableItemAvailable: {
      width: 53,
      // borderWidth: 1,
      borderColor: colorConfig.primaryColor,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      // marginHorizontal: 6,
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
      // marginHorizontal: 6,
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
  };

  return styles;
};

const DateSelectorModal = ({open, handleClose, value}) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [seeMore, setSeeMore] = useState(false);
  const [isOpenTimeSelector, setIsOpenTimeSelector] = useState(false);
  const [initDate, setInitDate] = useState(null);
  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );

  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);

  useEffect(() => {
    const loadData = async () => {
      const clientTimezone = Math.abs(new Date().getTimezoneOffset());
      const date = moment().format('YYYY-MM-DD');
      const timeSlot = await dispatch(
        getTimeSlot({
          outletId: defaultOutlet.id,
          date,
          clientTimezone,
          orderingMode: basket.orderingMode,
        }),
      );
      setAvailableDates(timeSlot);
      let availDate = value.date;
      const currentDate = availDate
        ? moment(availDate).format('ddd DD MMMM YYYY')
        : moment().format('ddd DD MMMM YYYY');
      setSelectedDate(currentDate);
    };

    loadData();
  }, [open]);

  useEffect(() => {
    const selectedDateFormatter = moment(selectedDate).format('YYYY-MM-DD');
    if (!isEmptyArray(availableDates)) {
      const dateTimes = availableDates.find(
        value => value.date === selectedDateFormatter,
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

  useEffect(() => {
    let dateTime = '';
    if (initDate) {
      dateTime = moment(initDate).subtract(1, 'day');
    } else {
      dateTime = moment().subtract(1, 'day');
    }

    const result = Array(5)
      .fill(0)
      .map(() => {
        return dateTime.add(1, 'day').format('ddd DD MMMM YYYY');
      });
    setDates(result);
  }, [seeMore, initDate]);

  useEffect(() => {
    if (value?.date) {
      setInitDate(value.date);
    }
  }, [value]);

  const handleSave = async () => {
    await dispatch(
      setTimeSlotSelected({date: selectedDate, time: selectedTime}),
    );
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

    const dateFormatter = moment(item).format('YYYY-MM-DD');

    const available =
      !isEmptyArray(availableDates) &&
      availableDates?.find(value => value?.date === dateFormatter);

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
    return (
      <View style={styles.viewSeeMore}>
        <Text style={styles.textChooseDate}>Choose Date</Text>
        <TouchableOpacity
          onPress={() => {
            handleOpenCalender();
          }}>
          <Text style={styles.textSeeMore}>See More Date</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderBody = () => {
    return (
      <View style={styles.body}>
        {renderSeeMore()}
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
        <GlobalText style={styles.ts}>Timeslot</GlobalText>
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
    const style = disabled
      ? styles.touchableSaveDisabled
      : styles.touchableSave;

    return (
      <TouchableOpacity
        style={style}
        disabled={disabled}
        onPress={() => {
          handleSave();
        }}>
        <Text style={styles.textSave}>SAVE</Text>
      </TouchableOpacity>
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
          handleOnChange={value => {
            setSelectedDate(moment(value).format('ddd DD MMMM YYYY'));
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
        onPress={() => {
          handleDeliveryTimeListItemSelected(item);
        }}>
        <Text style={styles.listTime}>{item?.time}</Text>
      </TouchableOpacity>
    );
  };

  const renderTimeListModal = () => {
    if (!isEmptyArray(times)) {
      const result = times.map(item => {
        if (item?.isAvailable) {
          return renderDeliveryTimeListItem(item);
        }
      });

      return (
        <Provider>
          <Portal>
            <Dialog
              visible={isOpenTimeSelector}
              onDismiss={handleCloseDeliveryTimes}
              style={styles.viewTimeListModal}>
              <ScrollView>{result}</ScrollView>
            </Dialog>
          </Portal>
        </Provider>
      );
    }
  };

  return (
    <Provider>
      <Portal>
        <Dialog visible={open} onDismiss={handleClose} style={styles.root}>
          {renderHeader()}
          <View style={styles.divider} />
          {renderBody()}
          {renderFooter()}
        </Dialog>
        {renderCalender()}
        {renderTimeListModal()}
      </Portal>
    </Provider>
  );
};

export default DateSelectorModal;
