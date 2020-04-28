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
  Platform,
  TouchableOpacity,
  Image,
  BackHandler,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

import colorConfig from '../config/colorConfig';
import ProgressiveImage from './helper/ProgressiveImage';

export default class StoreDetailPromotion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
    };
  }

  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackPress = () => {
    this.goBack();
    return true;
  };

  goBack = async () => {
    Actions.pop();
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {console.log(this.props.dataPromotion)}
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
        <View style={styles.card}>
          <ProgressiveImage
            resizeMode="stretch"
            style={styles.imageStamp}
            source={{uri: this.props.dataPromotion.defaultImageURL}}
          />
          <View style={styles.item}>
            <Text style={styles.title}>{this.props.dataPromotion.name}</Text>
          </View>
          <View style={styles.detail}>
            <View style={styles.detailItem}>
              <Text style={styles.desc}>
                {this.props.dataPromotion.description}
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
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
    margin: 5,
    borderColor: colorConfig.pageIndex.inactiveTintColor,
    borderWidth: 1,
    borderRadius: 5,
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
  item: {
    alignItems: 'center',
    borderBottomColor: colorConfig.pageIndex.grayColor,
    borderBottomWidth: 1,
    margin: 10,
  },
  title: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 18,
    padding: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 5,
    marginBottom: 10,
  },
  desc: {
    color: colorConfig.pageIndex.grayColor,
    maxWidth: Dimensions.get('window').width,
    textAlign: 'right',
    alignItems: 'flex-start',
    fontSize: 14,
  },
  image: {
    width: Dimensions.get('window').width - 40,
    flex: 1,
  },
  imageStamp: {
    width: '100%',
    height: 130,
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
