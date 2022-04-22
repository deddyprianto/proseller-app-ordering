import React from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

import {ProgressBar} from 'react-native-paper';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import {Actions} from 'react-native-router-flux';

import VoucherList from '../components/voucherList';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  divider: {
    width: '100%',
    borderTopWidth: 0.5,
  },
  textWelcome: {
    fontSize: 14,
    color: 'white',
  },
  textName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  textYourPoint: {
    fontSize: 10,
    color: 'white',
  },
  textPointValue: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  textCurrentTier: {
    fontSize: 9,
    fontWeight: '500',
    color: 'white',
    width: '12%',
    textAlign: 'left',
  },
  textNextTier: {
    fontSize: 9,
    fontWeight: '500',
    color: 'white',
    width: '12%',
    textAlign: 'right',
  },
  textInfo: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  textPointAndHistory: {
    width: '100%',
    textAlign: 'center',
    color: colorConfig.primaryColor,
    textDecorationLine: 'underline',
    fontSize: 12,
    fontWeight: '600',
  },
  viewHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  viewPoint: {
    alignItems: 'flex-end',
  },
  viewFlexRowSpaceBetweenCenter: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewPointHeader: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: colorConfig.primaryColor,
    width: '100%',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },

  viewProgressBar: {
    width: '76%',
    justifyContent: 'center',
  },
  progressBar: {
    backgroundColor: 'white',
    height: 14,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 3,
  },
});

const Redeem = () => {
  const renderWelcome = () => {
    return (
      <View>
        <Text style={styles.textWelcome}>Welcome</Text>
        <Text style={styles.textName}>Jon Doe,</Text>
      </View>
    );
  };

  const renderPoint = () => {
    return (
      <View style={styles.viewPoint}>
        <Text style={styles.textYourPoint}>Your Points</Text>
        <Text style={styles.textPointValue}>55 PTS</Text>
      </View>
    );
  };

  const renderProgressBar = () => {
    return (
      <View style={styles.viewProgressBar}>
        <ProgressBar
          progress={0.5}
          color={colorConfig.primaryColor}
          style={styles.progressBar}
        />
        <Image
          style={{height: 29, width: 33, position: 'absolute', left: '45%'}}
          source={appConfig.funtoastCoffeeIcon}
        />
      </View>
    );
  };

  const renderCurrentTier = () => {
    return <Text style={styles.textCurrentTier}>SILVER</Text>;
  };

  const renderNextTier = () => {
    return <Text style={styles.textNextTier}>GOLD</Text>;
  };

  const renderWelcomeAndPoint = () => {
    return (
      <View style={styles.viewFlexRowSpaceBetweenCenter}>
        {renderWelcome()}
        {renderPoint()}
      </View>
    );
  };

  const renderTierAndProgressBar = () => {
    return (
      <View style={styles.viewFlexRowSpaceBetweenCenter}>
        {renderCurrentTier()}
        {renderProgressBar()}
        {renderNextTier()}
      </View>
    );
  };

  const renderTextInfo = () => {
    return (
      <Text style={styles.textInfo}>
        spend $300 by 31 December 2022 to upgrade to gold
      </Text>
    );
  };

  const renderPointHeader = () => {
    return (
      <View style={styles.viewPointHeader}>
        {renderWelcomeAndPoint()}
        <View style={{marginTop: '15%'}} />
        {renderTierAndProgressBar()}
        <View style={{marginTop: '15%'}} />
        {renderTextInfo()}
      </View>
    );
  };

  const renderTextPointAndHistory = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          Actions.pointDetailAndHistory();
        }}>
        <Text style={styles.textPointAndHistory}>Point detail and history</Text>
      </TouchableOpacity>
    );
  };

  const renderTextAvailableVoucher = () => {
    return (
      <Text
        style={{
          width: '100%',
          textAlign: 'left',
          fontSize: 12,
          fontWeight: '400',
        }}>
        Available Voucher
      </Text>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.viewHeader}>
        <View style={{marginTop: '5%'}} />
        {renderPointHeader()}
        <View style={{marginTop: '5%'}} />
        {renderTextPointAndHistory()}
        <View style={{marginTop: '5%'}} />
        <View style={styles.divider} />
        <View style={{marginTop: '5%'}} />
        {renderTextAvailableVoucher()}
        <View style={{marginTop: '5%'}} />
        <VoucherList />
      </View>
    </ScrollView>
  );
};

export default Redeem;
