import React, {useState} from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';

import colorConfig from '../config/colorConfig';

import VoucherItem from '../components/voucherList/components/VoucherListItem';
import appConfig from '../config/appConfig';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    paddingHorizontal: 20,
  },
  body: {height: '90%'},
  footer: {
    height: '10%',
    borderTopWidth: 0.2,
    borderTopColor: 'grey',
    padding: 16,
  },
  backgroundColorHeader: {
    flex: 1,
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 70,
    backgroundColor: '#FFEBEB',
  },
  textValidity: {
    fontSize: 12,
    fontWeight: '700',
  },
  textValidityValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  textDescription: {
    fontSize: 12,
    fontWeight: '700',
  },
  textDescriptionValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  textRedeemButton: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  touchableRedeemButton: {
    width: '100%',
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorConfig.primaryColor,
    borderRadius: 8,
  },
  touchableImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flex: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const VoucherDetail = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const categories = [
    {
      name: 'martin',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      name: 'test',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      name: 'anjay',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      name: 'martin',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      name: 'test',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      name: 'anjay',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
  ];

  const renderValidity = () => {
    return (
      <View>
        <Text style={styles.textValidity}>Validity</Text>
        <View style={{marginTop: 8}} />
        <Text style={styles.textValidityValueq}>
          Mon Mar 06 2023 08:27:50 GMT+0700
        </Text>
      </View>
    );
  };

  const renderDescription = () => {
    return (
      <View>
        <Text style={styles.textDescription}>Description</Text>
        <View style={{marginTop: 8}} />
        <Text style={styles.textDescriptionValue}>
          Laborum rerum hic iusto amet id nihil ratione iste. In iure aut quia
          rerum laudantium quia placeat. Eligendi vel omnis placeat cum
          suscipit. Perspiciatis eligendi deleniti similique aut. Et consequatur
          nostrum hic voluptatibus in. Quasi hic doloremque maiores quo.
        </Text>
      </View>
    );
  };

  const renderRedeemButton = () => {
    return (
      <TouchableOpacity
        style={styles.touchableRedeemButton}
        onPress={() => {
          setModalVisible(true);
        }}>
        <Text style={styles.textRedeemButton}>REDEEM</Text>
      </TouchableOpacity>
    );
  };

  const renderImageRedeemSuccess = () => {
    if (modalVisible) {
      return (
        <TouchableOpacity
          onPress={() => {
            setModalVisible(false);
          }}
          style={styles.touchableImage}>
          <Image source={appConfig.funtoastRedeemed} />
        </TouchableOpacity>
      );
    }
  };

  return (
    <View>
      <ScrollView style={styles.body}>
        <View style={styles.backgroundColorHeader} />
        <View style={styles.container}>
          <View style={{marginTop: '5%'}} />
          <VoucherItem voucher={categories[0]} pointToRedeem="120" />
          <View style={{marginTop: '2%'}} />
          {renderValidity()}
          <View style={{marginTop: '5%'}} />
          {renderDescription()}
        </View>
      </ScrollView>

      <View style={styles.footer}>{renderRedeemButton()}</View>
      {renderImageRedeemSuccess()}
    </View>
  );
};

export default VoucherDetail;
