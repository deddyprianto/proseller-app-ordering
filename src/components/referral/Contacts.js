/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Platform,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import ListItem from './ListItem';
import {isEmptyArray} from '../../helper/CheckEmpty';
import Icon from 'react-native-vector-icons/Ionicons';
import colorConfig from '../../config/colorConfig';
import {Actions} from 'react-native-router-flux';

export default class Contacts extends Component {
  constructor(props) {
    super(props);

    let {dataContacts} = this.props;
    if (dataContacts == undefined) {
      dataContacts = [];
    }

    this.state = {
      dataContacts,
      dataSource: dataContacts,
    };
  }

  goBack = async () => {
    Actions.pop();
  };

  componentDidMount() {
    try {
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackPress,
      );
    } catch (e) {}
  }

  componentWillUnmount() {
    try {
      this.backHandler.remove();
    } catch (e) {}
  }

  handleBackPress = () => {
    this.goBack();
    return true;
  };

  openContact = item => {
    try {
      this.props.setPhoneNumber(item);
    } catch (e) {}
    this.goBack();
  };

  search = key => {
    const {dataContacts, dataSource} = this.state;
    if (key == '' || key == null) {
      this.setState({dataContacts: dataSource});
    }

    try {
      let list = JSON.stringify(dataContacts);
      list = JSON.parse(list);
      if (!isEmptyArray(dataContacts)) {
        list = dataSource.filter(item =>
          item.name.toLowerCase().includes(key.toLowerCase()),
        );

        this.setState({dataContacts: list});
      }
    } catch (e) {}
  };

  render() {
    let {dataContacts} = this.state;
    if (dataContacts == undefined) {
      dataContacts = [];
    }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <View
            style={[
              styles.header,
              {backgroundColor: colorConfig.pageIndex.backgroundColor},
            ]}>
            <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
              <Icon
                size={28}
                name={
                  Platform.OS === 'ios'
                    ? 'ios-arrow-back'
                    : 'md-arrow-round-back'
                }
                style={styles.btnBackIcon}
              />
              <Text style={styles.btnBackText}> Contact List </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            onChangeText={search => this.search(search)}
            placeholder="Search"
            style={styles.searchBar}
          />
          <FlatList
            data={dataContacts}
            renderItem={(contact, index) => {
              return (
                <ListItem
                  key={index}
                  item={contact}
                  onPress={this.openContact}
                />
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 65,
    marginBottom: 20,
    justifyContent: 'center',
    // backgroundColor: colorConfig.store.defaultColor,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  btnBackIcon: {
    marginLeft: 10,
    color: colorConfig.store.defaultColor,
    margin: 10,
  },
  btnBack: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // width: 100,
    height: 80,
  },
  btnBackText: {
    color: colorConfig.store.defaultColor,
    fontWeight: 'bold',
    fontSize: 17,
  },
  searchBar: {
    backgroundColor: '#f0eded',
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
});
