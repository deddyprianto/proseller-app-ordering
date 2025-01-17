/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';

import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';

import {Actions} from 'react-native-router-flux';
import appConfig from '../../../config/appConfig';
import Theme from '../../../theme';
import FieldSearch from '../../fieldSearch';

import Scanner from '../../scanner';
import {
  normalizeLayoutSizeHeight,
  normalizeLayoutSizeWidth,
} from '../../../helper/Layout';
import BackButton from '../../../assets/svg/BackButton';
import useSettings from '../../../hooks/settings/useSettings';
import {navigate} from '../../../utils/navigation.utils';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      overflow: 'hidden',
      paddingBottom: 2,
      zIndex: 2000,
    },
    container: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 3,
      height: 56,
      maxHeight: 56,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding: 16,
      backgroundColor: theme.colors.header,
    },
    containerLeft: {
      flex: 1,
      alignItems: 'flex-start',
    },
    containerCenter: {
      flex: 2,
      alignItems: 'center',
    },
    containerLeftTitle: {
      flex: 8,
    },
    containerRight: {
      flex: 1,
      alignItems: 'flex-end',
    },
    flexRowCenter: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewCancelButton: {
      marginLeft: 16,
    },
    textHeader: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textCancel: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    logo: appName => ({
      height:
        appName === 'fareastflora' ? normalizeLayoutSizeHeight(56) : '100%',
      width: appName === 'fareastflora' ? normalizeLayoutSizeWidth(112) : '70%',
    }),
    icon: {
      width: 24,
      height: 24,
      tintColor: theme.colors.textQuaternary,
    },
    iconBack: {
      width: 24,
      height: 24,
      tintColor: theme.colors.textQuaternary,
    },
    iconRemove: {
      width: 18,
      height: 18,
      tintColor: theme.colors.textQuaternary,
    },
    iconCart: {
      width: 11,
      height: 18,
      tintColor: theme.colors.textQuaternary,
    },
    primaryColor: {
      backgroundColor: theme.colors.primary,
    },
  });
  return {styles, color: theme.colors};
};

