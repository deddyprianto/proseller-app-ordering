/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useState} from 'react';
import DashedLine from 'react-native-dashed-line';

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colorConfig from '../../../config/colorConfig';
import {isEmptyArray} from '../../../helper/CheckEmpty';
import ProductAddModal from '../../productAddModal';
import appConfig from '../../../config/appConfig';
import CurrencyFormatter from '../../../helper/CurrencyFormatter';

const styles = StyleSheet.create({
  root: {
    elevation: 1,
    borderRadius: 8,
    backgroundColor: 'white',
    padding: 16,
  },
  body: {
    height: 'auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bodyRight: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    height: 62,
    width: 62,
  },
  imageNotes: {
    width: 10,
    height: 9,
    marginRight: 4,
    tintColor: '#B7B7B7',
  },
  iconEdit: {
    fontSize: 10,
    color: colorConfig.primaryColor,
    marginRight: 2,
  },
  dividerDashed: {
    textAlign: 'center',
    color: colorConfig.primaryColor,
  },
  divider: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#D6D6D6',
    marginVertical: 8,
  },
  width80: {width: '80%'},
  imagePromo: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  textAddOn: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#B7B7B7',
  },
  textProductHeaderQty: {
    fontSize: 10,
    fontWeight: '500',
    color: 'white',
  },
  textProductHeaderName: {
    fontSize: 12,
    fontWeight: '500',
  },
  textProductHeaderPrice: {
    fontSize: 10,
    fontWeight: '500',
    color: colorConfig.primaryColor,
  },
  textModifierItemQty: {
    fontSize: 10,
    fontStyle: 'italic',
    color: colorConfig.primaryColor,
  },
  textModifierItemName: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#B7B7B7',
  },
  textModifierItemPrice: {
    fontSize: 10,
    fontStyle: 'italic',
    color: colorConfig.primaryColor,
  },
  textPriceFooter: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colorConfig.primaryColor,
  },
  textPriceBeforeDiscount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#B7B7B7',
    textDecorationLine: 'line-through',
  },
  textEdit: {
    fontSize: 10,
    fontWeight: '500',
    color: colorConfig.primaryColor,
  },
  textPromo: {
    fontSize: 10,
    fontWeight: '500',
    color: 'white',
  },
  textNotes: {
    color: '#B7B7B7',
    fontSize: 8,
    fontStyle: 'italic',
  },
  textBullet: {
    fontSize: 6,
    color: '#D6D6D6',
  },
  textIconPromo: {
    color: '#B7B7B7',
    fontSize: 8,
  },
  textIconPromoActive: {
    color: colorConfig.primaryColor,
    fontSize: 8,
  },
  viewNotes: {
    display: 'flex',
    flexDirection: 'row',
  },
  viewProductHeaderQty: {
    paddingVertical: 3,
    paddingHorizontal: 4.5,
    borderRadius: 5,
    backgroundColor: colorConfig.primaryColor,
  },
  viewProductHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewProductModifierItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  viewBullet: {
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  viewEdit: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    backgroundColor: 'white',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colorConfig.primaryColor,
  },
  viewPromo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    backgroundColor: '#B7B7B7',
    borderRadius: 50,
  },
  viewPromoActive: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    backgroundColor: colorConfig.primaryColor,
    borderRadius: 50,
  },
  viewTotalPrice: {
    display: 'flex',
    flexDirection: 'row',
  },
});

