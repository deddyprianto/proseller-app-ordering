import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Dialog, Portal, Provider} from 'react-native-paper';
import colorConfig from '../../config/colorConfig';
import IconAntDesign from 'react-native-vector-icons/AntDesign';

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
  const [selected, setSelected] = useState({});

  const tests = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}];

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text>Choose Delivery Date</Text>
      </View>
    );
  };

  const renderDeliveryDateItem = item => {
    const active = selected?.id === item?.id;
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
        <Text style={styleDay}>Today</Text>
        <View style={styles.circle}>
          <Text style={styleDate}>10</Text>
        </View>
        <Text style={styleMonth}>MAR</Text>
      </TouchableOpacity>
    );
  };

  const renderDeliveryDate = () => {
    const result = tests.map((test, index) => {
      if (index < 5) {
        return renderDeliveryDateItem(test);
      }
    });

    return <View style={styles.body}>{result}</View>;
  };

  const renderSeeMore = () => {
    return (
      <View
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 22,
        }}>
        <Text style={{fontSize: 12}}>Choose Delivery Date</Text>
        <Text
          style={{
            fontSize: 12,
            color: colorConfig.primaryColor,
            textDecorationLine: 'underline',
          }}>
          See More
        </Text>
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
      <View
        style={{
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
        }}>
        <Text style={{fontSize: 12, fontWeight: '400'}}>Delivery Time</Text>
        <IconAntDesign
          style={{width: 14, height: 14, color: colorConfig.primaryColor}}
          name="caretdown"
        />
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
      </Portal>
    </Provider>
  );
};

export default DeliveryDateSelectorModal;
