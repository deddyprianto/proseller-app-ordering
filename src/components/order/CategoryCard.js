import React, {memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import appConfig from '../../config/appConfig';
import Icon from 'react-native-vector-icons/FontAwesome';
import colorConfig from '../../config/colorConfig';

const CategoryCard = props => {
  const {item, onPress, productPlaceholder} = props;
  let image = appConfig.productPlaceholder;
  try {
    if (productPlaceholder !== undefined && productPlaceholder !== null) {
      image = {uri: productPlaceholder};
    }
    if (item.item.defaultImageURL !== undefined) {
      image = {uri: item.item.defaultImageURL};
    }
  } catch (e) {}
  return (
    <TouchableWithoutFeedback onPress={() => onPress(item)}>
      <View style={styles.itemContainer}>
        {item.item.type === 'all' ? (
          <View>
            <Icon
              size={60}
              name={'th-large'}
              style={{
                color: colorConfig.store.defaultColor,
                height: 70,
              }}
            />
          </View>
        ) : (
          <Image
            progressiveRenderingEnabled={true}
            source={image}
            style={{
              width: Dimensions.get('window').width / 3 - 30,
              height: 60,
              alignSelf: 'center',
              resizeMode: 'contain',
              marginBottom: 8,
            }}
          />
        )}
        <View style={styles.mainTitleContainer}>
          <Text style={styles.titleStyle}>{`${item.item.name}`}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginTop: 10,
    marginRight: 15,
    minHeight: 100,
    maxHeight: 100,
    height: 120,
    width: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // margin: 10,
    backgroundColor: 'white',
    // shadowColor: '#00000021',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.1,
    // // shadowRadius: 18.49,
    // elevation: 6,
  },
  leftElementContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
    paddingLeft: 13,
  },
  rightSectionContainer: {
    // marginLeft: 18,
    flexDirection: 'row',
    // flex: 20,
    // borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#515151',
  },
  mainTitleContainer: {
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1,
    marginTop: 15,
  },
  titleStyle: {
    fontSize: 12,
    maxWidth: 110,
    height: 50,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    textTransform: 'capitalize',
  },
});

export default memo(CategoryCard);

CategoryCard.propTypes = {
  item: PropTypes.object,
  onPress: PropTypes.func,
};
