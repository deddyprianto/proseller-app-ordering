import React, {useEffect, useState} from 'react';

import {StyleSheet, SafeAreaView, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {dataStores} from '../actions/stores.action';
import FAQList from '../components/faqList';
import FieldSearch from '../components/fieldSearch';

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

  const items = [
    {
      type: 'Online Orders',
      faqs: [
        {
          title: 'Can I cancel my order after placing it?',
          description:
            'You will not able to change your order details upon placing your order. ',
        },
        {
          title:
            'Can I chage my order details (items/delivery or pick-up date/timing etc) after placing an order?',
          description:
            'You will not able to change your order details upon placing your order. ',
        },
        {
          title: 'How do I choose which outlet to place my order at?',
          description:
            'You will not able to change your order details upon placing your order. ',
        },
        {
          title: 'How do I know if my order is confirmed?',
          description:
            'You will not able to change your order details upon placing your order. ',
        },
      ],
    },
    {
      type: 'Offline Orders',
      faqs: [
        {
          title: 'How do I place an online order?',
          description:
            'You will not able to change your order details upon placing your order. ',
        },
        {
          title: 'How far ahead may I place my order?',
          description:
            'You will not able to change your order details upon placing your order. ',
        },
        {
          title: 'How much is the delivery fee?',
          description:
            'You will not able to change your order details upon placing your order. ',
        },
      ],
    },
  ];

  const handleOutletSearch = () => {
    if (searchQuery) {
      let itemSearch = [];

      items.map(item => {
        const result = item.faqs.filter(faq =>
          faq.title.toUpperCase().includes(searchQuery.toUpperCase()),
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
      <FAQList questions={handleOutletSearch()} searchQuery={searchQuery} />
    </SafeAreaView>
  );
};

export default FAQ;
