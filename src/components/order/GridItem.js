import React, {memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import appConfig from '../../config/appConfig';

const ListItem = props => {
  const {item, onPress} = props;
  let image = appConfig.productPlaceholder;
  try {
    if (item.item.defaultImageURL != undefined) {
      image = {uri: item.item.defaultImageURL};
    }
  } catch (e) {}
  return (
    <View>
      <TouchableWithoutFeedback onPress={() => onPress(item)}>
        <View style={styles.itemContainer}>
          <Image
            progressiveRenderingEnabled={true}
            source={image}
            style={{
              width: Dimensions.get('window').width / 3 - 30,
              height: 100,
              alignSelf: 'center',
              resizeMode: 'contain',
            }}
          />
          <View style={styles.rightSectionContainer}>
            <View style={styles.mainTitleContainer}>
              <Text style={styles.titleStyle}>{`${item.item.name}`}</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    minHeight: 150,
    height: 150,
    width: Dimensions.get('window').width / 3 - 13,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    backgroundColor: 'white',
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.9,
    shadowRadius: 7.49,
    elevation: 16,
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
  },
  titleStyle: {
    fontSize: 13,
    textAlign: 'center',
    fontFamily: 'Lato-Medium',
  },
});

export default memo(ListItem);

ListItem.propTypes = {
  item: PropTypes.object,
  onPress: PropTypes.func,
};
