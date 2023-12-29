import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';

import colorConfig from '../config/colorConfig';
import AutoHeightImage from 'react-native-auto-height-image';
import StampsPlaceHolder from './placeHolderLoading/StampsPlaceHolder';
import {isEmptyArray, isEmptyObject} from '../helper/CheckEmpty';
import {Actions} from 'react-native-router-flux';
import {navigate} from '../utils/navigation.utils';

class RewardsStamp extends Component {
  constructor(props) {
    super(props);

    this.stampsItem = [];

    this.state = {
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
      stampsItem: [],
      imageStamps: '',
    };
  }

  componentDidMount = async () => {
    await this.getItemStamp();
  };

  getItemStamp() {
    var stampsItem = [];
    try {
      if (
        this.props.dataStamps.dataStamps != undefined &&
        this.props.dataStamps.dataStamps.stamps != undefined
      ) {
        var tampung = this.props.dataStamps.dataStamps.stamps.stampsItem;
        var isi = [];
        for (let i = 1; i <= tampung.length; i++) {
          isi.push(tampung[i - 1]);
          if (i % 5 == 0) {
            stampsItem.push(isi);
            isi = [];
          }
          if (i == tampung.length) {
            stampsItem.push(isi);
          }
        }
      }
      // this.setState({stampsItem});
    } catch (e) {
      Alert.alert('Sorry', 'Cant get data stampts');
    }
    // return data
    if (!isEmptyArray(stampsItem))
      return stampsItem.map((items, keys) => (
        <View
          key={keys}
          style={{
            marginTop: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {items.map((item, key) => (
            <View
              key={key}
              style={item.stampsStatus == '-' ? styles.item : styles.itemFree}>
              <Text
                style={
                  item.stampsStatus == '-' ? styles.detail : styles.detailFree
                }>
                {/*<Icon*/}
                {/*  size={22}*/}
                {/*  name={Platform.OS === 'ios' ? 'ios-bookmark' : 'md-bookmark'}*/}
                {/*  style={{color: colorConfig.store.defaultColor}}*/}
                {/*/>*/}
              </Text>
            </View>
          ))}
        </View>
      ));
    else return null;
  }

  getImageStamps = () => {
    try {
      let data = this.props.dataStamps.dataStamps.stamps.stampsItem;
      for (let i = 0; i < data.length; i++) {
        if (data[i]['stampsStatus'] == '-') {
          if (i > 0) {
            if (
              data[i - 1]['reward']['imageURL'] != undefined &&
              data[i - 1]['reward']['imageURL'] != null &&
              data[i - 1]['reward']['imageURL'] != '-' &&
              data[i - 1]['reward']['imageURL'] != ''
            ) {
              this.setState({imageStamps: data[i - 1]['reward']['imageURL']});
              // return {uri: data[i]['reward']['imageURL']};
              return true;
            } else {
              this.setState({imageStamps: null});
              return false;
            }
          } else {
            if (
              data[i]['reward']['imageURL'] != undefined &&
              data[i]['reward']['imageURL'] != null &&
              data[i]['reward']['imageURL'] != '-' &&
              data[i]['reward']['imageURL'] != '' &&
              data[i]['stampsStatus'] === true
            ) {
              this.setState({imageStamps: data[i]['reward']['imageURL']});
              // return {uri: data[i]['reward']['imageURL']};
              return true;
            } else {
              this.setState({imageStamps: null});
              return false;
            }
          }
        }
      }
      this.setState({imageStamps: null});
      return false;
    } catch (e) {
      return false;
    }
  };

  detailStamps() {
    if (Actions.currentScene === 'pageIndex') {
      navigate('detailStamps');
    }
  }

  displayStamps = () => {
    const {imageStamps} = this.state;
    this.getImageStamps();
    if (imageStamps != null) {
      try {
        return (
          <TouchableOpacity onPress={this.detailStamps}>
            <AutoHeightImage
              style={{borderRadius: 15}}
              width={Dimensions.get('window').width - 50}
              source={{uri: imageStamps}}
            />
          </TouchableOpacity>
        );
      } catch (e) {
        return <Image source={{uri: imageStamps}} style={styles.imageStamps} />;
      }
    } else {
      return this.getItemStamp();
    }
  };

  render() {
    const {intlData, bg} = this.props;
    return (
      <View
        style={[
          styles.container,
          bg != undefined ? {backgroundColor: 'white'} : null,
        ]}>
        <View
          style={[
            styles.card,
            bg != undefined ? {backgroundColor: 'white'} : null,
          ]}>
          {this.props.isLoading ? <StampsPlaceHolder /> : this.displayStamps()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    backgroundColor: colorConfig.store.defaultColor,
  },
  title: {
    color: colorConfig.pageIndex.backgroundColor,
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    // height: Dimensions.get('window').width / 3,
    // height: 150,
    width: Dimensions.get('window').width - 20,
    // borderColor: colorConfig.pageIndex.activeTintColor,
    // borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    // borderRadius: 10,
    backgroundColor: colorConfig.pageIndex.activeTintColor,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 10,
  },
  item: {
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    width: 40,
    height: 40,
    borderRadius: 40,
    marginHorizontal: 5,
    paddingVertical: 12,
    alignItems: 'center',
  },
  detail: {
    textAlign: 'center',
    fontSize: 10,
  },
  itemFree: {
    backgroundColor: colorConfig.store.transparentItem,
    width: 40,
    height: 40,
    borderRadius: 40,
    marginHorizontal: 5,
    paddingVertical: 12,
    alignItems: 'center',
  },
  detailFree: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold',
    color: colorConfig.pageIndex.backgroundColor,
  },
  imageStamps: {
    width: '100%',
    borderRadius: 15,
    aspectRatio: 2.2,
    resizeMode: 'contain',
  },
});

mapStateToProps = state => ({
  dataStamps: state.rewardsReducer.getStamps,
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
)(RewardsStamp);
