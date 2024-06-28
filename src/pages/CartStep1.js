import React, {useEffect} from 'react';
import Header from '../components/layout/header';
import {SafeAreaView, ScrollView, View, StyleSheet, BackHandler} from 'react-native';
import ProductCartList from '../components/productCartList/ProductCartList';
import GlobalText from '../components/globalText';
import Theme from '../theme/Theme';
import {useSelector, useDispatch} from 'react-redux';
import GlobalButton from '../components/button/GlobalButton';
import CurrencyFormatter from '../helper/CurrencyFormatter';
import useCalculation from '../hooks/calculation/useCalculation';
import {navigate} from '../utils/navigation.utils';
import LoadingScreen from '../components/loadingScreen';
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
      flex: 1,
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
  const dispatch = useDispatch();
  const {calculatePriceAferDiscount} = useCalculation();

  const isLoadingBasket = useSelector(
    state => state.orderReducer?.loadingBasket?.isLoadingBasket,
  );

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackHandler);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackHandler);
    };
  }, [onBackHandler]);

  const onBackHandler = async () => {
    await dispatch({
      type: 'SET_OPEN_CART',
      payload: false,
    });
    Actions.pop();
  };

  const renderStep = () => (
    <View>
      <GlobalText style={styles.stepText}>Step 1 of 4</GlobalText>
    </View>
  );

  const goToTheCartStep2 = () => {
    navigate('cart', {step: 2});
  };

  return (
    <SafeAreaView style={styles.root}>
      <LoadingScreen loading={isLoadingBasket} />
      <Header title={'Cart'} customRightIcon={renderStep} onBackBtn={onBackHandler} />
      <ScrollView contentContainerStyle={styles.contentStyle}>
        <ProductCartList step={step} />
      </ScrollView>
      <View style={[styles.nextContainer]}>
        <View style={styles.container}>
          <View style={styles.nextMain}>
            <GlobalText>Subtotal</GlobalText>
            <View style={styles.mlAuto}>
              <GlobalText style={styles.priceBotttom}>
                {CurrencyFormatter(calculatePriceAferDiscount())}
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
