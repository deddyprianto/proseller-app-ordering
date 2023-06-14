/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';
import {RefreshControl, ScrollView, SafeAreaView} from 'react-native';

import BannerFnB from '../components/bannerFnB';

import {Header} from '../components/layout';
import Menu from '../components/menu/Menu';

const HomeFnB = ({handleOnRefresh, isRefresh}) => {
  return (
    <SafeAreaView>
      <Header isMiddleLogo isRemoveBackIcon />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefresh} onRefresh={handleOnRefresh} />
        }>
        <BannerFnB bottom={-20} />
        <Menu />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeFnB;
