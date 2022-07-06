import React, {useEffect, useState} from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setAddressTags} from '../../actions/user.action';
import appConfig from '../../config/appConfig';
import Theme from '../../theme';
import ConfirmationDialog from '../confirmationDialog';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: 48,
      maxHeight: 48,
      borderWidth: 1,
      borderRadius: 8,
      justifyContent: 'center',
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderColor: theme.colors.border1,
      marginRight: 10,
    },
    textLabelAddressTag: {
      marginBottom: 8,
      color: theme.colors.text1,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textAddTag: {
      color: theme.colors.primary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textAddNewTag: {
      color: theme.colors.primary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textLabel: {
      textAlign: 'left',
      color: theme.colors.text2,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textInput: {
      height: 21,
      padding: 0,
      color: theme.colors.text1,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textAddressTagListItem: {
      color: theme.colors.primary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textAddressTagListItemSelected: {
      color: theme.colors.text4,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewInputAndButtonAdd: {
      marginTop: 16,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    viewButtonAddTag: {
      height: 48,
      paddingHorizontal: 25,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      justifyContent: 'center',
    },
    viewAddressTagList: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    viewAddressTagListItem: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 100,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderWidth: 1,
      marginRight: 8,
      marginBottom: 8,
      borderColor: theme.colors.primary,
    },
    viewAddressTagListItemSelected: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 100,
      paddingHorizontal: 8,
      paddingVertical: 3,
      marginRight: 8,
      marginBottom: 8,
      backgroundColor: theme.colors.primary,
    },
    viewButtonRemove: {
      width: 15,
      height: 15,
      borderRadius: 100,
      borderWidth: 1,
      borderColor: theme.colors.border2,
      marginLeft: 4,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconRemove: {
      width: 10,
      height: 10,
      tintColor: theme.colors.text4,
    },
  });
  return styles;
};

const FieldAddressTag = ({value, onChange}) => {
  const dispatch = useDispatch();
  const styles = useStyles();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isAddTags, setIsAddTags] = useState(false);
  const [textValue, setTextValue] = useState('');

  const addressTags = useSelector(state => state.userReducer.addressTags.tags);
  const currentValue = value || addressTags[0];

  useEffect(() => {
    onChange(currentValue);
  }, [onChange, currentValue]);

  const handleAddTag = async () => {
    const payload = [...addressTags, textValue];
    onChange(textValue);
    setTextValue('');
    setIsAddTags(false);
    await dispatch(setAddressTags(payload));
  };

  const handleRemoveTag = async () => {
    const payload = [...addressTags];
    const selectedIndex = payload.indexOf(currentValue);

    if (selectedIndex !== -1) {
      payload.splice(selectedIndex, 1);
    }

    const lastIndex = payload.length - 1;
    onChange(payload[lastIndex]);
    await dispatch(setAddressTags(payload));
  };

  const handleSelectTag = tag => {
    onChange(tag);
  };

  const handleButtonAddNewTag = () => {
    if (addressTags.length >= 10) {
      setIsAddTags(!isAddTags);
    } else {
      setIsOpenModal(true);
    }
  };

  const renderButtonRemove = selected => {
    if (selected) {
      return (
        <TouchableOpacity
          onPress={() => {
            handleRemoveTag();
          }}
          style={styles.viewButtonRemove}>
          <Image source={appConfig.iconClose} style={styles.iconRemove} />
        </TouchableOpacity>
      );
    }
  };

  const renderAddressTagListItem = tag => {
    const selected = tag === currentValue;
    const styleView = selected
      ? styles.viewAddressTagListItemSelected
      : styles.viewAddressTagListItem;
    const styleText = selected
      ? styles.textAddressTagListItemSelected
      : styles.textAddressTagListItem;

    return (
      <TouchableOpacity
        style={styleView}
        onPress={() => {
          handleSelectTag(tag);
        }}>
        <Text style={styleText}>{tag}</Text>
        {renderButtonRemove(selected)}
      </TouchableOpacity>
    );
  };

  const renderButtonAddNewTag = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleButtonAddNewTag();
        }}>
        <Text style={styles.textAddNewTag}>+ Add New Tag</Text>
      </TouchableOpacity>
    );
  };

  const renderAddressTagList = () => {
    const results = addressTags.map(tag => {
      return renderAddressTagListItem(tag);
    });

    return (
      <View style={styles.viewAddressTagList}>
        {results}
        {renderButtonAddNewTag()}
      </View>
    );
  };

  const renderLabel = () => {
    if (textValue) {
      return <Text style={styles.textLabel}>New Tag</Text>;
    }
  };

  const renderInput = () => {
    return (
      <View style={styles.container}>
        {renderLabel()}
        <TextInput
          style={styles.textInput}
          value={textValue}
          placeholder="New Tag"
          onChangeText={value => {
            setTextValue(value);
          }}
        />
      </View>
    );
  };

  const renderButtonAddTag = () => {
    return (
      <TouchableOpacity
        style={styles.viewButtonAddTag}
        onPress={() => {
          handleAddTag();
        }}>
        <Text style={styles.textAddTag}>Add Tag</Text>
      </TouchableOpacity>
    );
  };

  const renderInputAndButtonAdd = () => {
    if (isAddTags) {
      return (
        <View style={styles.viewInputAndButtonAdd}>
          {renderInput()}
          {renderButtonAddTag()}
        </View>
      );
    }
  };

  const renderLabelAddressTag = () => {
    return <Text style={styles.textLabelAddressTag}>Address Tag</Text>;
  };

  const renderConfirmationDialog = () => {
    if (isOpenModal) {
      return (
        <ConfirmationDialog
          open={isOpenModal}
          handleSubmit={() => {
            setIsOpenModal(false);
          }}
          textDescription="You’ve reached maximum address tag, to add a new one please delete one of it"
          textTitle="Can’t add more address tag"
          textSubmit="Got it"
        />
      );
    }
  };
  return (
    <View>
      {renderLabelAddressTag()}
      {renderAddressTagList()}
      {renderInputAndButtonAdd()}
      {renderConfirmationDialog()}
    </View>
  );
};

export default FieldAddressTag;
