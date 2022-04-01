/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

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

import {isEmptyArray} from '../../helper/CheckEmpty';
import colorConfig from '../../config/colorConfig';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  viewGroupEGiftCard: {
    borderRadius: 10,
    flexDirection: 'column',
    flexWrap: 'wrap',
    height: HEIGHT * 0.25,
  },
  image: {
    height: HEIGHT * 0.1,
    width: WIDTH * 0.4,
    marginLeft: WIDTH * 0.0135,
    marginRight: WIDTH * 0.0135,
    marginTop: 10,
    borderRadius: 10,
  },
  imageSelected: {
    height: HEIGHT * 0.1,
    width: WIDTH * 0.4,
    marginLeft: WIDTH * 0.0135,
    marginRight: WIDTH * 0.0135,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colorConfig.primaryColor,
  },
  WrapDot: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  activeDot: {
    margin: 3,
    color: colorConfig.primaryColor,
  },
  inactiveDot: {
    margin: 3,
    color: '#808080',
  },
});

const EGiftCard = ({eGifts}) => {
  const [groupEGift, setGroupEGift] = useState([]);
  const [activeGroupEGift, setActiveGroupEGift] = useState(0);
  const [selectedEGiftCard, setSelectedEGiftCard] = useState({});

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
    console.log(parents);
    setGroupEGift(parents);
  };

  useState(() => {
    if (!isEmptyArray(eGifts)) {
      handleGroupEGift(eGifts);
      setSelectedEGiftCard(eGifts[0]);
    }
  }, []);

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
    const dots = groupEGift.map((_, index) => {
      return (
        <Text key={index} style={handleStyleDot(index)}>
          __
        </Text>
      );
    });

    return <View style={styles.WrapDot}>{dots}</View>;
  };

  const handleImageSelected = item => {
    if (item?.id === selectedEGiftCard?.id) {
      return styles.imageSelected;
    }
    return styles.image;
  };

  const renderGroupEGiftCard = () => {
    const result = groupEGift.map((items, index) => {
      return (
        <View style={styles.viewGroupEGiftCard}>
          {items.map(item => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectedEGiftCard(item);
                }}>
                <Image
                  key={index}
                  style={handleImageSelected(item)}
                  resizeMode="stretch"
                  source={{uri: item.image}}
                />
              </TouchableOpacity>
            );
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
