import React, {useEffect, useState} from 'react';

import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';

import {Body, Header} from '../components/layout';
import Theme from '../theme/Theme';
import {getAllMembershipTier} from '../actions/membership.action';
import {useRef} from 'react';

const useStyles = () => {
  const {fontFamily, fontSize, colors} = Theme();
  const styles = StyleSheet.create({
    viewMembershipDetail: {
      margin: 16,
    },
    viewTierTabs: {
      marginTop: 16,
      marginHorizontal: 16,
    },
    viewTierItem: {
      flex: 1,
      width: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    viewTierItemSelected: {
      flex: 1,
      width: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.brandPrimary,
    },
    textTierName: {
      textAlign: 'center',
      color: colors.brandTertiary,
      fontSize: fontSize[12],
      fontFamily: fontFamily.poppinsMedium,
    },
    textTierNameSelected: {
      textAlign: 'center',
      color: colors.brandPrimary,
      fontSize: fontSize[12],
      fontFamily: fontFamily.poppinsMedium,
    },
    textMembershipDetail: {
      marginBottom: 16,
      color: colors.textPrimary,
      fontSize: fontSize[16],
      fontFamily: fontFamily.poppinsSemiBold,
    },
    textMembershipDetailDescription: {
      color: colors.textPrimary,
      fontSize: fontSize[14],
      fontFamily: fontFamily.poppinsMedium,
    },
  });
  return styles;
};

const MembershipAllTier = () => {
  const dispatch = useDispatch();
  const styles = useStyles();
  const tierRef = useRef();

  const [selectedTier, setSelectedTier] = useState('');

  const allMembershipTier = useSelector(
    state => state.membershipReducer.allMembershipTier,
  );

  useEffect(() => {
    const loadData = async () => {
      const response = await dispatch(getAllMembershipTier());
      setSelectedTier(response[0]);
      tierRef.current.scrollToIndex({animation: true, index: 0});
    };

    loadData();
  }, [dispatch]);

  const renderCategoryTabsItem = item => {
    const isSelected = item?.name === selectedTier?.name;

    const styleText = isSelected
      ? styles.textTierNameSelected
      : styles.textTierName;

    const styleTouchable = isSelected
      ? styles.viewTierItemSelected
      : styles.viewTierItem;

    return (
      <TouchableOpacity
        style={styleTouchable}
        onPress={() => {
          setSelectedTier(item);
        }}>
        <Text style={styleText} numberOfLines={1}>
          {item?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCategoryTabs = () => {
    return (
      <FlatList
        style={styles.viewTierTabs}
        ref={tierRef}
        data={allMembershipTier}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => renderCategoryTabsItem(item, index)}
      />
    );
  };

  const renderMembershipDetail = () => {
    return (
      <View style={styles.viewMembershipDetail}>
        <Text style={styles.textMembershipDetail}>
          {selectedTier?.name} Membership Detail
        </Text>
        <Text style={styles.textMembershipDetailDescription}>
          {selectedTier?.description}
        </Text>
      </View>
    );
  };

  const renderBody = () => {
    return (
      <ScrollView>
        {renderCategoryTabs()}
        {renderMembershipDetail()}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView>
      <Body>
        <Header title="All Membership Tier" />
        {renderBody()}
      </Body>
    </SafeAreaView>
  );
};

export default MembershipAllTier;
