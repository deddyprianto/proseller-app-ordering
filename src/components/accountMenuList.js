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
          <Text> Point </Text>
          <Text> > </Text>
        </TouchableOpacity>

        <View style={styles.line}></View>

        <TouchableOpacity style={styles.item}>
          <Text> History </Text>
          <Text> > </Text>
        </TouchableOpacity>
        
        <View style={styles.line}></View>

        <TouchableOpacity style={styles.item}>
          <Text> Setting </Text>
          <Text> > </Text>
        </TouchableOpacity>

        <View style={styles.line}></View>

        <TouchableOpacity style={styles.item} onPress={this.logout}>
          <Text> Logout </Text>
          <Text> > </Text>
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
  }
});


mapStateToProps = (state) => ({
  logoutUser: state.authReducer.logoutUser
})

mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(AccountMenuList);
