import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Platform,
  Picker,
  SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';

import {logoutUser} from '../actions/auth.actions';
import AccountUserDetail from '../components/accountUserDetail';
import AccountMenuList from '../components/accountMenuList';
import colorConfig from '../config/colorConfig';
import {Dialog} from 'react-native-paper';
import {updateLanguage} from '../actions/language.action';
import Languages from '../service/i18n/languages';
import {getUserProfile} from '../actions/user.action';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      loadingLogout: false,
      dialogChangeLanguage: false,
    };
  }

  componentDidMount = async () => {
    // await this.getDataRewards();
  };

  getDataRewards = async () => {
    try {
      await this.props.dispatch(getUserProfile());
    } catch (error) {}
  };

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getDataRewards();
    this.setState({refreshing: false});
  };

  logout = async () => {
    this.setState({loadingLogout: true});
    await this.props.dispatch(logoutUser());
    this.setState({loadingLogout: false});
  };

  // myVouchers = () => {
  //   var myVoucers = [];
  //   if (this.props.myVoucers != undefined) {
  //     _.forEach(
  //       _.groupBy(
  //         this.props.myVoucers.filter(voucher => voucher.deleted == false),
  //         'id',
  //       ),
  //       function(value, key) {
  //         value[0].totalRedeem = value.length;
  //         myVoucers.push(value[0]);
  //       },
  //     );
  //   }
  //   Actions.accountVouchers({data: myVoucers});
  // };

  _updateLanguage = async lang => {
    await this.props.dispatch(updateLanguage(lang));
    await this.setState({dialogChangeLanguage: false});
  };

  renderDialogChangeLanguage = () => {
    const {intlData} = this.props;

    const options = Languages.map(language => {
      return (
        <Picker.Item
          value={language.code}
          key={language.code}
          label={language.name}
        />
      );
    });

    return (
      <Dialog
        dismissable={true}
        visible={this.state.dialogChangeLanguage}
        onDismiss={() => this.setState({dialogChangeLanguage: false})}>
        <Dialog.Content>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            {intlData.messages.selectLanguage}
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <View style={styles.panelQty}>
              <Picker
                style={{height: 60, width: 300}}
                selectedValue={intlData.locale}
                onValueChange={itemValue => this._updateLanguage(itemValue)}>
                {options}
              </Picker>
            </View>
          </View>
        </Dialog.Content>
      </Dialog>
    );
  };

  setLanguage = () => {
    this.setState({dialogChangeLanguage: true});
  };

  render() {
    const {intlData} = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <View style={styles.card}>
            <AccountUserDetail screen={this.props} />
          </View>
          <View style={styles.card}>
            <AccountMenuList
              setLanguage={this.setLanguage}
              dialogChangeLanguage={this.state.dialogChangeLanguage}
              screen={this.props}
            />
          </View>
        </ScrollView>
        {this.renderDialogChangeLanguage()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  point: {
    margin: 10,
    flexDirection: 'row',
    borderRadius: 10,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    // width: Dimensions.get('window').width / 2 - 30,
  },
  card: {
    // marginVertical: 10,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
});

mapStateToProps = state => ({
  userDetail: state.userReducer.getUser.userDetails,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
  myVoucers: state.accountsReducer.myVoucers.myVoucers,
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
)(Account);
