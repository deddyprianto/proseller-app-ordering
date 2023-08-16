import React from 'react';
import Header from '../../components/layout/header';
import {SafeAreaView, ScrollView, View, StyleSheet} from 'react-native';
import ProductCartList from '../../components/productCartList/ProductCartList';
import GlobalText from '../../components/globalText';
import {Actions} from 'react-native-router-flux';
import Theme from '../../theme/Theme';
import useAdvancedCart from './hooks/useAdvancedCart';

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
      padding: 16,
    },
    nextMain: {
      paddingVertical: 8,
    },
  });

  return {styles};
};

const CartStep1 = props => {
  const {navigation} = props;
  const step = navigation.state.params?.step;
  const {calculateAmount} = useAdvancedCart();
  const {styles} = useStyles();
  const renderStep = () => (
    <View>
      <GlobalText style={styles.stepText}>Step 1 of 4</GlobalText>
    </View>
  );
  calculateAmount();
  return (
    <SafeAreaView style={{flex: 1}}>
      <Header title={'Cart'} customRightIcon={renderStep} />
      <ScrollView contentContainerStyle={styles.contentStyle}>
        <ProductCartList step={step} />
      </ScrollView>
      <View style={styles.nextContainer}>
        <View style={styles.nextMain}>
          <GlobalText>Subtotal</GlobalText>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CartStep1;
