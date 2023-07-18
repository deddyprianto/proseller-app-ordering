import React from 'react';
import {FlatList, TouchableOpacity, View, StyleSheet} from 'react-native';
import GlobalInputText from '../globalInputText';
import {useDispatch, useSelector} from 'react-redux';
import {getAutoCompleteMap} from '../../actions/search.action';
import GlobalText from '../globalText';
import SearchSvg from '../../assets/svg/SearchSvg';
import {normalizeLayoutSizeHeight} from '../../helper/Layout';
import Theme from '../../theme/Theme';

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
    },
    buttonStyle: {
      padding: 16,
    },
  });
  return {styles};
};

const AutocompleteAddress = () => {
  const {styles} = useStyles();
  const dispatch = useDispatch();
  const data = useSelector(state => state.searchReducer?.searchAddress) || [];
  const handleSearchPostalCode = text => {
    dispatch(getAutoCompleteMap(text));
  };
  const [isFocus, setIsFocus] = React.useState(false);

  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.buttonStyle}>
      <GlobalText>{item['ADDRESS']}</GlobalText>
    </TouchableOpacity>
  );

  return (
    <View>
      <GlobalInputText
        placeholder="Search postal code, building, or street name"
        isMandatory
        label="Postal Code/Building/Street Home"
        onChangeText={handleSearchPostalCode}
        onFocus={() => setIsFocus(true)}
        // onBlur={() => setIsFocus(false)}
        rightIcon={<SearchSvg />}
      />
      {data?.length > 0 && isFocus ? (
        <View style={styles.containerList}>
          <FlatList
            nestedScrollEnabled={true}
            data={data}
            renderItem={renderItem}
            style={styles.flatlistContainer}
          />
        </View>
      ) : null}
    </View>
  );
};

export default React.memo(AutocompleteAddress);
