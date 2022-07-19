import React, {useState} from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import Theme from '../../theme/Theme';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    viewGroupEGiftCard: {
      borderRadius: 10,
      flexDirection: 'column',
      flexWrap: 'wrap',
      height: HEIGHT * 0.25,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    viewImage: {
      height: HEIGHT * 0.1,
      width: WIDTH * 0.4,
      marginLeft: WIDTH * 0.0135,
      marginRight: WIDTH * 0.0135,
      marginTop: 10,
      borderRadius: 10,
    },
    viewImageSelected: {
      height: HEIGHT * 0.1,
      width: WIDTH * 0.4,
      marginLeft: WIDTH * 0.0135,
      marginRight: WIDTH * 0.0135,
      marginTop: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    WrapDot: {
      position: 'absolute',
      bottom: 0,
      flexDirection: 'row',
      alignSelf: 'center',
    },
    activeDot: {
      margin: 3,
      color: theme.colors.primary,
    },
    inactiveDot: {
      margin: 3,
      color: theme.colors.text2,
    },
  });
  return styles;
};

const EGiftCard = ({cards, selectedCard, onChange}) => {
  const styles = useStyles();
  const [activeGroupEGift, setActiveGroupEGift] = useState(0);

  const handleGroupEGift = values => {
    let parents = [];
    let children = [];

    values.forEach((value, index) => {
      if (values.length === index + 1) {
        children.push(value);
        parents.push(children);
        return (children = []);
      }

      if (children.length < 3) {
        return children.push(value);
      }

      if (children.length === 3) {
        children.push(value);
        parents.push(children);
        return (children = []);
      }
    });

    return parents;
  };

  const handleOnChange = nativeEvent => {
    const group = Math.ceil(nativeEvent.contentOffset.x / 420);
    if (group !== activeGroupEGift) {
      setActiveGroupEGift(group);
    }
  };

  const handleStyleDot = index => {
    if (activeGroupEGift === index) {
      return styles.activeDot;
    } else {
      return styles.inactiveDot;
    }
  };

  const renderDot = () => {
    const groupEGift = handleGroupEGift(cards);
    const dots = groupEGift?.map((_, index) => {
      return (
        <Text key={index} style={handleStyleDot(index)}>
          __
        </Text>
      );
    });

    return <View style={styles.WrapDot}>{dots}</View>;
  };

  const handleSelectImage = item => {
    onChange(item);
  };

  const renderGroupEGiftCardItem = item => {
    const selected = item === selectedCard;
    const styleSelected = selected
      ? styles.viewImageSelected
      : styles.viewImage;
    return (
      <TouchableOpacity
        style={styleSelected}
        onPress={() => {
          handleSelectImage(item);
        }}>
        <Image style={styles.image} resizeMode="contain" source={{uri: item}} />
      </TouchableOpacity>
    );
  };

  const renderGroupEGiftCard = () => {
    const groupEGift = handleGroupEGift(cards);

    const result = groupEGift?.map((items, index) => {
      return (
        <View key={index} style={styles.viewGroupEGiftCard}>
          {items.map(item => {
            return renderGroupEGiftCardItem(item);
          })}
        </View>
      );
    });

    return (
      <ScrollView
        onScroll={({nativeEvent}) => {
          handleOnChange(nativeEvent);
        }}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        horizontal>
        {result}
      </ScrollView>
    );
  };

  return (
    <View style={styles.wrap}>
      {renderGroupEGiftCard()}
      {renderDot()}
    </View>
  );
};

export default EGiftCard;
