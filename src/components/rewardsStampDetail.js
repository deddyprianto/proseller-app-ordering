import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import ProgressiveImage from '../components/helper/ProgressiveImage';
import {format} from 'date-fns';

class StampDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
    };
  }

  getImageUrl = () => {
    // this.props.dataStamps.dataStamps.stamps.stampsItem[0]['reward']['imageURL'];
    try {
      let data = this.props.dataStamps.dataStamps.stamps.stampsItem;
      for (let i = 0; i < data.length; i++) {
        if (
          data[i]['reward']['imageURL'] != null &&
          data[i]['reward']['imageURL'] != undefined &&
          data[i]['stampsStatus'] == '-'
        ) {
          return {uri: data[i]['reward']['imageURL']};
        }
      }
    } catch (e) {
      console.log(e);
    }
    return appConfig.appImageNull;
  };

  render() {
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <Text style={styles.title}>
            {this.props.dataStamps.dataStamps.stamps.stampsTitle}
          </Text>

          {this.props.dataStamps.dataStamps.stamps.stampsSubTitle !=
          undefined ? (
            <Text style={styles.subTitle}>
              {this.props.dataStamps.dataStamps.stamps.stampsSubTitle}
            </Text>
          ) : null}

          {this.props.dataStamps.dataStamps.stamps.stampsDesc != undefined ? (
            <Text style={styles.subTitle}>
              {this.props.dataStamps.dataStamps.stamps.stampsDesc}
            </Text>
          ) : null}

          {this.props.dataStamps.dataStamps.expiryDate != undefined ? (
            <View style={styles.box}>
              <Text style={styles.subTitle}>
                Your stamps will expire on{' '}
                <Text style={{fontWeight: 'bold'}}>
                  {format(
                    new Date(this.props.dataStamps.dataStamps.expiryDate),
                    'dd MMM yyyy',
                  )}
                </Text>
              </Text>
            </View>
          ) : null}
        </View>
        <View style={styles.stampsDescription}>
          <ProgressiveImage
            resizeMode="contain"
            style={styles.imageStamp}
            source={this.getImageUrl()}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    backgroundColor: colorConfig.pageIndex.activeTintColor,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    // paddingTop: 10,
    alignItems: 'center',
  },
  title: {
    color: colorConfig.pageIndex.backgroundColor,
    fontSize: 20,
    fontFamily: 'Lato-Bold',
    marginBottom: 5,
  },
  subTitle: {
    color: colorConfig.pageIndex.backgroundColor,
    fontSize: 13,
    marginBottom: 5,
    fontFamily: 'Lato-Medium',
    textAlign: 'center',
  },
  description: {
    color: colorConfig.pageIndex.backgroundColor,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Lato-Medium',
  },
  btn: {
    color: colorConfig.pageIndex.listBorder,
    fontSize: 14,
    paddingTop: 5,
    fontWeight: 'bold',
  },
  stampsDescription: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 20,
  },
  imageStamp: {
    height: Dimensions.get('window').height / 2,
    width: '100%',
    // borderRadius: 30,
    // marginHorizontal: 10,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
  box: {
    borderWidth: 1,
    padding: 7,
    borderColor: 'white',
    borderRadius: 9,
    marginTop: 10,
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
)(StampDetail);
