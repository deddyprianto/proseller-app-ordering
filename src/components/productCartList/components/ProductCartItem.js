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

import appConfig from '../../../config/appConfig';

import CurrencyFormatter from '../../../helper/CurrencyFormatter';
import {isEmptyArray} from '../../../helper/CheckEmpty';

import ProductAddModal from '../../productAddModal';

import Theme from '../../../theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      elevation: 2,
      borderRadius: 8,
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    body: {
      marginBottom: 16,
      height: 'auto',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    bodyLeft: {
      flex: 1,
    },
    bodyRight: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    footer: {
      marginTop: 16,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    image: {
      height: 62,
      width: 62,
      marginBottom: 8,
    },
    imageNotes: {
      width: 10,
      height: 9,
      marginRight: 4,
      tintColor: theme.colors.text2,
    },
    iconEdit: {
      fontSize: 10,
      marginRight: 2,
      color: theme.colors.primary,
    },
    iconPromo: {
      color: theme.colors.text2,
      fontSize: 8,
    },
    iconPromoActive: {
      color: theme.colors.primary,
      fontSize: 8,
    },
    iconBullet: {
      fontSize: 6,
      color: theme.colors.border,
    },
    dividerDashed: {
      textAlign: 'center',
      color: theme.colors.primary,
    },
    divider: {
      width: '100%',
      height: 0.5,
      marginVertical: 8,
      backgroundColor: theme.colors.border,
    },
    imagePromo: {
      width: 16,
      height: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 4,
    },
    textAddOn: {
      fontStyle: 'italic',
      color: theme.colors.text2,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textProductHeaderQty: {
      color: theme.colors.text4,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textProductHeaderName: {
      marginHorizontal: 8,
      color: theme.colors.text1,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textProductHeaderPrice: {
      color: theme.colors.primary,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textModifier: {
      flex: 1,
    },
    textModifierItemQty: {
      fontStyle: 'italic',
      color: theme.colors.primary,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textModifierItemName: {
      fontStyle: 'italic',
      color: theme.colors.text2,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textModifierItemPrice: {
      fontStyle: 'italic',
      color: theme.colors.primary,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textPriceFooter: {
      color: theme.colors.primary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textPriceBeforeDiscount: {
      marginRight: 10,
      textDecorationLine: 'line-through',
      color: theme.colors.text2,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textEdit: {
      color: theme.colors.primary,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textPromo: {
      color: theme.colors.text4,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textNotes: {
      flex: 1,
      fontStyle: 'italic',
      color: theme.colors.text2,
      fontSize: theme.fontSize[8],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewNotes: {
      display: 'flex',
      flexDirection: 'row',
    },
    viewProductHeaderQty: {
      paddingVertical: 3,
      paddingHorizontal: 4.5,
      borderRadius: 5,
      backgroundColor: theme.colors.primary,
    },
    viewProductHeader: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    viewProductModifierItem: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    viewBullet: {
      height: 6,
      width: 6,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 5,
      marginRight: 5,
      backgroundColor: theme.colors.border,
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
      borderColor: theme.colors.primary,
    },
    viewPromo: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 4,
      borderRadius: 50,
      backgroundColor: theme.colors.text2,
    },
    viewPromoActive: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 4,
      borderRadius: 50,
      backgroundColor: theme.colors.primary,
    },
    viewTotalPrice: {
      display: 'flex',
      flexDirection: 'row',
    },
  });
  return styles;
};

const ProductCart = ({item, disabled}) => {
  const styles = useStyles();
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
        <Text style={styles.textProductHeaderName}>{item?.product?.name}</Text>
        <Text style={styles.textProductHeaderPrice}>
          + {item?.product?.retailPrice}
        </Text>
      </View>
    );
  };

  const renderProductModifierItem = ({qty, name, price}) => {
    return (
      <View style={styles.viewProductModifierItem}>
        <View style={styles.viewBullet} />

        <Text style={styles.textModifier}>
          <Text style={styles.textModifierItemQty}>{qty}x</Text>
          <Text style={styles.textModifierItemName}>{name}</Text>
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
      <Image
        style={styles.image}
        resizeMode="stretch"
        source={{uri: item?.product?.defaultImageURL}}
      />
    );
  };

  const renderPromoIcon = () => {
    const active = !isEmptyArray(item.promotions);
    const styleViewPromo = active ? styles.viewPromoActive : styles.viewPromo;
    const styleTextIconPromo = active
      ? styles.iconPromoActive
      : styles.iconPromo;

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
      <View style={styles.bodyLeft}>
        {renderProductHeader()}
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
      {renderDividerDashed()}
      {renderFooter()}
      {renderProductAddModal()}
    </TouchableOpacity>
  );
};

export default ProductCart;
