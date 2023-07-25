/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  FlatList,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import {debounce} from 'lodash';
import GlobalInputText from '../globalInputText';
import {useDispatch, useSelector} from 'react-redux';
import {
  getAddressDetail,
  getAutoCompleteMap,
} from '../../actions/search.action';
import GlobalText from '../globalText';
import SearchSvg from '../../assets/svg/SearchSvg';
import {normalizeLayoutSizeHeight} from '../../helper/Layout';
import Theme from '../../theme/Theme';
import MapPointSvg from '../../assets/svg/MapPointSvg';

const useStyles = () => {
  const {colors} = Theme();
  const styles = StyleSheet.create({
    flatlistContainer: {
      height: normalizeLayoutSizeHeight(230),
    },
    containerList: {
      marginTop: 13,
      borderColor: colors.greyScale2,
      borderWidth: 1,
      borderRadius: 8,
    },
    buttonStyle: {
      padding: 16,
    },
    currentLocationBtn: {
      padding: 16,
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: colors.greyScale2,
    },
    icontContainer: {
      marginRight: 8,
    },
    parentInput: {
      flex: 1,
    },
  });
  return {styles};
};

/**
 * @typedef {Object} AutocompleteProps
 * @property {boolean} showLoading
 * @property {boolean} enableCurrentLocation
 * @property {Function} onSelectAddress
 * @property {string} value
 */

/**
 *
 * @param {AutocompleteProps} props
 */

const AutocompleteAddress = props => {
  const {styles} = useStyles();
  const dispatch = useDispatch();
  const inputRef = React.useRef();
  const data = useSelector(state => state.searchReducer?.searchAddress) || [];
  const handleSearchPostalCode = text => {
    setIsFocus(true);
    setMyAddress(text);
    callApiOneMap(text);
  };
  const [isFocus, setIsFocus] = React.useState(false);
  const [myAddress, setMyAddress] = React.useState('');
  const [itemAddress, setItemAddress] = React.useState({});
  const [currentPage, setCurrentPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const onClickAddress = item => {
    setMyAddress(item['ADDRESS']);
    setItemAddress(item);
    setIsFocus(false);
    if (props.onSelectAddress && typeof props.onSelectAddress === 'function') {
      props.onSelectAddress(item);
    }
  };

  const callApiOneMap = debounce(async text => {
    setCurrentPage(1);
    setLoading(true);
    await dispatch(getAutoCompleteMap(text));
    setLoading(false);
  }, 500);

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => onClickAddress(item)}
      style={styles.buttonStyle}>
      <GlobalText>{item['ADDRESS']}</GlobalText>
    </TouchableOpacity>
  );

  const onEndReach = () => {
    setCurrentPage(prevState => prevState + 1);
    dispatch(getAutoCompleteMap(myAddress, currentPage + 1));
  };

  const onGetCurrentLocation = () => {
    Geolocation.getCurrentPosition(async info => {
      setCurrentPage(1);
      const {coords} = info;
      const searchValue = `${coords.latitude},${coords.longitude}`;
      const response = await dispatch(getAddressDetail(searchValue));
      if (response.length > 0) {
        setMyAddress(response[0].BUILDINGNAME);
        dispatch(getAutoCompleteMap(response[0].BUILDINGNAME));
      }
    });
  };

  React.useEffect(() => {
    if (props.onSelectAddress && typeof props.onSelectAddress === 'function') {
      props.onSelectAddress(itemAddress);
    }
  }, [itemAddress]);

  React.useEffect(() => {
    if (props.value?.length > 0) {
      setMyAddress(props.value);
    }
  }, [props.value]);

  return (
    <TouchableWithoutFeedback style={styles.parentInput}>
      <>
        <GlobalInputText
          placeholder="Search postal code, building, or street name"
          isMandatory
          label="Postal Code/Building/Street Home"
          onChangeText={handleSearchPostalCode}
          onFocus={() => setIsFocus(true)}
          // onBlur={onBlur}
          rightIcon={
            loading && props.showLoading ? <ActivityIndicator /> : <SearchSvg />
          }
          value={myAddress}
          ref={inputRef}
        />
        {isFocus && myAddress.length > 0 ? (
          <View style={[styles.containerList]}>
            {props.enableCurrentLocation ? (
              <TouchableOpacity
                onPress={onGetCurrentLocation}
                style={styles.currentLocationBtn}>
                <View style={styles.icontContainer}>
                  <MapPointSvg />
                </View>
                <GlobalText>Use current location</GlobalText>
              </TouchableOpacity>
            ) : null}
            <FlatList
              nestedScrollEnabled={true}
              data={data}
              renderItem={renderItem}
              style={styles.flatlistContainer}
              keyboardShouldPersistTaps={true}
              onEndReached={onEndReach}
              onEndReachedThreshold={0.9}
            />
          </View>
        ) : null}
      </>
    </TouchableWithoutFeedback>
  );
};

export default React.memo(AutocompleteAddress);
