/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';

import {StyleSheet, View, Text, Image, Dimensions} from 'react-native';

import {isEmptyArray} from '../../../helper/CheckEmpty';
import appConfig from '../../../config/appConfig';
import Theme from '../../../theme';
import {useSelector} from 'react-redux';

const WIDTH = Dimensions.get('window').width;

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    body: {
      height: 'auto',
      display: 'flex',
      flexDirection: 'row',
    },
    bodyRight: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginRight: 8,
    },
    image: {
      height: 40,
      width: 40,
    },
    imageNotes: {
      width: 10,
      height: 9,
      marginRight: 4,
      tintColor: theme.colors.text2,
    },
    textAddOn: {
      marginBottom: 4,
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
      maxWidth: (WIDTH * 5) / 10,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textProductHeaderPrice: {
      marginLeft: 8,
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
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
      marginLeft: 8,
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textNotes: {
      color: theme.colors.text2,
      fontSize: theme.fontSize[8],
      fontFamily: theme.fontFamily.poppinsMedium,
      fontStyle: 'italic',
    },
    viewNotes: {
      display: 'flex',
      flexDirection: 'row',
    },
    viewProductHeaderQty: {
      minWidth: 18,
      height: 18,
      paddingHorizontal: 4.5,
      borderRadius: 5,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    viewProductHeader: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 8,
    },
    viewProductModifierItem: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewProductModifier: {
      marginBottom: 8,
    },
    viewBullet: {
      width: 6,
      height: 6,
      borderRadius: 100,
      backgroundColor: theme.colors.border,
      marginRight: 5,
    },
  });
  return styles;
};

const OrderHistoryDetailListItem = ({item, disabled}) => {
  const styles = useStyles();

  const imageSettings = useSelector(
    state => state.settingReducer.imageSettings,
  );

  const renderProductHeader = () => {
    return (
      <View style={styles.viewProductHeader}>
        <View style={styles.viewProductHeaderQty}>
          <Text style={styles.textProductHeaderQty}>{item.quantity}x</Text>
        </View>
        <Text style={styles.textProductHeaderName}>{item?.product?.name}</Text>
        <Text style={styles.textProductHeaderPrice}>
          +{item?.product?.retailPrice}
        </Text>
      </View>
    );
  };

  const renderProductModifierItem = ({qty, name, price}) => {
    return (
      <View style={styles.viewProductModifierItem}>
        <View style={styles.viewBullet} />
        <Text>
          <Text style={styles.textModifierItemQty}>{qty}x</Text>
          <Text style={styles.textModifierItemName}> {name} </Text>
          <Text style={styles.textModifierItemPrice}> +{price} </Text>
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
        <View style={styles.viewProductModifier}>
          <Text style={styles.textAddOn}>Add-On</Text>
          {productModifiers}
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

  const renderImage = () => {
    const image =
      item?.product?.defaultImageURL ||
      item?.product?.image ||
      imageSettings?.productPlaceholderImage;

    return (
      <Image style={styles.image} resizeMode="stretch" source={{uri: image}} />
    );
  };

  const renderBodyLeft = () => {
    return <View style={styles.bodyRight}>{renderImage()}</View>;
  };

  const renderBodyRight = () => {
    return (
      <View>
        {renderProductHeader()}
        {renderProductModifier()}
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

  return <View style={styles.root}>{renderBody()}</View>;
};

export default OrderHistoryDetailListItem;
