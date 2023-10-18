import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {StyleSheet, ScrollView, View, Text, SafeAreaView} from 'react-native';

import VoucherList from '../components/voucherList';
import Header from '../components/layout/header';
import {Body} from '../components/layout';
import MembershipInfo from '../components/membershipInfo';

import {dataPointHistory} from '../actions/rewards.action';
import {myProgressBarCampaign} from '../actions/account.action';

import Theme from '../theme';

const useStyles = () => {
  const theme = Theme();
  const result = StyleSheet.create({
    root: {
      flex: 1,
    },
    body: {
      flex: 1,
    },
    container: {
      width: '100%',
      display: 'flex',
      padding: 16,
    },
    divider: {
      marginTop: 16,
      width: '100%',
      borderTopWidth: 0.5,
    },
    textAvailableVoucher: {
      marginVertical: 16,
      width: '100%',
      textAlign: 'left',
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
  });
  return result;
};

const Redeem = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const totalPoint = useSelector(
    state => state.rewardsReducer?.dataPoint?.totalPoint,
  );

  useEffect(() => {
    const loadData = async () => {
      await dispatch(dataPointHistory());
      await dispatch(myProgressBarCampaign());
    };
    loadData();
  }, [dispatch, totalPoint]);

  const renderDivider = () => {
    return <View style={styles.divider} />;
  };

  const renderTextAvailableVoucher = () => {
    return <Text style={styles.textAvailableVoucher}>Available Voucher</Text>;
  };

  const renderBodyContent = () => {
    return (
      <ScrollView style={styles.container}>
        <MembershipInfo />
        {renderDivider()}
        {renderTextAvailableVoucher()}
        <VoucherList />
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Points and Voucher" />
      <Body style={styles.body}>{renderBodyContent()}</Body>
    </SafeAreaView>
  );
};

export default Redeem;
