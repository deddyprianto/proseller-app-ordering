/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, Image, StyleSheet} from 'react-native';
import {Dialog, Portal, Provider} from 'react-native-paper';
import moment from 'moment';

import Theme from '../../theme';
import appConfig from '../../config/appConfig';
import {isEmptyArray} from '../../helper/CheckEmpty';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      elevation: 1,
      borderRadius: 8,
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    header: {
      marginBottom: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    body: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    footer: {
      marginTop: 16,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    textDay: {
      fontSize: 9,
      color: theme.colors.textQuaternary,
    },
    textDate: {
      fontSize: 9,
      color: 'black',
    },
    textDateDisabled: {
      fontSize: 9,
      color: '#667080',
    },
    textDateFromAnotherMonth: {
      fontSize: 7,
      color: '#667080',
    },
    textDateSelected: {
      fontSize: 9,
      color: theme.colors.textSecondary,
    },
    textMonth: {
      fontSize: 10,
      color: theme.colors.textPrimary,
    },
    textMonthSelected: {
      fontSize: 10,
      color: theme.colors.textSecondary,
    },
    textSlider: {
      fontSize: 9,
    },
    textApply: {
      color: theme.colors.textSecondary,
      fontSize: 12,
    },
    textClose: {
      fontSize: 12,
    },
    viewDays: {
      marginTop: 16,
      width: '80%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    viewSlider: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    viewMonthItem: {
      width: 70,
      height: 70,
      alignItems: 'center',
      justifyContent: 'center',
    },
    viewWrapDateItem: {
      display: 'flex',
      flexDirection: 'row',
    },
    touchableApply: {
      width: '49%',
      paddingVertical: 10,
      backgroundColor: theme.colors.textQuaternary,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
    },
    touchableCancel: {
      width: '49%',
      paddingVertical: 10,
      backgroundColor: '#F1F1F1',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
    },
    circle: {
      width: 26,
      height: 26,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 6,
      marginHorizontal: 6,
    },
    circleActive: {
      width: 26,
      height: 26,
      backgroundColor: theme.colors.textQuaternary,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      marginVertical: 6,
      marginHorizontal: 6,
    },
    iconArrow: {
      width: 10,
      height: 10,
    },
  });
  return styles;
};

