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
      marginBottom: -3,
      padding: 0,
      color: theme.colors.text1,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textInputLabel: {
      marginBottom: -3,
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
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [
    isOpenNotificationMaximumModal,
    setIsOpenNotificationMaximumModal,
  ] = useState(false);
  const [
    isOpenNotificationDuplicateModal,
    setIsOpenNotificationDuplicateModal,
  ] = useState(false);
  const [isAddTags, setIsAddTags] = useState(false);
  const [textValue, setTextValue] = useState('');

  const addressTags = useSelector(
    state => state.userReducer?.addressTags?.tags,
  );

  useEffect(() => {
    onChange(value);
  }, [onChange, value]);

  const handleAddTag = async () => {
    const payload = [...addressTags, textValue];
    onChange(textValue);

    setTextValue('');
    setIsAddTags(false);
    await dispatch(setAddressTags(payload));
  };

  const handleCheckTag = () => {
    const isDuplicate = addressTags?.find(value => value === textValue);

    if (!isDuplicate) {
      handleAddTag();
    } else {
      setIsOpenNotificationDuplicateModal(true);
    }
  };

  const handleRemoveTag = async () => {
    const payload = [...addressTags];
    const selectedIndex = payload.indexOf(value);
    const isIndexFounded = selectedIndex !== -1;

    if (isIndexFounded) {
      payload.splice(selectedIndex, 1);
    }

    onChange('');
    await dispatch(setAddressTags(payload));
    setIsOpenDeleteModal(false);
  };

  const handleSelectTag = async tag => {
    const payload = [...addressTags];

    payload.push(payload.splice(payload.indexOf(tag), 1)[0]);
    onChange(tag);
    await dispatch(setAddressTags(payload));
  };

  const handleButtonAddNewTag = () => {
    if (addressTags?.length || 0 <= 10) {
      setIsAddTags(!isAddTags);
    } else {
      setIsOpenNotificationMaximumModal(true);
    }
  };

  const renderButtonRemove = selected => {
    if (selected) {
      return (
        <TouchableOpacity
          onPress={() => {
            setIsOpenDeleteModal(true);
          }}
          style={styles.viewButtonRemove}>
          <Image source={appConfig.iconClose} style={styles.iconRemove} />
        </TouchableOpacity>
      );
    }
  };

  const renderAddressTagListItem = tag => {
    const selected = tag === value;
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
    const results = addressTags?.map(tag => {
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
    const styleInput = textValue ? styles.textInputLabel : styles.textInput;
    return (
      <View style={styles.container}>
        {renderLabel()}
        <TextInput
          style={styleInput}
          value={textValue}
          placeholder="New Tag"
          onChangeText={value => {
            if (value.length <= 10) {
              setTextValue(value);
            }
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
          handleCheckTag();
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

  const renderNotificationMaximumDialog = () => {
    if (isOpenNotificationMaximumModal) {
      return (
        <ConfirmationDialog
          open={isOpenNotificationMaximumModal}
          handleSubmit={() => {
            setIsOpenNotificationMaximumModal(false);
          }}
          handleClose={() => {
            setIsOpenNotificationMaximumModal(false);
          }}
          isHideButtonCancel
          textTitle="Can’t add more address tag"
          textDescription="You’ve reached maximum address tag, to add a new one please delete one of it"
          textSubmit="Got it"
        />
      );
    }
  };

  const renderNotificationDuplicateDialog = () => {
    if (isOpenNotificationDuplicateModal) {
      return (
        <ConfirmationDialog
          open={isOpenNotificationDuplicateModal}
          handleSubmit={() => {
            setIsOpenNotificationDuplicateModal(false);
          }}
          handleClose={() => {
            setIsOpenNotificationDuplicateModal(false);
          }}
          isHideButtonCancel
          textTitle="Address tag already exist"
          textDescription="You can not add similar address tag, please make a new one."
          textSubmit="Got it"
        />
      );
    }
  };

  const renderDeleteTagConfirmationDialog = () => {
    if (isOpenDeleteModal) {
      return (
        <ConfirmationDialog
          open={isOpenDeleteModal}
          handleSubmit={() => {
            handleRemoveTag();
          }}
          handleClose={() => {
            setIsOpenDeleteModal(false);
          }}
          textTitle="Delete Address Tag"
          textDescription="Are your sure you want to delete this
          address tag?
          This action cannot be undone and you will be unable to recover any data."
          textSubmit="Sure"
        />
      );
    }
  };

  return (
    <View>
      {renderLabelAddressTag()}
      {renderAddressTagList()}
      {renderInputAndButtonAdd()}
      {renderNotificationMaximumDialog()}
      {renderDeleteTagConfirmationDialog()}
      {renderNotificationDuplicateDialog()}
    </View>
  );
};

export default FieldAddressTag;
