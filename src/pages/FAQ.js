import React, {useEffect, useState} from 'react';

import {StyleSheet, SafeAreaView, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {getFaqs} from '../actions/setting.action';
import {dataStores} from '../actions/stores.action';
import FAQList from '../components/faqList';
import FieldSearch from '../components/fieldSearch';

import {groupBy} from 'lodash';

import {Header} from '../components/layout';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  viewSearch: {
    marginHorizontal: 16,
    marginVertical: 20,
  },
});

const FAQ = () => {
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const faqs = await dispatch(getFaqs());
      const groupByCategory = groupBy(faqs, 'category');

      const result = Object.entries(groupByCategory).map(data => ({
        ['type']: data[0],
        ['faqs']: data[1],
      }));

      setItems(result);
    };

    loadData();
  }, [dispatch]);

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

  useEffect(() => {
    const loadData = async () => {
      await dispatch(dataStores());
    };
    loadData();
  }, [dispatch]);

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
      <View>
        <Header title="FAQs" />
      </View>
      {renderSearch()}
      <FAQList faqs={handleOutletSearch()} searchQuery={searchQuery} />
    </SafeAreaView>
  );
};

export default FAQ;
