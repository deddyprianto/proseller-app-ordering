import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Text, TouchableOpacity, View, Image, Modal} from 'react-native';
import {Dialog, Portal, Provider} from 'react-native-paper';
import appConfig from '../../config/appConfig';
import colorConfig from '../../config/colorConfig';
import {changeOrderingMode} from '../../actions/order.action';
import {isEmptyArray, isEmptyObject} from '../../helper/CheckEmpty';

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
    margin: 6,
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
    margin: 6,
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
  imageSelected: {
    tintColor: colorConfig.primaryColor,
  },
  image: {
    tintColor: '#B7B7B7',
  },
};

const OrderingTypeSelectorModal = ({open, handleClose, value}) => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState({});
  const [orderingTypes, setOrderingTypes] = useState([]);

  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );

  useEffect(() => {
    const orderingModesField = [
      {
        key: 'PICKUP',
        isEnabledFieldName: 'enableStorePickUp',
        displayName: defaultOutlet.storePickUpName || 'Pick Up',
        image: appConfig.funtoastPickUp,
      },
      {
        key: 'DELIVERY',
        isEnabledFieldName: 'enableDelivery',
        displayName: defaultOutlet.deliveryName || 'Delivery',
        image: appConfig.funtoastDelivery,
      },
      {
        key: 'TAKEAWAY',
        isEnabledFieldName: 'enableTakeAway',
        displayName: defaultOutlet.takeAwayName || 'Take Away',
        image: appConfig.funtoastTakeAway,
      },
      {
        key: 'DINEIN',
        isEnabledFieldName: 'enableDineIn',
        displayName: defaultOutlet.dineInName || 'Dine In',
        image: appConfig.funtoastPickUp,
      },
    ];

    const orderingModesFieldFiltered = orderingModesField.filter(mode => {
      if (defaultOutlet[mode.isEnabledFieldName]) {
        return mode;
      }
    });
    setOrderingTypes(orderingModesFieldFiltered);
    const currentOrderingMode = value || '';
    setSelected({key: currentOrderingMode});
  }, [defaultOutlet, value]);

  const handleSave = async () => {
    await dispatch(changeOrderingMode({orderingMode: selected?.key}));
    handleClose();
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text>Choose Type</Text>
      </View>
    );
  };

  const renderOrderingTypeItem = item => {
    const active = selected?.key === item?.key;
    const styleItem = active
      ? styles.touchableItemSelected
      : styles.touchableItem;
    const styleName = active ? styles.textNameSelected : styles.textName;
    const styleImage = active ? styles.imageSelected : styles.image;

    return (
      <TouchableOpacity
        style={styleItem}
        onPress={() => {
          setSelected(item);
        }}>
        <View style={styles.circle}>
          <Image source={item?.image} style={styleImage} />
        </View>
        <View style={{marginTop: 8}} />
        <Text style={styleName}>{item?.displayName}</Text>
      </TouchableOpacity>
    );
  };

  const renderBody = () => {
    const result = orderingTypes.map(type => {
      return renderOrderingTypeItem(type);
    });

    return <View style={styles.body}>{result}</View>;
  };

  const renderFooter = () => {
    const disabled = isEmptyObject(selected) || isEmptyArray(orderingTypes);
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.touchableSave}
          disabled={disabled}
          onPress={() => {
            handleSave();
          }}>
          <Text style={styles.textSave}>SAVE</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!open) {
    return null;
  }

  return (
    <Modal transparent visible={open} onDismiss={handleClose}>
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
    </Modal>
  );
};

export default OrderingTypeSelectorModal;
