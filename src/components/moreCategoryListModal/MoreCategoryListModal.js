import React, {useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';

import MoreCategoryItem from './components/MoreCategoryItem';

import Theme from '../../theme';
import {isEmptyArray} from '../../helper/CheckEmpty';
import appConfig from '../../config/appConfig';
import {getProductCategories} from '../../actions/product.action';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: theme.colors.backgroundTransparent,
    },
    rootBody: {
      height: '60%',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      backgroundColor: theme.colors.background,
    },
    textHeader: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textMoreCategories: {
      marginTop: 8,
      textAlign: 'center',
      fontSize: theme.fontSize[12],
      color: theme.colors.textPrimary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewHeader: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: 16,
    },
    viewCategories: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 60,
      marginHorizontal: 16,
    },
    viewMoreCategories: {
      elevation: 2,
      padding: 8,
      width: 120,
      height: 160,
      borderRadius: 8,
      marginVertical: 8,
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      backgroundColor: theme.colors.background,
    },
    viewCloseButton: {
      width: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      backgroundColor: theme.colors.primary,
    },
    viewWrapCategories: {
      width: '100%',
      height: '100%',
    },
    imageMoreCategories: {
      width: 86,
      height: 86,
    },
    iconClose: {
      width: 24,
      height: 24,
      tintColor: theme.colors.greyScale2,
    },
  });
  return styles;
};

const MoreCategoryListModal = ({handleClose, open}) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const categories = useSelector(
    state => state.productReducer.productCategories,
  );

  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );

  useEffect(() => {
    const loadData = async () => {
      await dispatch(getProductCategories({outletId: defaultOutlet.id}));
    };
    loadData();
  }, [dispatch, defaultOutlet]);

  const renderMoreCategoryItem = item => {
    return <MoreCategoryItem category={item} />;
  };

  const renderCategories = () => {
    if (!isEmptyArray(categories)) {
      const result = categories?.map(category => {
        return renderMoreCategoryItem(category);
      });

      return (
        <ScrollView style={styles.viewWrapCategories}>
          <View style={styles.viewCategories}>{result}</View>
        </ScrollView>
      );
    }
  };

  const renderHeaderText = () => {
    return <Text style={styles.textHeader}>More Categories</Text>;
  };

  const renderHeaderCloseButton = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleClose();
        }}>
        <Image source={appConfig.iconClose} style={styles.iconClose} />
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.viewHeader}>
        {renderHeaderText()}
        {renderHeaderCloseButton()}
      </View>
    );
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={open && !isEmptyArray(categories)}>
      <TouchableOpacity
        style={styles.root}
        onPress={handleClose}
        activeOpacity={1}>
        <TouchableOpacity style={styles.rootBody} activeOpacity={1}>
          {renderHeader()}
          {renderCategories()}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default MoreCategoryListModal;
