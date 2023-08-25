import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import Theme from '../theme/Theme';
import GlobalText from '../components/globalText';
import {Header} from '../components/layout';
import GlobalButton from '../components/button/GlobalButton';
import TrashSvg from '../assets/svg/TrashSvg';
import ModalAction from '../components/modal/ModalAction';
import {Actions} from 'react-native-router-flux';
import {getAccountPayment, removeCard} from '../actions/payment.actions';
import {useDispatch} from 'react-redux';
import {showSnackbar} from '../actions/setting.action';

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
    cardContainer: {
      marginHorizontal: 16,
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      borderRadius: 8,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 12,
      paddingVertical: 12,
      marginVertical: 16,
    },
    mediumFomt: {
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    greyFont: {
      color: theme.colors.greyScale2,
    },
    blackFont: {
      color: 'black',
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: 16,
    },
    containerBtnDelete: {
      marginHorizontal: 16,
    },
    buttonStyle: {
      flexDirection: 'row',
    },
    mr8: {
      marginRight: 8,
    },
    modalContent: {},
  });

  return {styles, colors: theme.colors};
};

const CreditCardDetail = props => {
  const {styles, colors} = useStyles();
  const [showDeletePopup, setShowDeletePopup] = React.useState(false);
  const dispatch = useDispatch();
  const togglePopup = () => setShowDeletePopup(prevState => !prevState);
  const onDeleteCard = async () => {
    const response = await dispatch(removeCard(props.item));
    if (response?.success) {
      await dispatch(getAccountPayment());
      dispatch(
        showSnackbar({
          message: 'Card deleted',
          type: 'success',
          background: colors.semanticSuccess,
        }),
      );
      setShowDeletePopup(false);
      Actions.pop();
    } else {
      dispatch(
        showSnackbar({
          message: 'Card deletion unsuccessful. Please try again.',
        }),
      );
    }
  };
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <Header title={'Card Details'} />
      <ScrollView
        contentContainerStyle={styles.contentContainerStyle}
        style={styles.scrollContainer}>
        <View style={styles.cardContainer}>
          <GlobalText style={[styles.mediumFomt, styles.greyFont]}>
            Credit Card
          </GlobalText>
          <GlobalText style={[styles.mediumFomt, styles.blackFont]}>
            {props?.item?.details?.cardIssuer?.toUpperCase()}
          </GlobalText>
          <View style={styles.divider} />
          <GlobalText style={[styles.mediumFomt, styles.greyFont]}>
            Credit Card Number
          </GlobalText>
          <GlobalText style={[styles.mediumFomt, styles.blackFont]}>
            {props?.item?.paymentName}
          </GlobalText>
        </View>
        <View style={styles.containerBtnDelete}>
          <GlobalButton
            onPress={togglePopup}
            buttonStyle={styles.buttonStyle}
            rightChildren={
              <View style={styles.mr8}>
                <TrashSvg />
              </View>
            }
            isOutline
            title="Delete Card"
          />
        </View>
      </ScrollView>
      <ModalAction
        isVisible={showDeletePopup}
        closeModal={togglePopup}
        title="Delete Card"
        onApprove={onDeleteCard}
        onCancel={togglePopup}
        description="Are you sure you want to delete this card?"
      />
    </SafeAreaView>
  );
};

export default CreditCardDetail;
