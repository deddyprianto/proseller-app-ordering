import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Dialog, Portal, Provider} from 'react-native-paper';
import colorConfig from '../../config/colorConfig';

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
  textName: {
    fontSize: 12,
    color: '#B7B7B7',
  },
  textPrice: {
    fontSize: 12,
    color: '#B7B7B7',
  },
  textCurrency: {
    fontSize: 8,
    color: '#B7B7B7',
  },
  textNameSelected: {
    fontSize: 12,
    color: colorConfig.primaryColor,
  },
  textPriceSelected: {
    fontSize: 12,
    color: colorConfig.primaryColor,
  },
  textCurrencySelected: {
    fontSize: 8,
    color: colorConfig.primaryColor,
  },
  textSave: {
    color: 'white',
    fontSize: 12,
  },
  touchableItem: {
    width: 81,
    height: 83,
    borderWidth: 1,
    borderColor: '#B7B7B7',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    margin: 2,
  },
  touchableItemSelected: {
    width: 81,
    height: 83,
    borderWidth: 1,
    borderColor: colorConfig.primaryColor,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    margin: 2,
  },
  touchableSave: {
    paddingVertical: 10,
    backgroundColor: colorConfig.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  viewTextNameAndPrice: {
    display: 'flex',
    flexDirection: 'row',
  },
  circle: {
    width: 40,
    height: 40,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#D6D6D6',
  },
};

const OrderingTypeSelectorModal = ({open, handleClose}) => {
  const [selected, setSelected] = useState({});

  const tests = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}];

  const orderingTypeItem = item => {
    const active = selected?.id === item?.id;
    const styleItem = active
      ? styles.touchableItemSelected
      : styles.touchableItem;
    const styleName = active ? styles.textNameSelected : styles.textName;
    const stylePrice = active ? styles.textPriceSelected : styles.textPrice;
    const styleCurrency = active ? styles.textPriceSelected : styles.textPrice;

    return (
      <TouchableOpacity
        style={styleItem}
        onPress={() => {
          setSelected(item);
        }}>
        <View style={styles.circle}>
          <View style={styles.viewTextNameAndPrice}>
            <Text style={stylePrice}>10</Text>
            <Text style={styleCurrency}>SGD</Text>
          </View>
        </View>
        <View style={{marginTop: 8}} />
        <Text style={styleName}>Delivery A</Text>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text>Choose Type</Text>
      </View>
    );
  };
  const renderBody = () => {
    const result = tests.map(test => {
      return orderingTypeItem(test);
    });

    return <View style={styles.body}>{result}</View>;
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity style={styles.touchableSave}>
          <Text style={styles.textSave}>SAVE</Text>
        </TouchableOpacity>
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

export default OrderingTypeSelectorModal;
