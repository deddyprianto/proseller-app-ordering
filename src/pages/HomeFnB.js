/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';
import {
  RefreshControl,
  ScrollView,
  SafeAreaView,
  View,
  StyleSheet,
} from 'react-native';

import BannerFnB from '../components/bannerFnB';

import {Body, Header} from '../components/layout';
import Menu from '../components/menu/Menu';

const useStyles = () => {
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    marginBottom: {
      marginBottom: 20,
    },
  });
  return styles;
};
const HomeFnB = ({handleOnRefresh, isRefresh}) => {
  const styles = useStyles();
  return (
    <SafeAreaView style={styles.root}>
      <Header isMiddleLogo isRemoveBackIcon />
      <Body>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefresh}
              onRefresh={handleOnRefresh}
            />
          }>
          <BannerFnB bottom={-20} placement={'top'} />
          <Menu />
          <BannerFnB bottom={-20} placement={'bottom'} />
          <View style={styles.marginBottom} />
        </ScrollView>
      </Body>
    </SafeAreaView>
  );
};

export default HomeFnB;
