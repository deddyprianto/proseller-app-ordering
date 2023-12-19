import React from 'react';

import {StyleSheet, ScrollView, View, Text} from 'react-native';

import OutletListItem from './components/OutletListItem';

import Theme from '../../theme';

import {groupBy} from 'lodash';
import {isEmptyObject} from '../../helper/CheckEmpty';
import CheckOutletStatus from '../../helper/CheckOutletStatus';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    container: {
      flexDirection: 'column',
      paddingHorizontal: 16,
    },
    text: {
      textAlign: 'left',
      marginTop: 16,
      marginBottom: 8,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textHeader: {
      textAlign: 'left',
      marginTop: 16,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
  });
  return styles;
};

const OutletList = ({outlets, nearestOutlet, handleChange}) => {
  const styles = useStyles();

  const handleOutletGroup = () => {
    const outletGroups = groupBy(outlets, 'region');
    const result = Object.entries(outletGroups).map(data => ({
      ['region']: data[0],
      ['outlets']: data[1],
    }));

    return result;
  };

  const renderTextHeader = () => {
    return (
      <Text style={styles.textHeader}>
        From which outlet would you like to place your order?
      </Text>
    );
  };

  const renderRegion = text => {
    return <Text style={styles.text}>{text}</Text>;
  };

  const renderOutletList = data => {
    data?.sort((a, b) => {
      return CheckOutletStatus(a) === 'OPEN'
        ? -1
        : CheckOutletStatus(b) === 'OPEN'
        ? 1
        : 0;
    });
    const result = data?.map(item => {
      return <OutletListItem item={item} handleChange={handleChange} />;
    });

    return result;
  };

  const renderRegionAndOutlet = ({text, data}) => {
    return (
      <>
        {renderRegion(text)}
        {renderOutletList(data)}
      </>
    );
  };

  const renderOutlets = () => {
    const outletGroupByRegion = handleOutletGroup();
    const result = outletGroupByRegion?.map(item => {
      const text =
        item?.region === 'undefined'
          ? 'Others Location'
          : `Outlets - ${item?.region}`;

      return renderRegionAndOutlet({text, data: item?.outlets});
    });
    return result;
  };

  const renderNearestOutlets = () => {
    if (!isEmptyObject(nearestOutlet)) {
      const text = 'Outlets Near You';
      return renderRegionAndOutlet({text, data: [nearestOutlet]});
    }
  };

  return (
    <ScrollView style={styles.root}>
      <View style={styles.container}>
        {renderTextHeader()}
        {renderNearestOutlets()}
        {renderOutlets()}
      </View>
    </ScrollView>
  );
};

export default OutletList;
