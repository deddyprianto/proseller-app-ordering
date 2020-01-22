import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';

import colorConfig from '../config/colorConfig';

class StampDetail extends Component {
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
        <Text style={styles.title}>
          {this.props.dataStamps.dataStamps.stamps.stampsTitle}
        </Text>
        <Text style={styles.subTitle}>
          {this.props.dataStamps.dataStamps.stamps.stampsSubTitle}
        </Text>
        <Text style={styles.description}>
          {this.props.dataStamps.dataStamps.stamps.stampsDesc}
        </Text>
      </View>
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
    alignItems: 'center',
  },
  title: {
    color: colorConfig.pageIndex.backgroundColor,
    fontSize: 14,
    fontWeight: 'bold',
  },
  subTitle: {
    color: colorConfig.pageIndex.backgroundColor,
    fontSize: 12,
  },
  description: {
    color: colorConfig.pageIndex.backgroundColor,
    textAlign: 'center',
    fontSize: 14,
  },
  btn: {
    color: colorConfig.pageIndex.listBorder,
    fontSize: 14,
    paddingTop: 5,
    fontWeight: 'bold',
  },
});

mapStateToProps = state => ({
  dataStamps: state.rewardsReducer.getStamps,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  StampDetail,
);
