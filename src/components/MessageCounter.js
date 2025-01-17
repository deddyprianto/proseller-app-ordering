import React from 'react';
import {useSelector} from 'react-redux';
import {View, StyleSheet} from 'react-native';
import GlobalText from './globalText';
import Theme from '../theme/Theme';

const styles = StyleSheet.create({
  circleContainer: {
    position: 'absolute',
    backgroundColor: '#CE1111',
    top: 10,
    right: 15,
    width: 19,
    height: 19,
    borderRadius: 9.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCount: {
    color: 'white',
    fontSize: 8,
  },
});

const MessageCounter = () => {
  const theme = Theme();
  const messages = useSelector(
    state => state.inboxReducer.dataInbox?.broadcast?.Data,
  );

  const handleUnreadMessage = () => {
    if (messages && Array.isArray(messages)) {
      const unreadMessage = messages.filter(
        message => message.isRead === false,
      );
      if (unreadMessage.length > 99) {
        return '99+';
      }
      return unreadMessage.length > 0 ? unreadMessage.length : null;
    }
    return null;
  };

  if (handleUnreadMessage() === null || handleUnreadMessage() <= 0) {
    return null;
  }

  return (
    <View style={styles.circleContainer}>
      <GlobalText
        style={[
          styles.textCount,
          {fontFamily: theme.fontFamily.poppinsMedium},
        ]}>
        {handleUnreadMessage()}
      </GlobalText>
    </View>
  );
};

export default React.memo(MessageCounter, (prevProps, nextProps) => {
  return prevProps === nextProps;
});
