import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image
} from 'react-native';
import {connect} from "react-redux";
import {compose} from "redux";
import Icon from 'react-native-vector-icons/Ionicons';
import * as _ from 'lodash';

import colorConfig from "../config/colorConfig";
import appConfig from "../config/appConfig";

class Inbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <ScrollView style={styles.component}>
        <TouchableOpacity style={styles.item}>
          <View style={styles.sejajarSpace}>
            <View style={styles.imageDetail}>
              <Image style={{
                height: 40,
                width: 40,
                borderRadius: 40,
                borderColor: colorConfig.pageIndex.activeTintColor,
                borderWidth: 1
              }} 
                source={appConfig.appImageNull}/>
            </View>
            <View style={styles.detail}>
              <Text style={styles.storeName}>Title</Text>
              <Text style={styles.paymentType}>Subtitle</Text>
            </View>
            <View style={styles.btnDetail}>
              <Icon size={20} 
              name={ Platform.OS === 'ios' ? 'ios-arrow-dropright-circle' : 'md-arrow-dropright-circle' } 
              style={{ color: colorConfig.pageIndex.activeTintColor }} />
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  component: {
    marginTop: 10
  },
  empty: {
    color: colorConfig.pageIndex.inactiveTintColor,
    textAlign: 'center'
  },
  item: {
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 2,
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colorConfig.pageIndex.backgroundColor
  },
  sejajarSpace: {
    flexDirection:'row', 
    justifyContent: 'space-between'
  },
  detail: {
    paddingTop:5,
    paddingRight: 5,
    paddingBottom:5,
    width: Dimensions.get('window').width-120
  },
  storeName: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 16,
    fontWeight: 'bold'
  },
  paymentTgl: {
    color: colorConfig.pageIndex.inactiveTintColor,
  },
  paymentTypeLogo: {
    width: 20,
    height: 15,
    marginTop: 2,
  },
  paymentType: {
    color: colorConfig.pageIndex.activeTintColor,
  },
  itemType: {
    color: colorConfig.pageIndex.inactiveTintColor,
    fontSize: 12,
    fontStyle: 'italic'
  },
  btnDetail: {
    alignItems: 'center',
    width: 40,
    paddingTop: 15
  },
  imageDetail: {
    alignItems: 'center',
    width: 60,
    paddingTop: 5
  }
});

mapStateToProps = (state) => ({
  pointTransaction : state.rewardsReducer.dataPoint.pointTransaction
});

mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Inbox);
