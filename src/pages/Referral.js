import React, {useEffect, useRef, useState} from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {Header} from '../components/layout';

import Theme from '../theme';
import ReferralInvitedList from '../components/referralInvitedList';
import ReferralBenefitList from '../components/referralBenefitList';
import ReferralHowItWorks from '../components/referralHowItWorks';
import ReferralCodeShare from '../components/referralCodeShare';
import appConfig from '../config/appConfig';
import {useDispatch, useSelector} from 'react-redux';
import {
  getReferralInfo,
  getReferralInvitedList,
} from '../actions/referral.action';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    textHeader: {
      marginTop: 28,
      textAlign: 'center',
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[24],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textFloatingButton: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewFloatingButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      elevation: 5,
      position: 'absolute',
      bottom: 60,
      right: 18,
      borderRadius: 100,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.buttonActive,
    },
    iconArrowUp: {
      width: 10,
      height: 10,
      marginRight: 8,
      tintColor: theme.colors.textSecondary,
    },
    divider: {
      width: 'auto',
      height: 1,
      backgroundColor: theme.colors.greyScale3,
      margin: 16,
    },
  });
  return styles;
};

const Referral = () => {
  const ref = useRef();
  const styles = useStyles();
  const dispatch = useDispatch();

  const [invitedListLimitLength, setInvitedListLimitLength] = useState(10);
  const [isShowFloatingButton, setIsShowFloatingButton] = useState(false);
  const [isInvitedList, setIsInvitedList] = useState(false);

  const referralInfo = useSelector(
    state => state.referralReducer.getReferralInfo.referralInfo,
  );

  const referralInvitedList = useSelector(
    state => state.referralReducer.getReferralInvitedList.referralInvitedList,
  );

  useEffect(() => {
    const loadData = async () => {
      await dispatch(getReferralInfo());
      await dispatch(getReferralInvitedList());
    };

    loadData();
  }, [dispatch]);

  const handleCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 50;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const handleShowFloatingButton = value => {
    if (value > isInvitedList) {
      setIsShowFloatingButton(true);
    } else {
      setIsShowFloatingButton(false);
    }
  };

  const renderDivider = () => {
    return <View style={styles.divider} />;
  };
  const renderHeader = () => {
    return <Text style={styles.textHeader}>Refer a friend and get bonus!</Text>;
  };

  const renderFloatingButtonToTop = () => {
    if (isShowFloatingButton) {
      return (
        <TouchableOpacity
          style={styles.viewFloatingButton}
          onPress={() => {
            ref.current.scrollTo({x: 0, y: 0, animated: true});
          }}>
          <Image source={appConfig.iconArrowUp} style={styles.iconArrowUp} />
          <Text style={styles.textFloatingButton}>Back to Top</Text>
        </TouchableOpacity>
      );
    }
  };

  const renderInvitedList = () => {
    return (
      <View
        onLayout={event => {
          const layout = event.nativeEvent.layout;
          setIsInvitedList(layout.y);
        }}>
        <ReferralInvitedList referralInvitedList={referralInvitedList} />
        <View style={styles.marginBottom30} />
      </View>
    );
  };

  const renderReferralBenefitList = () => {
    const senderBenefit = referralInfo?.senderBenefit;
    const referredBenefit = referralInfo?.receiverBenefits;
    return (
      <ReferralBenefitList
        senderBenefit={senderBenefit}
        referredBenefit={referredBenefit}
      />
    );
  };

  const renderReferralCodeShare = () => {
    const referralCode = referralInfo?.referral;
    return <ReferralCodeShare referralCode={referralCode} />;
  };

  const renderHowItWorks = () => {
    return <ReferralHowItWorks />;
  };

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Referral" />
      <ScrollView
        ref={ref}
        onScroll={e => {
          handleShowFloatingButton(e.nativeEvent.contentOffset.y);
          if (handleCloseToBottom(e.nativeEvent)) {
            setInvitedListLimitLength(invitedListLimitLength + 10);
          }
        }}
        scrollEventThrottle={0}>
        {renderHeader()}
        {renderReferralBenefitList()}
        {renderDivider()}
        {renderHowItWorks()}
        {renderDivider()}
        {renderReferralCodeShare()}
        {renderDivider()}
        {renderInvitedList()}
      </ScrollView>

      {renderFloatingButtonToTop()}
    </SafeAreaView>
  );
};

export default Referral;
