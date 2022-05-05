import React, {useState} from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

import colorConfig from '../config/colorConfig';

import VoucherItem from '../components/voucherList/components/VoucherListItem';
import ConfirmationDialog from '../components/confirmationDialog';
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
  textInfoPointTitle: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  textInfoPointValue: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  textPointLocked: {
    fontWeight: 'bold',
    fontSize: 12,
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
  viewInfoPoint: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
  },
  viewInfoPointValue: {
    padding: 10,
    width: '50%',
  },
  viewPointLocked: {
    backgroundColor: '#E5EAF8',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dividerVertical: {
    height: 'auto',
    borderWidth: 0.5,
  },
});

const VoucherDetail = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenSuccessModal = () => {
    setOpenModal(false);
    setOpenSuccessModal(true);
  };
  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
  };

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
          handleOpenModal();
        }}>
        <Text style={styles.textRedeemButton}>REDEEM</Text>
      </TouchableOpacity>
    );
  };

  const renderImageRedeemSuccess = () => {
    if (openSuccessModal) {
      return (
        <TouchableOpacity
          onPress={() => {
            handleCloseSuccessModal();
          }}
          style={styles.touchableImage}>
          <Image source={appConfig.funtoastRedeemed} />
        </TouchableOpacity>
      );
    }
  };

  const renderCurrentPoint = () => {
    return (
      <View style={styles.viewInfoPointValue}>
        <Text style={styles.textInfoPointTitle}>Your current point:</Text>
        <Text style={styles.textInfoPointValue}>55 Points</Text>
      </View>
    );
  };

  const renderReducedPoint = () => {
    return (
      <View style={styles.viewInfoPointValue}>
        <Text style={styles.textInfoPointTitle}>Point will be reduced: </Text>
        <Text style={styles.textInfoPointValue}>10 Points</Text>
      </View>
    );
  };

  const renderInfoPoint = () => {
    return (
      <View style={styles.viewInfoPoint}>
        {renderCurrentPoint()}
        <View style={styles.dividerVertical} />
        {renderReducedPoint()}
      </View>
    );
  };

  const renderBlockedPoint = () => {
    return (
      <View style={styles.viewPointLocked}>
        <Text style={styles.textPointLocked}>you point is locked</Text>
      </View>
    );
  };

  const renderConfirmationDialog = () => {
    return (
      <ConfirmationDialog
        open={openModal}
        handleClose={() => {
          handleCloseModal();
        }}
        handleSubmit={() => {
          handleOpenSuccessModal();
        }}
        textTitle="Redeem Voucher"
        textDescription="This will spend your points by 10 points"
        textSubmit="Redeem"
      />
    );
  };

  return (
    <View>
      <ScrollView style={styles.body}>
        <View style={styles.backgroundColorHeader} />

        <View style={styles.container}>
          <View style={{marginTop: '5%'}} />
          <VoucherItem voucher={categories[0]} />
          <View style={{marginTop: '2%'}} />
          {renderInfoPoint()}
          <View style={{marginTop: '5%'}} />
          {renderValidity()}
          <View style={{marginTop: '5%'}} />
          {renderDescription()}
          <View style={{marginTop: '5%'}} />
          {renderBlockedPoint()}
        </View>
      </ScrollView>

      <View style={styles.footer}>{renderRedeemButton()}</View>
      {renderImageRedeemSuccess()}
      {renderConfirmationDialog()}
    </View>
  );
};

export default VoucherDetail;
