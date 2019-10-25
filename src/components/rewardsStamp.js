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

class RewardsStamp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Stamp Card</Text>
        {/* {console.log(this.props.dataStamps.dataStamps)} */}
        <View style={styles.card}>
          {this.props.dataStamps.dataStamps == undefined ? null : (
            <ScrollView
              horizontal={true}
              Style={{
                flex: 1,
                alignContent: 'space-between',
                justifyContent: 'center',
              }}
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
              }}
              showsHorizontalScrollIndicator={false}>
              {this.props.dataStamps.dataStamps.length == 0
                ? null
                : this.props.dataStamps.dataStamps.stamps.stampsItem.map(
                    (item, key) => (
                      <TouchableOpacity
                        key={key}
                        style={
                          item.stampsStatus == '-'
                            ? styles.item
                            : styles.itemFree
                        }>
                        <Text
                          style={
                            item.stampsStatus == '-'
                              ? styles.detail
                              : styles.detailFree
                          }>
                          {appConfig.appName}
                        </Text>
                      </TouchableOpacity>
                    ),
                  )}
            </ScrollView>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height / 5 - 15,
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
    marginTop: 5,
    backgroundColor: colorConfig.pageIndex.activeTintColor,
    justifyContent: 'space-between',
    flexDirection: 'row',
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
