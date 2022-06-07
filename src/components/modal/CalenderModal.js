/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Dialog, Portal, Provider} from 'react-native-paper';
import colorConfig from '../../config/colorConfig';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

const styles = {
  root: {
    borderRadius: 8,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 16,
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textDay: {
    fontSize: 8,
    color: '#B7B7B7',
    fontWeight: 'bold',
  },
  textDate: {
    fontSize: 9,
    color: 'black',
  },
  textMonth: {
    fontSize: 8,
    color: '#B7B7B7',
    fontWeight: 'bold',
  },
  textDaySelected: {
    fontSize: 8,
    color: colorConfig.primaryColor,
    fontWeight: 'bold',
  },
  textDateSelected: {
    fontSize: 9,
    color: 'white',
  },
  textMonthSelected: {
    fontSize: 8,
    color: colorConfig.primaryColor,
    fontWeight: 'bold',
  },
  textApply: {
    color: 'white',
    fontSize: 12,
  },
  textClose: {
    fontSize: 12,
  },
  textChooseDeliveryDate: {
    fontSize: 12,
  },
  textSeeMore: {
    fontSize: 12,
    color: colorConfig.primaryColor,
    textDecorationLine: 'underline',
  },
  textDeliveryTime: {
    fontSize: 12,
    fontWeight: '400',
  },
  viewSeeMore: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
  },
  viewDeliveryTime: {
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
  touchableItem: {
    width: 53,
    borderWidth: 1,
    borderColor: '#B7B7B7',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 6,
  },
  touchableItemSelected: {
    width: 53,
    borderWidth: 1,
    borderColor: colorConfig.primaryColor,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 6,
  },
  touchableApply: {
    width: '49%',
    paddingVertical: 10,
    backgroundColor: colorConfig.primaryColor,
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
  iconCaretDown: {
    width: 14,
    height: 14,
    color: colorConfig.primaryColor,
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
    backgroundColor: colorConfig.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    marginVertical: 6,
    marginHorizontal: 6,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#D6D6D6',
  },
};

const DeliveryDateSelectorModal = ({
  open,
  value,
  handleClose,
  handleOnChange,
}) => {
  const [dates, setDates] = useState([]);
  const [months, setMonths] = useState([]);

  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const [isMonthSelector, setIsMonthSelector] = useState(false);

  const days = ['San', 'Mon', 'Tue', 'Wed', 'Tur', 'Fri', 'Sat'];

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
              .format('DD MMMM'),
          ),
      );
    }

    return calender;
  };

  useEffect(() => {
    const currentYear = moment(value).format('YYYY');
    const currentMonth = moment(value).format('MMM');
    const currentDate = Number(moment(value).format('DD'));
    const monthList = moment.months();

    setSelectedYear(currentYear);
    setSelectedMonth(currentMonth);
    setSelectedDate(currentDate);

    setMonths(monthList);
  }, [value]);

  useEffect(() => {
    const currentDates = getDates();
    setDates(currentDates);
  }, [value, selectedYear, selectedMonth]);

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text>Calender</Text>
      </View>
    );
  };

  const renderDeliveryDayItem = item => {
    return (
      <View style={styles.circle}>
        <Text style={{fontSize: 9, color: colorConfig.primaryColor}}>
          {item}
        </Text>
      </View>
    );
  };

  const renderDeliveryDay = () => {
    const result = days.map(test => {
      return renderDeliveryDayItem(test);
    });

    return (
      <View style={{display: 'flex', flexDirection: 'row'}}>{result}</View>
    );
  };

  const handleMonthSlider = direction => {
    if (direction === 'last') {
      const subtractResult = moment(value)
        .month(selectedMonth)
        .year(selectedYear)
        .subtract(1, 'months');

      const month = moment(subtractResult).format('MMM');
      const year = moment(subtractResult).format('YYYY');

      setSelectedMonth(month);
      setSelectedYear(year);
    }

    if (direction === 'next') {
      const addResult = moment(value)
        .month(selectedMonth)
        .year(selectedYear)
        .add(1, 'months');

      const month = moment(addResult).format('MMM');
      const year = moment(addResult).format('YYYY');

      setSelectedMonth(month);
      setSelectedYear(year);
    }
  };

  const renderMonthSlider = () => {
    return (
      <View
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => {
            handleMonthSlider('last');
          }}>
          <IconMaterialIcons
            style={{fontSize: 16}}
            name="keyboard-arrow-left"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIsMonthSelector(true);
          }}>
          <Text>
            <Text style={{fontSize: 9}}>{selectedMonth}, </Text>
            <Text style={{fontSize: 9}}>{selectedYear}</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleMonthSlider('next');
          }}>
          <IconMaterialIcons
            style={{fontSize: 16}}
            name="keyboard-arrow-right"
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderDeliveryDateItem = item => {
    const itemDate = item.split(' ');
    const date = Number(itemDate[0]);
    const month = itemDate[1];

    const isActive = selectedDate === date;
    const isThisMonth = month === selectedMonth;

    const styleDate = !isThisMonth
      ? {
          fontSize: 8,
          color: '#667080',
        }
      : isActive
      ? styles.textDateSelected
      : styles.textDate;

    const styleCircle =
      isActive && isThisMonth ? styles.circleActive : styles.circle;

    return (
      <TouchableOpacity
        disabled={!isThisMonth}
        onPress={() => {
          setSelectedDate(date);
        }}>
        <View style={styleCircle}>
          <Text style={styleDate}>{date}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDeliveryDate = () => {
    const result = dates.map((test, index) => {
      return (
        <View style={{display: 'flex', flexDirection: 'row'}}>
          {test.map(item => {
            return renderDeliveryDateItem(item);
          })}
        </View>
      );
    });

    return (
      <View style={styles.body}>
        {renderDeliveryDay()}
        {result}
      </View>
    );
  };

  const renderDate = () => {
    return (
      <View>
        {renderMonthSlider()}
        <View style={{marginTop: 20}} />
        {renderDeliveryDate()}
      </View>
    );
  };

  const handleYearSlider = value => {
    const currentYear = new Date().getFullYear();

    if (value <= currentYear) {
      setSelectedYear(value);
    }
  };

  const renderYearSlider = () => {
    return (
      <View
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => {
            handleYearSlider(selectedYear - 1);
          }}>
          <IconMaterialIcons
            style={{fontSize: 16}}
            name="keyboard-arrow-left"
          />
        </TouchableOpacity>
        <Text style={{fontSize: 9}}>{selectedYear}</Text>
        <TouchableOpacity
          onPress={() => {
            handleYearSlider(selectedYear + 1);
          }}>
          <IconMaterialIcons
            style={{fontSize: 16}}
            name="keyboard-arrow-right"
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderDeliveryMonthItem = item => {
    const active = selectedDate === item;
    const styleDate = active
      ? styles.textDateSelected
      : {fontSize: 10, color: 'black'};
    const styleCircle = active && {
      width: 30,
      height: 30,
      backgroundColor: colorConfig.primaryColor,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      marginVertical: 6,
      marginHorizontal: 6,
    };

    return (
      <TouchableOpacity
        style={{
          width: 70,
          height: 70,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          setIsMonthSelector(false);
          setSelectedMonth(item);
        }}>
        <View style={styleCircle}>
          <Text style={styleDate}>{item.substring(0, 3)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDeliveryMonth = () => {
    const result = months.map(month => {
      return renderDeliveryMonthItem(month);
    });

    return <View style={styles.body}>{result}</View>;
  };

  const renderMonth = () => {
    return (
      <View>
        {renderYearSlider()}
        <View style={{marginTop: 20}} />
        {renderDeliveryMonth()}
      </View>
    );
  };

  const renderBody = () => {
    if (isMonthSelector) {
      return <View>{renderMonth()}</View>;
    }
    return <View>{renderDate()}</View>;
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

  const handleApplyButton = () => {
    const result = moment()
      .date(selectedDate)
      .month(selectedMonth)
      .year(selectedYear)
      .format('ddd DD MMMM YYYY');

    handleOnChange(result);
    handleClose();
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
          <View style={{marginTop: 20}} />
          {renderBody()}
          <View style={{marginTop: 16}} />
          {renderFooter()}
          <View style={{marginTop: 16}} />
        </Dialog>
      </Portal>
    </Provider>
  );
};

export default DeliveryDateSelectorModal;
