/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useEffect, useState} from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import colorConfig from '../config/colorConfig';
import ProductCartList from '../components/productCartList/ProductCartList';

import OrderingTypeSelectorModal from '../components/modal/OrderingTypeSelectorModal';
import DeliveryProviderSelectorModal from '../components/modal/DeliveryProviderSelectorModal';
import DeliveryDateSelectorModal from '../components/modal/DeliveryDateSelectorModal';
import {Actions} from 'react-native-router-flux';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  textSubTotal: {
    fontSize: 12,
  },
  textSubTotalValue: {
    color: colorConfig.primaryColor,
    fontWeight: 'bold',
    fontSize: 12,
  },
  textDeliveryFee: {
    fontSize: 12,
  },
  textDeliveryFeeValue: {
    color: colorConfig.primaryColor,
    fontWeight: 'bold',
    fontSize: 12,
  },
  textGrandTotal: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  textGrandTotalValue: {
    color: colorConfig.primaryColor,
    fontWeight: 'bold',
    fontSize: 14,
  },
  textInclusiveTax: {
    color: '#B7B7B7',
    fontSize: 10,
  },
  textSeeDetails: {
    color: colorConfig.primaryColor,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  textInclusiveTaxValue: {
    color: '#B7B7B7',
    fontWeight: 'bold',
    fontSize: 10,
  },
  textCheckoutButton: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  textMethod: {
    fontSize: 12,
    fontWeight: '500',
  },
  textMethodValue: {
    fontSize: 12,
    fontWeight: '500',
    color: colorConfig.primaryColor,
    textAlign: 'center',
  },
  textAddButton: {
    color: colorConfig.primaryColor,
    fontSize: 12,
  },
  viewCheckoutInfoValue: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewCheckoutButton: {
    borderTopWidth: 0.2,
    borderTopColor: 'grey',
    padding: 16,
  },
  viewCheckout: {
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginTop: -8,
  },
  viewMethod: {
    borderRadius: 8,
    backgroundColor: 'white',
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
  },
  viewAddButton: {
    borderColor: colorConfig.primaryColor,
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  touchableMethod: {
    width: 120,
    borderRadius: 8,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colorConfig.primaryColor,
  },
  touchableCheckoutButton: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B7B7B7',
    paddingVertical: 10,
  },
  dividerDashed: {
    textAlign: 'center',
    color: colorConfig.primaryColor,
  },
  divider: {
    borderColor: colorConfig.primaryColor,
    borderTopWidth: 0.5,
  },
});

