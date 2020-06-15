import React, {Component} from 'react';
import {Dimensions, Platform, Text, View} from 'react-native';
import colorConfig from '../../config/colorConfig';
import Icon from 'react-native-vector-icons/Ionicons';
import {compose} from 'redux';
import {connect} from 'react-redux';

class IconMail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
    };
  }

  countUnreadInbox = () => {
    try {
      const {dataInbox} = this.props;
      let count = dataInbox.Data.filter(item => item.isRead != true);
      return count.length;
    } catch (e) {
      return 0;
    }
  };

  renderBadgeInbox = () => {
    const {dataInbox} = this.props;
    if (dataInbox != undefined) {
      return (
        <View
          style={{
            position: 'absolute',
            width: this.countUnreadInbox() < 10 ? 23 : null,
            height: 23,
            bottom: 10,
            left: 15,
            zIndex: 2,
            borderRadius: 50,
            backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 5,
            paddingRight: 5,
            paddingTop: 5,
            paddingBottom: 5,
            borderColor: colorConfig.pageIndex.backgroundColor,
            borderWidth: 2,
          }}>
          <Text
            style={{
              color: colorConfig.pageIndex.backgroundColor,
              fontSize: 9,
              width: '100%',
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            {this.countUnreadInbox()}
          </Text>
        </View>
      );
    }
  };

  render() {
    return (
      <View>
        {this.countUnreadInbox() !== 0 ? this.renderBadgeInbox() : null}
        <Icon
          size={28}
          name={Platform.OS === 'ios' ? 'ios-mail' : 'md-mail'}
          style={{color: this.props.tintColor}}
        />
      </View>
    );
  }
}

mapStateToProps = state => ({
  dataInbox: state.inboxReducer.dataInbox.broadcast,
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
)(IconMail);
