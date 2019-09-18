import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl ,
  TouchableOpacity,
  Image
} from 'react-native';
import {connect} from "react-redux";
import {compose} from "redux";
import Icon from 'react-native-vector-icons/Ionicons';

import {logoutUser} from "../actions/auth.actions";
import colorConfig from "../config/colorConfig";
import appConfig from "../config/appConfig";

class AccountMenuList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  logout = async () => {
    const response =  await this.props.dispatch(logoutUser());
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.title}> {this.props.totalPoint+' Points'} </Text>
          <Icon size={20} 
            name={ Platform.OS === 'ios' ? 'ios-arrow-dropright-circle' : 'md-arrow-dropright-circle' } 
            style={{ color: colorConfig.pageIndex.activeTintColor }} />
        </TouchableOpacity>

        <View style={styles.line}></View>

        <TouchableOpacity style={styles.item}
        onPress={() => this.props.screen.navigation.navigate('History')}>
          <Text style={styles.title}> History </Text>
          <Icon size={20} 
            name={ Platform.OS === 'ios' ? 'ios-arrow-dropright-circle' : 'md-arrow-dropright-circle' } 
            style={{ color: colorConfig.pageIndex.activeTintColor }} />
        </TouchableOpacity>
        
        <View style={styles.line}></View>

        <TouchableOpacity style={styles.item}>
          <Text style={styles.title}> Setting </Text>
          <Icon size={20} 
            name={ Platform.OS === 'ios' ? 'ios-arrow-dropright-circle' : 'md-arrow-dropright-circle' } 
            style={{ color: colorConfig.pageIndex.activeTintColor }} />
        </TouchableOpacity>

        <View style={styles.line}></View>

        <TouchableOpacity style={styles.item} onPress={this.logout}>
          <Text style={styles.title}> Logout </Text>
          <Icon size={20} 
            name={ Platform.OS === 'ios' ? 'ios-arrow-dropright-circle' : 'md-arrow-dropright-circle' } 
            style={{ color: colorConfig.pageIndex.activeTintColor }} />
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    borderRadius: 15,
    marginLeft: 20,
    marginRight: 20,
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
  },
  item: {
    margin: 10,
    flexDirection:'row', 
    justifyContent: 'space-between'
  },
  line: {
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    borderBottomWidth: 1,
    marginLeft: 10,
    marginRight:10
  },
  title: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 14,
  }
});


mapStateToProps = (state) => ({
  logoutUser: state.authReducer.logoutUser,
  userDetail: state.userReducer.getUser.userDetails,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint
})

mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(AccountMenuList);
