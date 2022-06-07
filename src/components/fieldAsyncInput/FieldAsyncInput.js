import React, {useState} from 'react';

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import {ScrollView} from 'react-navigation';
import IconAntDesign from 'react-native-vector-icons/AntDesign';

const styles = StyleSheet.create({
  viewLabelAndInput: {
    width: '90%',
  },
  viewInput: {
    height: 56,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  viewInputSearch: {
    height: 56,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: 16,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  textLabel: {
    width: '100%',
    textAlign: 'left',
    color: '#00000099',
    fontSize: 12,
  },
  textInput: {
    height: 17,
    fontSize: 14,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  scrollViewList: {
    borderWidth: 1,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    paddingHorizontal: 16,
  },
  touchableListItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#00000080',
  },
  iconSearch: {fontSize: 20},
});

const FieldAsyncInput = ({
  label,
  customLabel,
  placeholder,
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpenList = () => {
    setOpen(true);
  };
  const handleCloseList = () => {
    setOpen(false);
  };

  const renderLabel = () => {
    if (!value) {
      return;
    }

    if (customLabel) {
      return customLabel(value);
    }

    return <Text style={styles.textLabel}>{label}</Text>;
  };

  const renderTextInput = () => {
    return (
      <TextInput
        style={styles.textInput}
        value={value}
        placeholder={placeholder}
        onTouchStart={() => {
          handleCloseList();
        }}
        onChangeText={value => {
          onChange(value);
          handleOpenList();
        }}
      />
    );
  };

  const renderListItem = value => {
    return (
      <TouchableOpacity
        style={styles.touchableListItem}
        onPress={() => {
          onChange(value?.name);
          handleCloseList();
        }}>
        <Text>{value?.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderList = () => {
    if (open && value) {
      const test = [
        {
          id: 1,
          name:
            '21 GEYLANG BAHRU LANE KALLANG BASIN SWIMMING COMPLEX, Singapore 339627',
        },
        {
          id: 2,
          name:
            '21 GEYLANG BAHRU LANE KALLANG BASIN SWIMMING COMPLEX, Singapore 339627',
        },
        {
          id: 3,
          name:
            '21 GEYLANG BAHRU LANE KALLANG BASIN SWIMMING COMPLEX, Singapore 339627',
        },
        {
          id: 4,
          name:
            '21 GEYLANG BAHRU LANE KALLANG BASIN SWIMMING COMPLEX, Singapore 339627',
        },
        {
          id: 5,
          name:
            '21 GEYLANG BAHRU LANE KALLANG BASIN SWIMMING COMPLEX, Singapore 339627',
        },
        {
          id: 6,
          name:
            '21 GEYLANG BAHRU LANE KALLANG BASIN SWIMMING COMPLEX, Singapore 339627',
        },
        {
          id: 7,
          name:
            '21 GEYLANG BAHRU LANE KALLANG BASIN SWIMMING COMPLEX, Singapore 339627',
        },
        {
          id: 8,
          name:
            '21 GEYLANG BAHRU LANE KALLANG BASIN SWIMMING COMPLEX, Singapore 339627',
        },
        {
          id: 1,
          name:
            '21 GEYLANG BAHRU LANE KALLANG BASIN SWIMMING COMPLEX, Singapore 339627',
        },
        {
          id: 2,
          name:
            '21 GEYLANG BAHRU LANE KALLANG BASIN SWIMMING COMPLEX, Singapore 339627',
        },
        {
          id: 3,
          name:
            '21 GEYLANG BAHRU LANE KALLANG BASIN SWIMMING COMPLEX, Singapore 339627',
        },
        {
          id: 4,
          name:
            '21 GEYLANG BAHRU LANE KALLANG BASIN SWIMMING COMPLEX, Singapore 339627',
        },
        {
          id: 5,
          name:
            '21 GEYLANG BAHRU LANE KALLANG BASIN SWIMMING COMPLEX, Singapore 339627',
        },
        {
          id: 6,
          name:
            '21 GEYLANG BAHRU LANE KALLANG BASIN SWIMMING COMPLEX, Singapore 339627',
        },
        {
          id: 7,
          name:
            '21 GEYLANG BAHRU LANE KALLANG BASIN SWIMMING COMPLEX, Singapore 339627',
        },
        {
          id: 8,
          name:
            '21 GEYLANG BAHRU LANE KALLANG BASIN SWIMMING COMPLEX, Singapore 339627',
        },
      ];

      const result = test.map(item => {
        return renderListItem(item);
      });

      return <ScrollView style={styles.scrollViewList}>{result}</ScrollView>;
    }
  };

  const renderBody = () => {
    const styleBody = open ? styles.viewInputSearch : styles.viewInput;

    return (
      <View style={styleBody}>
        <View style={styles.viewLabelAndInput}>
          {renderLabel()}
          {renderTextInput()}
        </View>
        <IconAntDesign name="search1" style={styles.iconSearch} />
      </View>
    );
  };

  return (
    <View>
      {renderBody()}
      {renderList()}
    </View>
  );
};

export default FieldAsyncInput;
