import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl ,
  TouchableOpacity
} from 'react-native';
import {connect} from "react-redux";
import {compose} from "redux";

import {logoutUser} from "../actions/auth.actions";
import AccountUserDetail from "../components/accountUserDetail";
import AccountMenuList from "../components/accountMenuList";

import colorConfig from "../config/colorConfig";
import appConfig from "../config/appConfig";

class Account extends Component {
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
      <View style={{
      }}>
        <AccountUserDetail/>
        <AccountMenuList/>
      </View>
    );
  }
}

mapStateToProps = (state) => ({
  logoutUser: state.authReducer.logoutUser
})

mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Account);
