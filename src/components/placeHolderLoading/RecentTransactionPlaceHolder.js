import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import colorConfig from '../../config/colorConfig';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

export default class RecentTransactionPlaceHolder extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <View>
          <View style={[styles.item, {justifyContent: 'center'}]}>
            <ShimmerPlaceHolder
              width={270}
              height={25}
              autoRun={true}
              duration={800}
              colorShimmer={[
                colorConfig.store.disableButton,
                'white',
                colorConfig.store.disableButton,
              ]}
            />
          </View>
          <View style={styles.line} />
        </View>
        <View>
          <View style={[styles.item, {justifyContent: 'center'}]}>
            <ShimmerPlaceHolder
              width={270}
              height={25}
              autoRun={true}
              duration={800}
              colorShimmer={[
                colorConfig.store.disableButton,
                'white',
                colorConfig.store.disableButton,
              ]}
            />
          </View>
          <View style={styles.line} />
        </View>
        <View>
          <View style={[styles.item, {justifyContent: 'center'}]}>
            <ShimmerPlaceHolder
              width={270}
              height={25}
              autoRun={true}
              duration={800}
              colorShimmer={[
                colorConfig.store.disableButton,
                'white',
                colorConfig.store.disableButton,
              ]}
            />
          </View>
          <View style={styles.line} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    margin: 10,
  },
  title: {
    color: colorConfig.store.title,
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 10,
    fontFamily: 'Poppins-Medium',
  },
  card: {
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    borderRadius: 15,
    marginLeft: 10,
    marginRight: 10,
    borderColor: colorConfig.store.border,
    // borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
  item: {
    padding: 5,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    borderBottomWidth: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  imageLogo: {
    width: 30,
    height: 20,
    paddingTop: 5,
    marginBottom: 5,
    color: colorConfig.store.defaultColor,
  },
});