const ProductCart = ({item, disabled}) => {
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);

  const handleOpenAddModal = () => {
    setIsOpenAddModal(true);
  };
  const handleCloseAddModal = () => {
    setIsOpenAddModal(false);
  };

  const renderDividerDashed = () => {
    return (
      <DashedLine
        dashLength={10}
        dashThickness={0.5}
        dashGap={5}
        dashColor="#c32626"
      />
    );
  };

  const renderProductHeader = () => {
    return (
      <View style={styles.viewProductHeader}>
        <View style={styles.viewProductHeaderQty}>
          <Text style={styles.textProductHeaderQty}>{item.quantity}x</Text>
        </View>
        <View style={{marginRight: 8}} />
        <Text style={styles.textProductHeaderName}>{item?.product?.name}</Text>
        <View style={{marginRight: 8}} />
        <Text style={styles.textProductHeaderPrice}>
          + {item?.product?.retailPrice}
        </Text>
      </View>
    );
  };

  const renderProductModifierItem = ({qty, name, price}) => {
    return (
      <View style={styles.viewProductModifierItem}>
        <View style={styles.viewBullet}>
          <Text style={styles.textBullet}>{'\u2B24'}</Text>
        </View>

        <Text>
          <Text style={styles.textModifierItemQty}>{qty}x</Text>
          <Text style={styles.textModifierItemName}> {name} </Text>
          <Text style={styles.textModifierItemPrice}>+{price}</Text>
        </Text>
      </View>
    );
  };

  const renderProductModifier = () => {
    if (!isEmptyArray(item.modifiers)) {
      const productModifiers = item.modifiers.map(modifier => {
        return modifier?.modifier?.details.map(detail => {
          return renderProductModifierItem({
            qty: detail?.quantity,
            name: detail?.name,
            price: detail?.price,
          });
        });
      });

      return (
        <View>
          <Text style={styles.textAddOn}>Add-On</Text>
          <View style={{marginTop: 4}} />
          {productModifiers}
        </View>
      );
    }
  };

  const renderTotalPrice = () => {
    if (!isEmptyArray(item.promotions)) {
      return (
        <View style={styles.viewTotalPrice}>
          <Text style={styles.textPriceBeforeDiscount}>
            {CurrencyFormatter(item?.grossAmount)}
          </Text>
          <View style={{marginRight: 10}} />
          <Text style={styles.textPriceFooter}>
            {CurrencyFormatter(item?.amountAfterDisc)}
          </Text>
        </View>
      );
    }

    return (
      <Text style={styles.textPriceFooter}>
        {CurrencyFormatter(item?.grossAmount)}
      </Text>
    );
  };

  const renderEditIcon = () => {
    if (!disabled) {
      return (
        <View style={styles.viewEdit}>
          <MaterialIcons style={styles.iconEdit} name="edit" />
          <Text style={styles.textEdit}>Edit</Text>
        </View>
      );
    }
  };

  const renderNotes = () => {
    if (item.remark) {
      return (
        <View style={styles.viewNotes}>
          <Image source={appConfig.notes} style={styles.imageNotes} />
          <Text style={styles.textNotes}>{item?.remark}</Text>
        </View>
      );
    }
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        {renderEditIcon()}
        {renderTotalPrice()}
      </View>
    );
  };

  const renderImage = () => {
    return (
      <View>
        <Image
          style={styles.image}
          resizeMode="stretch"
          source={{uri: item?.product?.defaultImageURL || null}}
        />
      </View>
    );
  };

  const renderPromoIcon = () => {
    const active = !isEmptyArray(item.promotions);
    const styleViewPromo = active ? styles.viewPromoActive : styles.viewPromo;
    const styleTextIconPromo = active
      ? styles.textIconPromoActive
      : styles.textIconPromo;

    return (
      <View style={styleViewPromo}>
        <ImageBackground
          source={appConfig.funtoastStar}
          style={styles.imagePromo}>
          <Text style={styleTextIconPromo}>%</Text>
        </ImageBackground>
        <Text style={styles.textPromo}>Promo</Text>
      </View>
    );
  };

  const renderBodyRight = () => {
    return (
      <View style={styles.bodyRight}>
        {renderImage()}
        <View style={{marginTop: 8}} />
        {renderPromoIcon()}
      </View>
    );
  };

  const renderDivider = () => {
    if (item.remark && !isEmptyArray(item.modifiers)) {
      return <View style={styles.divider} />;
    }
  };

  const renderBodyLeft = () => {
    return (
      <View>
        {renderProductHeader()}
        <View style={{marginTop: 8}} />
        {renderProductModifier()}
        {renderDivider()}
        {renderNotes()}
      </View>
    );
  };

  const renderBody = () => {
    return (
      <View style={styles.body}>
        {renderBodyLeft()}
        {renderBodyRight()}
      </View>
    );
  };

  const renderProductAddModal = () => {
    if (isOpenAddModal) {
      return (
        <ProductAddModal
          product={item?.product}
          open={isOpenAddModal}
          handleClose={() => {
            handleCloseAddModal();
          }}
          selectedProduct={item}
        />
      );
    }
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      style={styles.root}
      onPress={() => {
        handleOpenAddModal();
      }}>
      {renderBody()}
      <View style={{marginTop: 16}} />
      {renderDividerDashed()}
      <View style={{marginTop: 16}} />
      {renderFooter()}
      {renderProductAddModal()}
    </TouchableOpacity>
  );
};

export default ProductCart;
