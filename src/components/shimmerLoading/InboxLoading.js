/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {Animated, View, StyleSheet} from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import colorConfig from '../../config/colorConfig';
import {normalizeLayoutSizeHeight} from '../../helper/Layout';

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
  messageIcon: {
    borderRadius: 12,
  },
  messageIconContainer: {
    width: '10%',
  },
  notifShimmer: {
    position: 'absolute',
    top: 0,
    right: 5,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
  },
  messageWidth: {
    width: '90%',
  },
  messageWithTitleContainer: {
    marginTop: 17,
  },
  descriptionContainer: {
    marginTop: 8,
  },
  dateShimmer: {
    marginLeft: 'auto',
  },
});

/**
 * @typedef {Object} InboxLoadingProps
 * @property {number} numberList
 */

/**
 * @param {InboxLoadingProps} props
 */

const InboxLoading = props => {
  const {numberList} = props;
  const [listShimmer, setListShimmer] = React.useState([]);
  const handleNumberList = () => {
    let arrayList = [];
    for (let i = 0; i < numberList; i++) {
      arrayList.push(i);
    }
    console.log(arrayList, 'array');
    setListShimmer(arrayList);
  };

  React.useEffect(() => {
    handleNumberList();
  }, []);

  return (
    <>
      {listShimmer.map(shimmer => (
        <View key={shimmer} style={styles.item}>
          <View style={styles.row}>
            <View style={styles.messageIconContainer}>
              <ShimmerPlaceholder
                autoRun={true}
                duration={500}
                height={24}
                width={24}
                colorShimmer={['#e1e4e8', 'white', '#e1e4e8']}
                style={styles.messageIcon}
              />
              <ShimmerPlaceholder
                autoRun={true}
                duration={500}
                height={8}
                width={8}
                colorShimmer={['#e1e4e8', 'white', '#e1e4e8']}
                style={styles.notifShimmer}
              />
            </View>
            <View style={styles.messageWidth}>
              <View style={styles.row}>
                <ShimmerPlaceholder
                  autoRun={true}
                  duration={500}
                  height={13}
                  width={normalizeLayoutSizeHeight(248)}
                  colorShimmer={['#e1e4e8', 'white', '#e1e4e8']}
                  style={styles.messageIcon}
                />
                <ShimmerPlaceholder
                  autoRun={true}
                  duration={500}
                  height={13}
                  width={normalizeLayoutSizeHeight(34)}
                  colorShimmer={['#e1e4e8', 'white', '#e1e4e8']}
                  style={[styles.messageIcon, styles.dateShimmer]}
                />
              </View>
              <ShimmerPlaceholder
                autoRun={true}
                duration={500}
                height={13}
                width={normalizeLayoutSizeHeight(248)}
                colorShimmer={['#e1e4e8', 'white', '#e1e4e8']}
                style={[styles.messageIcon, styles.messageWithTitleContainer]}
              />
              <ShimmerPlaceholder
                autoRun={true}
                duration={500}
                height={13}
                width={normalizeLayoutSizeHeight(248)}
                colorShimmer={['#e1e4e8', 'white', '#e1e4e8']}
                style={[styles.messageIcon, styles.descriptionContainer]}
              />
              <ShimmerPlaceholder
                autoRun={true}
                duration={500}
                height={13}
                width={normalizeLayoutSizeHeight(248)}
                colorShimmer={['#e1e4e8', 'white', '#e1e4e8']}
                style={[styles.messageIcon, styles.descriptionContainer]}
              />
            </View>
          </View>
        </View>
      ))}
    </>
  );
};

export default React.memo(InboxLoading);
