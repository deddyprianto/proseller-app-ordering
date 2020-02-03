import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import Icon from 'react-native-vector-icons/Ionicons';

class RewardsStamp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
      stampsItem: [],
    };
  }

  componentDidMount = async () => {
    await this.getItemStamp();
  };

  getItemStamp() {
    var stampsItem = [];
    console.log('item stampts ', this.props.dataStamps.dataStamps);
    if (this.props.dataStamps.dataStamps != undefined) {
      var tampung = this.props.dataStamps.dataStamps.stamps.stampsItem;
      var isi = [];
      for (let i = 1; i <= tampung.length; i++) {
        isi.push(tampung[i - 1]);
        if (i % 5 == 0) {
          stampsItem.push(isi);
          isi = [];
        }
        if (i == tampung.length) {
          stampsItem.push(isi);
        }
      }
    }
    this.setState({stampsItem});
  }

  render() {
    let that = this;
    setTimeout(() => {
      that.getItemStamp();
    }, 10000);
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Stamp Card</Text>
        <View style={styles.card}>
          {this.state.stampsItem.map((items, keys) => (
            <View
              key={keys}
              style={{
                marginTop: 5,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              {items.map((item, key) => (
                <TouchableOpacity
                  key={key}
                  style={
                    item.stampsStatus == '-' ? styles.item : styles.itemFree
                  }>
                  <Text
                    style={
                      item.stampsStatus == '-'
                        ? styles.detail
                        : styles.detailFree
                    }>
                    {/*{appConfig.appName}*/}
                    <Icon
                      size={22}
                      name={Platform.OS === 'ios' ? 'ios-bookmark' : 'md-bookmark'}
                      style={{color: colorConfig.store.defaultColor}}
                    />
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    backgroundColor: colorConfig.pageIndex.activeTintColor,
  },
  title: {
    color: colorConfig.pageIndex.backgroundColor,
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    height: Dimensions.get('window').height / 6 - 200,
    width: Dimensions.get('window').width - 20,
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: colorConfig.pageIndex.activeTintColor,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 10,
  },
  item: {
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    width: 40,
    height: 40,
    borderRadius: 40,
    marginHorizontal: 5,
    paddingVertical: 12,
    alignItems: 'center',
  },
  detail: {
    textAlign: 'center',
    fontSize: 10,
  },
  itemFree: {
    backgroundColor: colorConfig.pageIndex.listBorder,
    width: 40,
    height: 40,
    borderRadius: 40,
    marginHorizontal: 5,
    paddingVertical: 12,
    alignItems: 'center',
  },
  detailFree: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold',
    color: colorConfig.pageIndex.backgroundColor,
  },
});

mapStateToProps = state => ({
  dataStamps: state.rewardsReducer.getStamps,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(RewardsStamp);
