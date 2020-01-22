/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {compose} from 'redux';

import colorConfig from '../config/colorConfig';

class StoreSeeMorePromotion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
    };
  }

  goBack() {
    Actions.pop();
  }

  storeDetailPromotion = item => {
    Actions.storeDetailPromotion({dataPromotion: item});
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{backgroundColor: colorConfig.pageIndex.backgroundColor}}>
          <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
            <Icon
              size={28}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
              }
              style={styles.btnBackIcon}
            />
            <Text style={styles.btnBackText}> Back </Text>
          </TouchableOpacity>
          <View style={styles.line} />
        </View>
        <ScrollView>
          <View style={{paddingTop: 10, paddingBottom: 10}}>
            {this.props.dataPromotion == undefined
              ? null
              : this.props.dataPromotion.count < 0
              ? null
              : this.props.dataPromotion.data.map((item, key) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.card}
                    onPress={() => this.storeDetailPromotion(item)}>
                    <Image
                      resizeMode="stretch"
                      style={styles.image}
                      source={{uri: item.image}}
                    />
                  </TouchableOpacity>
                ))}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnBackIcon: {
    color: colorConfig.pageIndex.activeTintColor,
    margin: 10,
  },
  btnBack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnBackText: {
    color: colorConfig.pageIndex.activeTintColor,
    fontWeight: 'bold',
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
  card: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
  },
  image: {
    width: Dimensions.get('window').width - 22,
    height: Dimensions.get('window').width / 3,
    borderRadius: 5,
  },
});

mapStateToProps = state => ({
  dataPromotion: state.promotionReducer.dataPromotion.promotion,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(StoreSeeMorePromotion);
