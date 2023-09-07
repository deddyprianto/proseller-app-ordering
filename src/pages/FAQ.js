/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';

import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {getFaqs} from '../actions/setting.action';
import {dataStores} from '../actions/stores.action';
import FAQList from '../components/faqList';
import FieldSearch from '../components/fieldSearch';

import {groupBy} from 'lodash';

import {Header, Body} from '../components/layout';
import LoadingScreen from '../components/loadingScreen/LoadingScreen';
import useBackHandler from '../hooks/backHandler/useBackHandler';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  viewSearch: {
    marginHorizontal: 16,
    marginVertical: 20,
  },
  scrollContainerStyle: {
    paddingBottom: 80,
  },
});

const FAQ = () => {
  const dispatch = useDispatch();
  useBackHandler();
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loadingFaq, setLoadingFaq] = React.useState(false);
  const loadData = async hideLoading => {
    if (!hideLoading) {
      setLoadingFaq(true);
    }
    const faqs = await dispatch(getFaqs());
    const groupByCategory = groupBy(faqs, 'category');

    const result = Object.entries(groupByCategory).map(data => ({
      ['type']: data[0],
      ['faqs']: data[1],
    }));

    setItems(result);
    setLoadingFaq(false);
  };

  useEffect(() => {
    loadData();
    loadDataStore();
  }, []);

  const handleOutletSearch = () => {
    if (searchQuery) {
      let itemSearch = [];

      items.map(item => {
        const result = item.faqs.filter(faq =>
          faq.question.toUpperCase().includes(searchQuery.toUpperCase()),
        );
        itemSearch.push(...result);
      });

      return itemSearch;
    }
    return items;
  };

  const loadDataStore = async () => {
    await dispatch(dataStores());
  };

  const renderSearch = () => {
    const replacePlaceholder =
      searchQuery && `search result for "${searchQuery}"`;
    return (
      <View style={styles.viewSearch}>
        <FieldSearch
          value={searchQuery}
          onChange={value => {
            setSearchQuery(value);
          }}
          placeholder="Try to search “order”"
          replacePlaceholder={replacePlaceholder}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <LoadingScreen loading={loadingFaq} />
      <View>
        <Header title="FAQs" />
      </View>
      <Body>
        <ScrollView
          stickyHeaderIndices={[0]}
          contentContainerStyle={styles.scrollContainerStyle}
          refreshControl={
            <RefreshControl
              onRefresh={() => loadData(true)}
              refreshing={false}
            />
          }>
          {renderSearch()}
          <FAQList faqs={handleOutletSearch()} searchQuery={searchQuery} />
        </ScrollView>
      </Body>
    </SafeAreaView>
  );
};

export default FAQ;
