import React, {Component} from 'react';
import {View, Text, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import colorConfig from '../config/colorConfig';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

class RewardsPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
      rewardPoint: 0,
    };
  }

  render() {
    const {intlData, campaignActive, totalPoint} = this.props;
    const HEIGHT = campaignActive ? 3 : 5;
    return (
      <View
        style={{
          backgroundColor: colorConfig.pageIndex.activeTintColor,
          height: this.state.screenHeight / HEIGHT - 30,
        }}>
        {totalPoint != undefined && campaignActive ? (
          <View>
            <Text
              style={{
                color: colorConfig.pageIndex.backgroundColor,
                textAlign: 'center',
                paddingTop: 20,
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              {intlData.messages.myPoints}
            </Text>
            <Text
              style={{
                color: colorConfig.pageIndex.backgroundColor,
                textAlign: 'center',
                fontSize: 42,
                fontFamily: 'Lato-Bold',
              }}>
              {totalPoint}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }
}

mapStateToProps = state => ({
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
  campaignActive: state.rewardsReducer.dataPoint.campaignActive,
  intlData: state.intlData,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(RewardsPoint);