const Cart = () => {
  const [seeDetail, setSeeDetail] = useState(true);
  const [openOrderingTypeModal, setOpenOrderingTypeModal] = useState(false);
  const [openDeliveryDateModal, setOpenDeliveryDateModal] = useState(true);
  const [openDeliveryProviderModal, setOpenDeliveryProviderModal] = useState(
    false,
  );

  const handleOpenOrderingTypeModal = () => {
    setOpenOrderingTypeModal(true);
  };
  const handleCloseOrderingTypeModal = () => {
    setOpenOrderingTypeModal(false);
  };

  const handleOpenDeliveryDateModal = () => {
    setOpenDeliveryDateModal(true);
  };
  const handleCloseDeliveryDateModal = () => {
    setOpenDeliveryDateModal(false);
  };

  const handleOpenDeliveryProviderModal = () => {
    setOpenDeliveryProviderModal(true);
  };
  const handleCloseDeliveryProviderModal = () => {
    setOpenDeliveryProviderModal(false);
  };

  const renderSubTotal = () => {
    return (
      <View style={styles.viewCheckoutInfoValue}>
        <Text style={styles.textSubTotal}>Sub Total</Text>
        <Text style={styles.textSubTotalValue}>5.50</Text>
      </View>
    );
  };

  const renderDeliveryFee = () => {
    return (
      <View style={styles.viewCheckoutInfoValue}>
        <Text style={styles.textDeliveryFee}>Delivery Fee</Text>
        <Text style={styles.textDeliveryFeeValue}>1.10</Text>
      </View>
    );
  };

  const renderGrandTotal = () => {
    return (
      <View style={styles.viewCheckoutInfoValue}>
        <Text style={styles.textGrandTotal}>Grand Total</Text>
        <Text style={styles.textGrandTotalValue}>5.50</Text>
      </View>
    );
  };

  const renderInclusiveTax = () => {
    return (
      <View style={styles.viewCheckoutInfoValue}>
        <Text style={styles.textInclusiveTax}>Inclusive Tax</Text>
        <Text style={styles.textInclusiveTaxValue}>7%</Text>
      </View>
    );
  };

  const renderDividerDashed = () => {
    return (
      <Text style={styles.dividerDashed}>
        _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
        _ _
      </Text>
    );
  };

  const handleClickSeeDetails = () => {
    if (seeDetail) {
      setSeeDetail(false);
    } else {
      setSeeDetail(true);
    }
  };

  const renderSeeDetails = () => {
    const text = seeDetail ? 'hide details' : 'see details';

    return (
      <TouchableOpacity
        onPress={() => {
          handleClickSeeDetails();
        }}>
        <Text style={styles.textSeeDetails}>{text}</Text>
      </TouchableOpacity>
    );
  };

  const renderCheckoutInfoDetail = () => {
    if (!seeDetail) {
      return <View>{renderSeeDetails()}</View>;
    }

    return (
      <View>
        {renderSeeDetails()}
        <View style={{marginTop: 8}} />
        {renderSubTotal()}
        <View style={{marginTop: 8}} />
        {renderDeliveryFee()}
        <View style={{marginTop: 2}} />
        {renderDividerDashed()}
      </View>
    );
  };

  const renderCheckoutInfo = () => {
    return (
      <View style={{marginTop: 16, paddingHorizontal: 16}}>
        {renderCheckoutInfoDetail()}
        <View style={{marginTop: 8}} />
        {renderGrandTotal()}
        <View style={{marginTop: 8}} />
        {renderInclusiveTax()}
        <View style={{marginTop: 8}} />
      </View>
    );
  };

  const renderCheckoutButton = () => {
    return (
      <View style={styles.viewCheckoutButton}>
        <TouchableOpacity style={styles.touchableCheckoutButton}>
          <Text style={styles.textCheckoutButton}>CHECK OUT</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCheckout = () => {
    return (
      <View style={styles.viewCheckout}>
        {renderCheckoutInfo()}
        {renderCheckoutButton()}
      </View>
    );
  };

  const renderOrderingType = () => {
    return (
      <View style={styles.viewMethod}>
        <Text style={styles.textMethod}>Ordering Type</Text>
        <TouchableOpacity
          style={styles.touchableMethod}
          onPress={() => {
            handleOpenOrderingTypeModal();
          }}>
          <Text style={styles.textMethodValue}>Delivery</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDeliveryAddress = () => {
    return (
      <View style={styles.viewMethod}>
        <Text style={styles.textMethod}>Delivery Address</Text>
        <TouchableOpacity
          style={styles.touchableMethod}
          onPress={() => {
            Actions.myDeliveryAddress();
          }}>
          <Text style={styles.textMethodValue}>Jon Doe</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDeliveryProvider = () => {
    return (
      <View style={styles.viewMethod}>
        <Text style={styles.textMethod}>Delivery Provider</Text>
        <TouchableOpacity
          style={styles.touchableMethod}
          onPress={() => {
            handleOpenDeliveryProviderModal();
          }}>
          <Text style={styles.textMethodValue}>Delivery A</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDeliveryDate = () => {
    return (
      <View style={styles.viewMethod}>
        <Text style={styles.textMethod}>Delivery Date</Text>
        <TouchableOpacity
          style={styles.touchableMethod}
          onPress={() => {
            handleOpenDeliveryDateModal();
          }}>
          <Text style={styles.textMethodValue}>Choose Date</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAddButton = () => {
    return (
      <View style={styles.viewAddButton}>
        <Text style={styles.textAddButton}>+ ADD ITEM</Text>
      </View>
    );
  };

  const renderModal = () => {
    return (
      <>
        <DeliveryProviderSelectorModal
          open={openDeliveryProviderModal}
          handleClose={() => {
            handleCloseDeliveryProviderModal();
          }}
        />

        <DeliveryDateSelectorModal
          open={openDeliveryDateModal}
          handleClose={() => {
            handleCloseDeliveryDateModal();
          }}
        />

        <OrderingTypeSelectorModal
          open={openOrderingTypeModal}
          handleClose={() => {
            handleCloseOrderingTypeModal();
          }}
        />
      </>
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={{marginTop: 16}} />
          {renderAddButton()}
          <View style={{marginTop: 16}} />
          <ProductCartList />
          <View style={styles.divider} />
          <View style={{marginTop: 16}} />
          {renderOrderingType()}
          <View style={{marginTop: 16}} />
          {renderDeliveryAddress()}
          <View style={{marginTop: 16}} />
          {renderDeliveryProvider()}
          <View style={{marginTop: 16}} />
          {renderDeliveryDate()}
          <View style={{marginTop: 16}} />
        </ScrollView>
        {renderModal()}
      </View>
      {renderCheckout()}
    </View>
  );
};

export default Cart;
