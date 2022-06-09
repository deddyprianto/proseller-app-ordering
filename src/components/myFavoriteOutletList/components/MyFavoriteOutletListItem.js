import React, {useState} from 'react';
import moment from 'moment';

import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconAntDesign from 'react-native-vector-icons/AntDesign';

const styles = StyleSheet.create({
  divider: {
    backgroundColor: '#D6D6D6',
    height: 1,
    width: '100%',
  },
  iconStar: {
    fontSize: 24,
    color: 'red',
    marginRight: 8,
  },
  iconWarning: {
    fontSize: 24,
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
    backgroundColor: 'white',
  },
  viewDescriptionSelected: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9F9F9',
  },
  viewStarAndName: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
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
  const [selected, setSelected] = useState(false);

  const handleSelect = () => {
    if (selected) {
      setSelected(false);
    } else {
      setSelected(true);
    }
  };
  const renderTextName = () => {
    return <Text>{outlet?.name}</Text>;
  };

  const renderStar = () => {
    return <IconFontAwesome name="star" style={styles.iconStar} />;
  };

  const renderStarAndName = () => {
    return (
      <View style={styles.viewStarAndName}>
        {renderStar()}
        {renderTextName()}
      </View>
    );
  };

  const renderWarning = () => {
    return (
      <IconAntDesign name="exclamationcircleo" style={styles.iconWarning} />
    );
  };

  const outletItem = () => {
    const style = selected
      ? styles.viewDescriptionSelected
      : styles.viewDescription;

    return (
      <TouchableOpacity
        style={style}
        onPress={() => {
          handleSelect();
        }}>
        {renderStarAndName()}
        {renderWarning()}
      </TouchableOpacity>
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
    if (selected) {
      return (
        <>
          <View style={styles.viewDescriptionDetail}>
            {renderTextAddress()}
            <View style={styles.margin10} />
            {renderOperationalHours()}
          </View>
          <View style={styles.divider} />
        </>
      );
    }
  };

  return (
    <View style={{width: '100%'}}>
      {outletItem()}
      <View style={styles.divider} />
      {outletItemDetail()}
    </View>
  );
};

export default MyFavoriteOutletItemList;
