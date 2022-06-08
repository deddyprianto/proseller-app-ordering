import React, {useState} from 'react';
import moment from 'moment';

import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';

import {useDispatch} from 'react-redux';
import {
  setFavoriteOutlet,
  unsetFavoriteOutlet,
} from '../../../actions/stores.action';

const styles = StyleSheet.create({
  divider: {
    backgroundColor: '#D6D6D6',
    height: 1,
    width: '100%',
  },
  icon: {
    fontSize: 24,
    color: 'red',
  },
  margin10: {
    marginTop: 10,
  },
  textDay: {
    fontWeight: 'bold',
    width: '30%',
  },
  viewDescription: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  viewDescriptionDetail: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  viewOperationalHours: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const MyFavoriteOutletItemList = ({outlet}) => {
  const dispatch = useDispatch();
  const [active, setActive] = useState(outlet?.isFavorite || false);

  const handleSetFavoriteOutlet = async () => {
    await dispatch(setFavoriteOutlet({outletId: outlet?.id}));
  };

  const handleUnsetFavoriteOutlet = async () => {
    await dispatch(unsetFavoriteOutlet({outletId: outlet?.id}));
  };

  const handleStarClicked = value => {
    if (active) {
      handleUnsetFavoriteOutlet();
      setActive(false);
    } else {
      handleSetFavoriteOutlet();
      setActive(true);
    }
  };

  const renderTextName = () => {
    return <Text>{outlet?.name}</Text>;
  };

  const renderStar = () => {
    const star = active ? 'star' : 'star-o';

    return (
      <TouchableOpacity
        onPress={() => {
          handleStarClicked();
        }}>
        <IconFontAwesome name={star} style={styles.icon} />
      </TouchableOpacity>
    );
  };

  const outletItem = () => {
    return (
      <View style={styles.viewDescription}>
        {renderTextName()}
        {renderStar()}
      </View>
    );
  };

  const renderTextAddress = () => {
    return <Text>{outlet.address}</Text>;
  };

  const handleTimeFormatter = value => {
    const result = moment(value, 'hh:mm').format('hh:mm a');
    return result;
  };

  const renderOperationalHourItem = value => {
    const timeActive = value?.active;
    const timeOpen = handleTimeFormatter(value?.open);
    const timeClose = handleTimeFormatter(value?.close);

    const textTime = timeActive ? `: ${timeOpen} - ${timeClose}` : 'Close';

    return (
      <View style={styles.viewOperationalHours}>
        <Text style={styles.textDay}>{value?.nameOfDay}</Text>
        <Text>{textTime}</Text>
      </View>
    );
  };

  const renderOperationalHours = () => {
    const result = outlet?.operationalHours?.map(value => {
      return renderOperationalHourItem(value);
    });
    return result;
  };

  const outletItemDetail = () => {
    return (
      <View style={styles.viewDescriptionDetail}>
        {renderTextAddress()}
        <View style={styles.margin10} />
        {renderOperationalHours()}
      </View>
    );
  };

  return (
    <View>
      {outletItem()}
      <View style={styles.divider} />
      {outletItemDetail()}
      <View style={styles.divider} />
    </View>
  );
};

export default MyFavoriteOutletItemList;
