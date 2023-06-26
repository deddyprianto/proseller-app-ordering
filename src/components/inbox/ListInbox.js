import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Dimensions,
  Image,
} from 'react-native';
import MessageOpen from '../../assets/img/message-read.png';
import {calculateDateTime} from '../../helper/TimeUtils';
import colorConfig from '../../config/colorConfig';
import GlobalText from '../globalText';
import {normalizeLayoutSizeWidth} from '../../helper/Layout';
import InboxOpenSvg from '../../assets/svg/InboxOpenSvg';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  item: {
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 2,
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
  sejajarSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detail: {
    paddingTop: 5,
    paddingRight: 5,
    paddingBottom: 5,
    width: Dimensions.get('window').width - 120,
  },
  paymentType: {
    color: colorConfig.pageIndex.grayColor,
    fontSize: 12,
  },
  btnDetail: {
    alignItems: 'center',
    width: 40,
    paddingTop: 15,
  },
  imageDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  isUnRead: {
    width: 8,
    height: 8,
    borderRadius: 50,
    backgroundColor: 'red',
  },
  paymentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 14,
    marginLeft: 'auto',
  },
  imageMessage: {
    width: 21,
    height: 21,
    marginRight: 8,
  },
  line: {
    height: 1,
    backgroundColor: '#D6D6D6',
    marginVertical: 8,
  },
  markStyle: {
    width: 8,
    height: 8,
    backgroundColor: '#CE1111',
    marginTop: -10,
    borderRadius: 4,
    right: -15,
    top: -12,
  },
  titleStyle: {
    // fontWeight: 'bold',
    fontSize: 16,
  },
  descriptionContainer: {
    marginTop: 8,
  },
  descriptionStyle: {
    fontSize: 14,
    color: '#888787',
  },
  titleContainer: {
    width: normalizeLayoutSizeWidth(259),
  },
  messageContainer: {
    marginTop: 8,
    flexDirection: 'row',
  },
  imageContainer: {
    width: '10%',
  },
  containerText90: {
    width: '90%',
  },
});

const ListInbox = ({item, index, openDetailMessage}) => {
  const theme = Theme()
  const handleImage = () => {
    if (item.isRead === true) {
      return (
        <View style={styles.imageContainer}>
          <Image
            resizeMode="contain"
            style={styles.imageMessage}
            source={MessageOpen}
          />
        </View>
      );
    }
    return (
      <View style={styles.imageContainer}>
        <View>
          <InboxOpenSvg />
        </View>
        {!item.isRead ? <View style={styles.markStyle} /> : null}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => openDetailMessage(item, index)}>
      <View style={styles.imageDetail}>
        {handleImage()}

        <View style={styles.titleContainer}>
          <GlobalText
            numberOfLines={1}
            style={[
              styles.titleStyle,
              {fontFamily: theme.fontFamily.poppinsBold},
            ]}>
            {item.title}
          </GlobalText>
        </View>
        <GlobalText style={[styles.dateText]}>
          {calculateDateTime(item.sendOn)}
        </GlobalText>
      </View>
      <View style={styles.messageContainer}>
        <View style={styles.imageContainer} />
        <View style={styles.containerText90}>
          <GlobalText
            numberOfLines={3}
            style={[
              styles.descriptionStyle,
              {fontFamily: theme.fontFamily.poppinsMedium},
            ]}>
            {item.message}
          </GlobalText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListInbox;