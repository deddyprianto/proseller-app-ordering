import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Dialog, Portal, Provider} from 'react-native-paper';
import colorConfig from '../../config/colorConfig';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import CalenderModal from './CalenderModal';
import moment from 'moment';
import {isEmptyObject} from '../../helper/CheckEmpty';

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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  footer: {
    paddingHorizontal: 35,
  },
  textDay: {
    fontSize: 8,
    color: '#B7B7B7',
    fontWeight: 'bold',
  },
  textDate: {
    fontSize: 10,
    color: '#B7B7B7',
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
    fontSize: 10,
    color: colorConfig.primaryColor,
  },
  textMonthSelected: {
    fontSize: 8,
    color: colorConfig.primaryColor,
    fontWeight: 'bold',
  },
  textSave: {
    color: 'white',
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
  touchableSave: {
    paddingVertical: 10,
    backgroundColor: colorConfig.primaryColor,
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
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    marginVertical: 4,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#D6D6D6',
  },
};

const DeliveryDateSelectorModal = ({open, handleClose}) => {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selected, setSelected] = useState({});
  const [seeMore, setSeeMore] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      const item = selectedDate.split(' ');
      const date = item[1];
      const month = item[2];
      const year = item[3];

      const test = moment()
        .date(date)
        .month(month)
        .year(year)
        .subtract(1, 'day');

      const result = Array(5)
        .fill(0)
        .map(() => {
          const a = test.add(1, 'day').format('ddd DD MMMM');
          return a;
        });

      setDates(result);
    }
  }, [selectedDate]);

  const handleOpenCalender = () => {
    setSeeMore(true);
  };

  const handleCloseCalender = () => {
    setSeeMore(false);
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text>Choose Delivery Date</Text>
      </View>
    );
  };

  const renderDeliveryDateItem = item => {
    const itemDate = item.split(' ');

    const day = itemDate[0];
    const date = itemDate[1];
    const month = itemDate[2];

    const active = selected === item;
    const styleItem = active
      ? styles.touchableItemSelected
      : styles.touchableItem;
    const styleMonth = active ? styles.textMonthSelected : styles.textMonth;
    const styleDay = active ? styles.textDaySelected : styles.textDay;
    const styleDate = active ? styles.textDateSelected : styles.textDate;

    return (
      <TouchableOpacity
        style={styleItem}
        onPress={() => {
          setSelected(item);
        }}>
        <Text style={styleDay}>{day}</Text>
        <View style={styles.circle}>
          <Text style={styleDate}>{date}</Text>
        </View>
        <Text style={styleMonth}>{month}</Text>
      </TouchableOpacity>
    );
  };

  const renderDeliveryDate = () => {
    const result = dates.map((test, index) => {
      return renderDeliveryDateItem(test);
    });

    return <View style={styles.body}>{result}</View>;
  };

  const renderSeeMore = () => {
    return (
      <View style={styles.viewSeeMore}>
        <Text style={styles.textChooseDeliveryDate}>Choose Delivery Date</Text>
        <TouchableOpacity
          onPress={() => {
            handleOpenCalender();
          }}>
          <Text style={styles.textSeeMore}>See More</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderBody = () => {
    return (
      <View>
        {renderSeeMore()}
        <View style={{marginTop: 16}} />
        {renderDeliveryDate()}
      </View>
    );
  };

  const renderDeliveryTime = () => {
    return (
      <View style={styles.viewDeliveryTime}>
        <Text style={styles.textDeliveryTime}>Delivery Time</Text>
        <IconAntDesign style={styles.iconCaretDown} name="caretdown" />
      </View>
    );
  };

  const renderSaveButton = () => {
    return (
      <TouchableOpacity style={styles.touchableSave}>
        <Text style={styles.textSave}>SAVE</Text>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        {renderDeliveryTime()}
        <View style={{marginTop: 16}} />
        {renderSaveButton()}
      </View>
    );
  };

  const renderCalender = () => {
    return (
      <CalenderModal
        open={seeMore}
        handleClose={() => {
          handleCloseCalender();
        }}
        handleOnChange={value => {
          console.log('ROY', value);
          setSelectedDate(value);
        }}
      />
    );
  };

  return (
    <Provider>
      <Portal>
        <Dialog visible={open} onDismiss={handleClose} style={styles.root}>
          {renderHeader()}
          <View style={styles.divider} />
          <View style={{marginTop: 20}} />
          {renderBody()}
          <View style={{marginTop: 16}} />
          {renderFooter()}
          <View style={{marginTop: 16}} />
        </Dialog>
        {renderCalender()}
      </Portal>
    </Provider>
  );
};

export default DeliveryDateSelectorModal;
