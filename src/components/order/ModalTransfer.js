import React, {Component} from 'react';
import {
  BackHandler,
  Dimensions,
  StyleSheet,
  Text,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  View,
  Image,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import Icon from 'react-native-vector-icons/EvilIcons';
import {isEmptyArray, isEmptyObject} from '../../helper/CheckEmpty';
import appConfig from '../../config/appConfig';
export default class ModalTransfer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
      toggle: true,
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

  format = item => {
    try {
      const curr = appConfig.appMataUang;
      if (curr != 'RP' && curr != 'IDR' && item.includes('.') == false) {
        return `${curr} ${item}.00`;
      }
      return `${curr} ${item}`;
    } catch (e) {
      return item;
    }
  };

  getData = key => {
    try {
      const {selectedAccount} = this.props;
      if (this.props.isPendingPayment) {
        if (key === 'payment_description') {
          let amount = this.format(selectedAccount.paymentAmount.toString());
          let desc = selectedAccount.description;
          desc = desc.replace('{amount}', amount);
          return desc;
        } else if (key === 'manual_transfer_image')
          return selectedAccount.manual_transfer_image;
        return null;
      } else {
        if (!isEmptyArray(selectedAccount.configurations)) {
          let find = selectedAccount.configurations.find(
            item => item.name === key,
          ).value;

          if (find) {
            if (key === 'payment_description') {
              let amount = this.format(this.props.totalNettAmount.toString());
              find = find.replace('{amount}', amount);
              return find;
            }
            return find;
          }
          return null;
        }
      }
    } catch (e) {
      return null;
    }
  };

  render() {
    const {selectedAccount} = this.props;
    return (
      <Modal
        animationType="slide"
        presentationStyle="overFullScreen"
        visible={this.props.showModal}
        transparent={false}
        hardwareAccelerated={true}>
        <SafeAreaView style={{flex: 1}}>
          <TouchableOpacity
            onPress={this.props.hideModal}
            style={{
              top: 10,
              left: 10,
              position: 'absolute',
              zIndex: 2,
              width: 40,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              height: 40,
              backgroundColor: colorConfig.store.transparentItem,
              borderRadius: 50,
            }}>
            <Icon size={28} name={'close'} style={{color: 'white'}} />
          </TouchableOpacity>

          <ScrollView
            style={{
              marginTop: '11%',
              paddingHorizontal: 20,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontFamily: 'Poppins-Bold',
                color: colorConfig.store.titleSelected,
              }}>
              How to transfer ?
            </Text>
            {!isEmptyObject(selectedAccount) ? (
              <View style={{marginTop: 30}}>
                <Image
                  style={styles.imageModal}
                  source={{uri: this.getData('manual_transfer_image')}}
                />
                <View
                  style={{
                    alignItems: 'center',
                    flex: 1,
                    paddingBottom: 60,
                  }}>
                  <Text style={styles.textDesc}>
                    {this.getData('payment_description')}
                  </Text>
                </View>
              </View>
            ) : null}
          </ScrollView>

          <TouchableOpacity
            onPress={() => {
              if (this.props.isPendingPayment) {
                this.props.hideModal();
              } else {
                this.props.doPayment();
              }
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 60,
              alignSelf: 'center',
              borderRadius: 15,
              width: '90%',
              position: 'absolute',
              bottom: 20,
              backgroundColor: colorConfig.store.defaultColor,
            }}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Poppins-Bold',
                fontSize: 16,
              }}>
              Ok, Got it!
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorConfig.store.containerColor,
  },
  modal: {
    backgroundColor: 'white',
    margin: 0, // This is the important style you need to set
    alignItems: undefined,
    justifyContent: undefined,
  },
  imageModal: {
    height: Dimensions.get('window').height / 3,
    resizeMode: 'contain',
  },
  textDesc: {
    marginTop: 21,
    fontSize: 17,
    fontFamily: 'Poppins-Medium',
    color: colorConfig.store.title,
  },
});
