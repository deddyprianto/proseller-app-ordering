import React, {useState} from 'react';

import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import appConfig from '../../../config/appConfig';
import Theme from '../../../theme';
import HighlightText from '../../helper/HighlightText';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    header: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
    },
    body: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    textName: {
      flex: 1,
      fontSize: theme.fontSize[14],
      color: theme.colors.textPrimary,
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textNameHighlight: {
      flex: 1,
      fontSize: theme.fontSize[14],
      color: theme.colors.textQuaternary,
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textDescription: {
      fontSize: theme.fontSize[14],
      color: theme.colors.textPrimary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewIconArrow: {
      height: 20,
      width: 20,
      borderRadius: 100,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.textQuaternary,
    },
    iconArrow: {
      width: 16,
      height: 12,
      tintColor: theme.colors.textSecondary,
    },
  });
  return styles;
};

const FAQListItem = ({data, searchQuery}) => {
  const styles = useStyles();
  const [isSelected, setIsSelected] = useState(false);

  const handleSelect = () => {
    setIsSelected(!isSelected);
  };
  const renderTextName = () => {
    return (
      <HighlightText
        style={styles.textName}
        highlightStyle={styles.textNameHighlight}
        text={data.title}
        highlightText={searchQuery}
      />
    );
  };

  const renderArrow = () => {
    const iconArrow = isSelected
      ? appConfig.iconArrowUp
      : appConfig.iconArrowDown;

    return (
      <View style={styles.viewIconArrow}>
        <Image style={styles.iconArrow} source={iconArrow} />
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <TouchableOpacity
        style={styles.header}
        onPress={() => {
          handleSelect();
        }}>
        {renderTextName()}
        {renderArrow()}
      </TouchableOpacity>
    );
  };

  const renderDescription = () => {
    return <Text style={styles.textDescription}>{data?.description}</Text>;
  };

  const renderBody = () => {
    if (isSelected) {
      return <View style={styles.body}>{renderDescription()}</View>;
    }
  };

  return (
    <View style={styles.root}>
      {renderHeader()}
      {renderBody()}
    </View>
  );
};

export default FAQListItem;
