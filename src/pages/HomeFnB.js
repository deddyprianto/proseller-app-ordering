/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';
import {RefreshControl, ScrollView} from 'react-native';

import Banner from '../components/banner';
import Menu from '../components/menu/Menu';

const HomeFnB = ({handleOnRefresh, isRefresh}) => {
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isRefresh} onRefresh={handleOnRefresh} />
      }>
      <Banner />
      <Menu />
    </ScrollView>
  );
};

export default HomeFnB;
