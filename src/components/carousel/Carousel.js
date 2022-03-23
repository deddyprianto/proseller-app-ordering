/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import CarouselItem from './components/CarouselItem';

const Carousel = () => {
  const data = [
    {
      title: 'Anise Aroma Art Bazar',
      url: 'https://i.ibb.co/hYjK44F/anise-aroma-art-bazaar-277253.jpg',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      id: 1,
    },
    {
      title: 'Food inside a Bowl',
      url: 'https://i.ibb.co/JtS24qP/food-inside-bowl-1854037.jpg',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      id: 2,
    },
    {
      title: 'Vegatable Salad',
      url:
        'https://i.ibb.co/JxykVBt/flat-lay-photography-of-vegetable-salad-on-plate-1640777.jpg',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      id: 3,
    },
  ];
  const {width, heigth} = Dimensions.get('window');
  const scrollX = new Animated.Value(0);
  let position = Animated.divide(scrollX, width);

  const [flatList, setFlatList] = useState({});
  const [dataList, setDataList] = useState(data);

  const infiniteScroll = value => {
    const numberOfData = value.length;
    let scrollValue = 0,
      scrolled = 0;

    setInterval(function() {
      scrolled++;
      if (scrolled < numberOfData) {
        scrollValue = scrollValue + width;
      } else {
        scrollValue = 0;
        scrolled = 0;
      }
      if (flatList?.scrollToOffset) {
        flatList.scrollToOffset({animated: true, offset: scrollValue});
      }
    }, 3000);
  };

  useEffect(() => {
    setDataList(data);
    infiniteScroll(dataList);
  }, []);

  if (data && data.length) {
    return (
      <View>
        <FlatList
          data={data}
          ref={value => {
            setFlatList(value);
          }}
          keyExtractor={(item, index) => 'key' + index}
          horizontal
          pagingEnabled
          scrollEnabled
          snapToAlignment="center"
          scrollEventThrottle={16}
          decelerationRate={'fast'}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => {
            return <CarouselItem item={item} />;
          }}
          onScroll={Animated.event([
            {nativeEvent: {contentOffset: {x: scrollX}}},
          ])}
        />

        <View style={styles.dotView}>
          {data.map((_, i) => {
            let opacity = position.interpolate({
              inputRange: [i - 1, i, i + 1],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={{
                  opacity,
                  height: 10,
                  width: 10,
                  backgroundColor: '#595959',
                  margin: 8,
                  borderRadius: 5,
                }}
              />
            );
          })}
        </View>
      </View>
    );
  }

  console.log('Please provide Images');
  return null;
};

const styles = StyleSheet.create({
  dotView: {flexDirection: 'row', justifyContent: 'center'},
});

export default Carousel;
