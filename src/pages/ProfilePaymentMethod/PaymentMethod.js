/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {Header} from '../../components/layout';
import {useDispatch, useSelector} from 'react-redux';
import {getAccountPayment} from '../../actions/payment.actions';
import EmptyListPayment from './EmptyListPayment';
import LoadingScreen from '../../components/loadingScreen/LoadingScreen';
import CardProfilePayment from '../../components/card/CardProfilePayment';
import Theme from '../../theme/Theme';
import GlobalButton from '../../components/button/GlobalButton';
import PlusSvg from '../../assets/svg/PlusSvg';
import usePayment from '../../hooks/payment/usePayment';
import {getCompanyInfo} from '../../actions/stores.action';
import useBackHandler from '../../hooks/backHandler/useBackHandler';
import {navigate} from '../../utils/navigation.utils';
const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    safeAreaContainer: {
      flex: 1,
    },
    scrollContainer: {
      flex: 1,
    },
    contentContainerStyle: {
      paddingBottom: 30,
    },
    footer: {
      padding: 16,
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
    },
    buttonStyle: {
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mr8: {
      marginRight: 8,
    },
  });

  return {styles};
};

const ProfilePaymentMethod = () => {
  const {styles} = useStyles();
  const dispatch = useDispatch();
  useBackHandler();
  const listCard = useSelector(state => state.cardReducer.myCardAccount.card);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [selectedCardType, setCardType] = React.useState({});
  const paymentTypes = useSelector(
    state => state.userReducer.getCompanyInfo?.companyInfo?.paymentTypes,
  );
  const {registerCardHook, isLoading: isLoadingAddCard} = usePayment();

  const getListCard = async refreshing => {
    if (!refreshing) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    await dispatch(getAccountPayment());
    setIsLoading(false);
    setIsRefreshing(false);
  };
  React.useEffect(() => {
    getListCard();
  }, []);

  React.useEffect(() => {
    dispatch(getCompanyInfo());
  }, []);

  const findAllowTransactionType = () => {
    const cardType = paymentTypes?.find(
      payment => payment?.allowSalesTransaction,
    );
    if (cardType) {
      setCardType(cardType);
    }
  };

  const goToCcDetail = item => {
    navigate('creditCardDetail', {item});
  };

  const renderItem = ({item}) => (
    <CardProfilePayment onPress={() => goToCcDetail(item)} item={item} />
  );
  const gotoStripePage = () => {
    registerCardHook('profilePaymentMethod', {
      ...selectedCardType,
      from: 'paymentProfile',
    });
  };

  React.useEffect(() => {
    if (paymentTypes) {
      findAllowTransactionType();
    }
  }, [paymentTypes]);

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <Header title={'My Cards'} />
      <LoadingScreen loading={isLoading} />

      <FlatList
        data={listCard}
        contentContainerStyle={styles.contentContainerStyle}
        ListEmptyComponent={<EmptyListPayment />}
        style={styles.scrollContainer}
        renderItem={renderItem}
        onRefresh={() => getListCard(true)}
        refreshing={isRefreshing}
      />
      <View style={styles.footer}>
        <GlobalButton
          onPress={gotoStripePage}
          disabled={isLoadingAddCard}
          rightChildren={
            <View style={styles.mr8}>
              {isLoadingAddCard ? <ActivityIndicator /> : <PlusSvg />}
            </View>
          }
          buttonStyle={styles.buttonStyle}
          title="Add Card"
        />
      </View>
    </SafeAreaView>
  );
};

export default ProfilePaymentMethod;
