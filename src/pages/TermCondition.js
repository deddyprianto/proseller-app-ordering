/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  View,
  TouchableOpacity,
  Platform,
  ScrollView,
  BackHandler,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {compose} from 'redux';

import colorConfig from '../config/colorConfig';
import Loader from '../components/loader';
import Icon from 'react-native-vector-icons/Ionicons';
import {getTermsConditions} from '../actions/order.action';

class TermsCondition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      loading: true,
      data: '',
    };
  }

  componentDidMount = async () => {
    const response = await this.props.dispatch(getTermsConditions());
    if (response != false) {
      const find = response.settings.find(
        item => item.settingKey === 'TermCondition',
      );

      if (find != undefined) {
        await this.setState({data: find.settingValue});
      }
    }

    try {
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackPress,
      );
    } catch (e) {}

    await this.setState({loading: false});
  };

  handleBackPress = () => {
    this.goBack();
    return true;
  };

  goBack = async () => {
    Actions.pop();
  };

  render() {
    const {data} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading && <Loader />}
        <View
          style={[
            styles.header,
            {backgroundColor: colorConfig.pageIndex.backgroundColor},
          ]}>
          <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
            <Icon
              size={28}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
              }
              style={styles.btnBackIcon}
            />
            <Text style={styles.btnBackText}> Terms & Conditions </Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View
            style={{
              paddingHorizontal: 15,
              paddingVertical: 10,
              paddingBottom: 50,
            }}>
            <Text
              selectable
              style={{color: colorConfig.store.titleSelected, lineHeight: 22}}>
              {data}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnBackIcon: {
    marginLeft: 10,
    color: colorConfig.store.defaultColor,
    margin: 10,
  },
  header: {
    height: 60,
    marginBottom: 20,
    justifyContent: 'center',
    // backgroundColor: colorConfig.store.defaultColor,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  btnBack: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // width: 100,
    height: 80,
  },
  btnBackText: {
    color: colorConfig.store.defaultColor,
    fontWeight: 'bold',
    fontSize: 17,
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
  card: {
    margin: 5,
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
  },
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    null,
    mapDispatchToProps,
  ),
)(TermsCondition);