const DateSelectorModal = ({
  open,
  value,
  availableDates,
  handleClose,
  handleOnChange,
}) => {
  const styles = useStyles();
  const [dates, setDates] = useState([]);
  const [months, setMonths] = useState([]);

  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const [isMonthSelector, setIsMonthSelector] = useState(false);

  const days = ['San', 'Mon', 'Tue', 'Wed', 'Tur', 'Fri', 'Sat'];

  const formatDate = 'ddd DD MMM YYYY';
  const formatMonth = 'MMM';
  const formatYear = 'YYYY';

  const handleDateFormatter = date => {
    const result = moment(date).format(formatDate);
    return result;
  };

  const getDates = () => {
    let calender = [];

    const startDate = moment()
      .month(selectedMonth)
      .year(selectedYear)
      .clone()
      .startOf('month')
      .startOf('week');

    const endDate = moment()
      .month(selectedMonth)
      .year(selectedYear)
      .clone()
      .endOf('month');

    const day = startDate.clone().subtract(1, 'day');

    while (day.isBefore(endDate, 'day')) {
      calender.push(
        Array(7)
          .fill(0)
          .map(() =>
            day
              .add(1, 'day')
              .clone()
              .format(formatDate),
          ),
      );
    }

    return calender;
  };

  useEffect(() => {
    const currentYear = moment(value).format(formatYear);
    const currentMonth = moment(value).format(formatMonth);
    const currentDate = moment(value).format(formatDate);
    const monthList = moment.monthsShort();

    setSelectedYear(currentYear);
    setSelectedMonth(currentMonth);
    setSelectedDate(currentDate);

    setMonths(monthList);
  }, [value]);

  useEffect(() => {
    const currentDates = getDates();
    setDates(currentDates);
  }, [value, selectedYear, selectedMonth]);

  const handleApplyButton = () => {
    const result = moment(selectedDate).format(formatDate);

    handleOnChange(result);
    handleClose();
  };

  const handleMonthSlider = direction => {
    if (direction === 'last') {
      const subtractResult = moment(value)
        .month(selectedMonth)
        .year(selectedYear)
        .subtract(1, 'months');

      const month = moment(subtractResult).format(formatMonth);
      const year = moment(subtractResult).format(formatYear);

      setSelectedMonth(month);
      setSelectedYear(year);
    }

    if (direction === 'next') {
      const addResult = moment(value)
        .month(selectedMonth)
        .year(selectedYear)
        .add(1, 'months');

      const month = moment(addResult).format(formatMonth);
      const year = moment(addResult).format(formatYear);

      setSelectedMonth(month);
      setSelectedYear(year);
    }
  };

  const handleYearSlider = value => {
    const currentYear = new Date().getFullYear();

    if (value <= currentYear) {
      setSelectedYear(value);
    }
  };

  const handleAvailableDate = item => {
    const result =
      !isEmptyArray(availableDates) &&
      availableDates?.find(value => handleDateFormatter(value?.date) === item);

    return result;
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text>Calender</Text>
      </View>
    );
  };

  const renderIconArrowLeft = ({onClick}) => {
    return (
      <TouchableOpacity onPress={onClick}>
        <Image style={styles.iconArrow} source={appConfig.iconArrowLeft} />
      </TouchableOpacity>
    );
  };
  const renderIconArrowRight = ({onClick}) => {
    return (
      <TouchableOpacity onPress={onClick}>
        <Image style={styles.iconArrow} source={appConfig.iconArrowRight} />
      </TouchableOpacity>
    );
  };

  const renderDayItem = item => {
    return <Text style={styles.textDay}>{item}</Text>;
  };

  const renderDays = () => {
    const result = days.map(test => {
      return renderDayItem(test);
    });

    return <View style={styles.viewDays}>{result}</View>;
  };

  const renderMonthSlider = () => {
    return (
      <View style={styles.viewSlider}>
        {renderIconArrowLeft({
          onClick: () => {
            handleMonthSlider('last');
          },
        })}
        <TouchableOpacity
          onPress={() => {
            setIsMonthSelector(true);
          }}>
          <Text style={styles.textSlider}>
            <Text>{selectedMonth}, </Text>
            <Text>{selectedYear}</Text>
          </Text>
        </TouchableOpacity>
        {renderIconArrowRight({
          onClick: () => {
            handleMonthSlider('next');
          },
        })}
      </View>
    );
  };

  const renderDateItem = item => {
    const itemDate = item.split(' ');
    const date = Number(itemDate[1]);
    const month = itemDate[2];

    const isActive = selectedDate === item;
    const isThisMonth = selectedMonth === month;
    const available = handleAvailableDate(item);

    const styleDate = !isThisMonth
      ? styles.textDateFromAnotherMonth
      : isActive
      ? styles.textDateSelected
      : available
      ? styles.textDate
      : styles.textDateDisabled;

    const styleCircle =
      isActive && isThisMonth ? styles.circleActive : styles.circle;

    return (
      <TouchableOpacity
        disabled={!available}
        onPress={() => {
          setSelectedDate(item);
          setSelectedMonth(month);
        }}>
        <View style={styleCircle}>
          <Text style={styleDate}>{date}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDates = () => {
    const result = dates.map(date => {
      return (
        <View style={styles.viewWrapDateItem}>
          {date.map(item => {
            return renderDateItem(item);
          })}
        </View>
      );
    });

    return (
      <View style={styles.body}>
        {renderDays()}
        {result}
      </View>
    );
  };

  const renderBodyDate = () => {
    return (
      <View>
        {renderMonthSlider()}
        {renderDates()}
      </View>
    );
  };

  const renderYearSlider = () => {
    return (
      <View style={styles.viewSlider}>
        {renderIconArrowLeft({
          onClick: () => {
            handleYearSlider(selectedYear - 1);
          },
        })}
        <Text style={styles.textSlider}>{selectedYear}</Text>
        {renderIconArrowRight({
          onClick: () => {
            handleYearSlider(selectedYear + 1);
          },
        })}
      </View>
    );
  };

  const renderMonthItem = item => {
    const active = selectedMonth === item;
    const styleDate = active ? styles.textMonthSelected : styles.textMonth;
    const styleCircle = active && styles.circleActive;

    return (
      <TouchableOpacity
        style={styles.viewMonthItem}
        onPress={() => {
          setIsMonthSelector(false);
          setSelectedMonth(item);
        }}>
        <View style={styleCircle}>
          <Text style={styleDate}>{item}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMonth = () => {
    const result = months.map(month => {
      return renderMonthItem(month);
    });

    return <View style={styles.body}>{result}</View>;
  };

  const renderBodyMonth = () => {
    return (
      <View>
        {renderYearSlider()}
        {renderMonth()}
      </View>
    );
  };

  const renderBody = () => {
    if (isMonthSelector) {
      return renderBodyMonth();
    }
    return renderBodyDate();
  };

  const renderCancelButton = () => {
    return (
      <TouchableOpacity
        style={styles.touchableCancel}
        onPress={() => {
          handleClose();
        }}>
        <Text style={styles.textClose}>Cancel</Text>
      </TouchableOpacity>
    );
  };

  const renderApplyButton = () => {
    return (
      <TouchableOpacity
        style={styles.touchableApply}
        onPress={() => {
          handleApplyButton();
        }}>
        <Text style={styles.textApply}>Apply</Text>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        {renderCancelButton()}
        {renderApplyButton()}
      </View>
    );
  };

  return (
    <Provider>
      <Portal>
        <Dialog visible={open} onDismiss={handleClose} style={styles.root}>
          {renderHeader()}
          {renderBody()}
          {renderFooter()}
        </Dialog>
      </Portal>
    </Provider>
  );
};

export default DateSelectorModal;