const Header = ({
  title,
  isLogo,
  isMiddleLogo,
  isRemoveBackIcon,
  remove,
  cart,
  search,
  searchHeader,
  scanner,
  removeOnClick,
  customTitle,
  handleSearchInput,
  searchPlaceholder,
  onBackBtn,
  leftTitle,
  usingPrimaryColor,
  rootStyle,
  customRightIcon,
}) => {
  const {styles, color} = useStyles();
  const {useCartVersion} = useSettings();
  const [isOpenScanner, setIsOpenScanner] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const {appName} = appConfig;
  const [searchTextInput, setSearchTextInput] = useState('');
  useEffect(() => {
    if (handleSearchInput) {
      handleSearchInput(searchTextInput);
    }
  }, [searchTextInput]);

  const handleCloseScanner = () => {
    setIsOpenScanner(false);
  };

  const handleSearchClick = () => {
    if (searchHeader) {
      setSearchTextInput('');
      setIsSearch(!isSearch);
    } else {
      navigate('searchProduct');
    }
  };

  const renderLogo = () => {
    return (
      <Image
        source={appConfig.logoMerchant}
        resizeMode="contain"
        style={styles.logo(appName)}
      />
    );
  };

  const renderDefaultTitle = () => {
    return (
      <Text
        style={[
          styles.textHeader,
          {color: usingPrimaryColor ? 'white' : color.primary},
        ]}
        numberOfLines={1}>
        {title}
      </Text>
    );
  };

  const renderTitle = () => {
    if (isMiddleLogo) {
      return renderLogo();
    } else if (customTitle) {
      return customTitle;
    } else if (title) {
      return renderDefaultTitle();
    } else {
      return null;
    }
  };

  const onBackBtnHandle = () => {
    if (onBackBtn && typeof onBackBtn === 'function') {
      return onBackBtn();
    }
    console.log('masuk');
    Actions.pop();
  };

  const renderBackIcon = () => {
    return (
      <TouchableOpacity onPress={onBackBtnHandle}>
        <BackButton color={usingPrimaryColor ? 'white' : color.primary} />
        {/* <Image source={appConfig.iconArrowLeft} style={styles.iconBack} /> */}
      </TouchableOpacity>
    );
  };

  const renderCartIcon = () => {
    if (cart) {
      return (
        <TouchableOpacity onPress={useCartVersion}>
          <BackButton />
          {/* <Image source={appConfig.iconCart} style={styles.icon} /> */}
        </TouchableOpacity>
      );
    }
  };

  const renderScannerIcon = () => {
    if (scanner) {
      return (
        <TouchableOpacity
          onPress={() => {
            setIsOpenScanner(true);
          }}>
          <Image source={appConfig.iconScan} style={styles.icon} />
        </TouchableOpacity>
      );
    }
  };

  const renderRemoveIcon = () => {
    if (remove && removeOnClick) {
      return (
        <TouchableOpacity
          onPress={() => {
            removeOnClick();
          }}>
          <Image source={appConfig.iconDelete} style={styles.iconRemove} />
        </TouchableOpacity>
      );
    }
  };

  const renderSearchIcon = () => {
    if (search || searchHeader) {
      return (
        <TouchableOpacity
          onPress={() => {
            handleSearchClick();
          }}>
          <Image source={appConfig.iconSearch} style={styles.icon} />
        </TouchableOpacity>
      );
    }
  };

  const renderSearchBar = () => {
    const placeholder = searchPlaceholder || 'Try to search “toast”';
    return (
      <FieldSearch
        value={searchTextInput}
        onChange={value => {
          setSearchTextInput(value);
        }}
        placeholder={placeholder}
        onClear={() => {
          setSearchTextInput('');
        }}
        autoFocus
      />
    );
  };

  const renderIconCenterWrap = () => {
    return renderTitle();
  };

  const renderIconLeftWrap = () => {
    if (isLogo) {
      return renderLogo();
    } else if (isRemoveBackIcon) {
      return;
    } else {
      return renderBackIcon();
    }
  };

  const customRightIconHandle = () => {
    if (customRightIcon) {
      return customRightIcon();
    }
    return null;
  };

  const renderIconRightWrap = () => {
    return (
      <View style={styles.flexRowCenter}>
        {renderSearchIcon()}
        {renderCartIcon()}
        {renderScannerIcon()}
        {renderRemoveIcon()}
        {customRightIconHandle()}
      </View>
    );
  };

  const handleStyleTitleContainer = () => {
    if (leftTitle) {
      return styles.containerLeftTitle;
    }
    return styles.containerCenter;
  };

  const handleBgHeader = () => {
    if (usingPrimaryColor) {
      return [styles.container, styles.primaryColor];
    }
    return [styles.container];
  };

  const renderDefaultHeader = () => {
    return (
      <View style={handleBgHeader()}>
        <Scanner open={isOpenScanner} handleClose={handleCloseScanner} />
        <View style={styles.containerLeft}>{renderIconLeftWrap()}</View>

        <View style={[handleStyleTitleContainer()]}>
          {renderIconCenterWrap()}
        </View>
        <View style={styles.containerRight}>{renderIconRightWrap()}</View>
      </View>
    );
  };

  const renderCancelButton = () => {
    return (
      <TouchableOpacity
        style={styles.viewCancelButton}
        onPress={() => {
          handleSearchClick();
        }}>
        <Text style={styles.textCancel}>Cancel</Text>
      </TouchableOpacity>
    );
  };

  const renderSearchHeader = () => {
    return (
      <View style={styles.container}>
        {renderSearchBar()}
        {renderCancelButton()}
      </View>
    );
  };

  const renderHeader = () => {
    if (isSearch) {
      return renderSearchHeader();
    } else {
      return renderDefaultHeader();
    }
  };

  return <View style={[styles.root, rootStyle]}>{renderHeader()}</View>;
};

export default Header;
