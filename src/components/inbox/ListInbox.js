import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  useWindowDimensions,
} from 'react-native';

import RenderHtml from 'react-native-render-html';
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
  imageDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    marginLeft: 'auto',
    color: '#888787',
  },
  imageMessage: {
    width: 21,
    height: 21,
    marginRight: 8,
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
  titleStyle: isRead => ({
    fontSize: 16,
    color: isRead ? '#888787' : 'black',
  }),
  descriptionStyle: {
    fontSize: 14,
    color: '#888787',
  },
  titleContainer: {
    width: normalizeLayoutSizeWidth(240),
  },
  messageContainer: {
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
  const theme = Theme();
  const {width} = useWindowDimensions();
  const tagsStyles = {
    p: {
      margin: 0,
      padding: 0,
    },
  };
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
              styles.titleStyle(item.isRead),
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
          <RenderHtml
            contentWidth={width}
            source={{html: item?.message?.replace(/<img[^>]*>/g, '')}}
            tagsStyles={tagsStyles}
            enableExperimentalBRCollapsing={true}
            enableExperimentalMarginCollapsing={true}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListInbox;
