import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
} from 'react-native';
import MessageOpen from '../../assets/img/message-read.png';
import UnreadMessage from '../../assets/img/message-unread.png';
import {calculateDateTime} from '../../helper/TimeUtils';
import colorConfig from '../../config/colorConfig';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  item: {
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 2,
    marginVertical: 8,
    padding: 18,
    borderRadius: 5,
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
  },
  imageMessage: {
    width: 23,
    height: 21,
    marginRight: 11,
  },
  line: {
    height: 1,
    backgroundColor: '#D6D6D6',
    marginVertical: 18,
  },
  markStyle: {
    width: 5,
    height: 5,
    backgroundColor: '#CE1111',
    marginTop: -10,
    borderRadius: 2.5,
  },
  titleStyle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  descriptionContainer: {
    marginTop: 8,
  },
  descriptionStyle: {
    fontSize: 14,
  },
});

const ListInbox = ({item, index, openDetailMessage}) => {
  const {colors} = Theme();
  const handleImage = () => {
    if (item.isRead === true) {
      return (
        <Image
          resizeMode="contain"
          style={styles.imageMessage}
          source={MessageOpen}
        />
      );
    }
    return (
      <Image
        resizeMode="contain"
        style={styles.imageMessage}
        source={UnreadMessage}
      />
    );
  };

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => openDetailMessage(item, index)}>
      <View style={styles.imageDetail}>
        {handleImage()}
        <Text style={[styles.dateText, {color: colors.primary}]}>
          {calculateDateTime(item.sendOn)}
        </Text>
        {!item.isRead ? <View style={styles.markStyle} /> : null}
      </View>
      <View style={styles.line} />
      <View>
        <View>
          <Text style={styles.titleStyle}>{item.title}</Text>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionStyle}>
            {item.message.substr(0, 50)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListInbox;
