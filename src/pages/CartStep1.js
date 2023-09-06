import React from 'react';
import Header from '../components/layout/header';
import {SafeAreaView, ScrollView, View, StyleSheet} from 'react-native';
import ProductCartList from '../components/productCartList/ProductCartList';
import GlobalText from '../components/globalText';
import Theme from '../theme/Theme';
import {useSelector} from 'react-redux';
import GlobalButton from '../components/button/GlobalButton';
import CurrencyFormatter from '../helper/CurrencyFormatter';
import {Actions} from 'react-native-router-flux';

const useStyles = () => {
  const {colors, fontFamily} = Theme();
  const styles = StyleSheet.create({
    contentStyle: {
      paddingBottom: 30,
    },
    stepText: {
      color: colors.brandTertiary,
      fontFamily: fontFamily.poppinsMedium,
    },
    nextContainer: {
      zIndex: 1000,
      overflow: 'hidden',
      paddingTop: 2,
    },
    nextMain: {
      paddingVertical: 8,
      flexDirection: 'row',
      width: '100%',
    },
    mlAuto: {
      marginLeft: 'auto',
    },

    root: {
      paddingBottom: 2,
    },
    container: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: colors.greyScale2,
      elevation: 20,
      width: '100%',
      backgroundColor: colors.header,
      padding: 16,
    },
    priceBotttom: {
      fontSize: 16,
      fontFamily: fontFamily.poppinsBold,
      color: colors.primary,
    },
  });

  return {styles};
};

const CartStep1 = props => {
  const {navigation} = props;
  const step = navigation.state.params?.step;
  const {styles} = useStyles();
  const currentBasket = useSelector(
    state => state.orderReducer?.dataBasket?.product,
  );
  const renderStep = () => (
    <View>
      <GlobalText style={styles.stepText}>Step 1 of 4</GlobalText>
    </View>
  );

  const goToTheCartStep2 = () => {
    Actions.cart({step: 2});
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header title={'Cart'} customRightIcon={renderStep} />
      <ScrollView contentContainerStyle={styles.contentStyle}>
        <ProductCartList step={step} />
      </ScrollView>
      <View style={[styles.nextContainer]}>
        <View style={styles.container}>
          <View style={styles.nextMain}>
            <GlobalText>Subtotal</GlobalText>
            <View style={styles.mlAuto}>
              <GlobalText style={styles.priceBotttom}>
                {CurrencyFormatter(currentBasket?.totalNettAmount)}
              </GlobalText>
            </View>
          </View>
          <GlobalButton onPress={goToTheCartStep2} title="Next" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CartStep1;
