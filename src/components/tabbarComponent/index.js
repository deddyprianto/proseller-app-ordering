import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import GlobalText from '../globalText';
import Theme from '../../theme/Theme';
import {normalizeLayoutSizeHeight} from '../../helper/Layout';

const width = Dimensions.get('window').width;

const useStyles = () => {
  const {colors, fontFamily} = Theme();
  const styles = StyleSheet.create({
    tabContainer: routesLength => ({
      width: routesLength > 3 ? width / 3 : width / routesLength,
      backgroundColor: colors.primary,
      height: normalizeLayoutSizeHeight(40),
      alignItems: 'center',
      justifyContent: 'center',
    }),
    tabText: {
      color: 'white',
      fontSize: 14,
      fontFamily: fontFamily.poppinsMedium,
    },
    areaActive: {
      backgroundColor: 'white',
      width: '90%',
      paddingVertical: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    areaInActive: {
      backgroundColor: 'white',
      width: '90%',
      paddingVertical: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  return {styles, colors};
};

const TabbarComponent = ({routes}) => {
  const {styles, colors} = useStyles();
  const [activeTab, setActiveTab] = React.useState(routes[0]?.key);
  const onClickTab = key => {
    setActiveTab(key);
  };

  const handleActiveComponent = () => {
    const findComponent = routes.find(route => route.key === activeTab);
    return findComponent?.children();
  };

  return (
    <View style={{flex: 1}}>
      <View>
        <ScrollView horizontal>
          {routes?.map(route => (
            <TouchableOpacity
              key={route.key}
              activeOpacity={1}
              onPress={() => onClickTab(route?.key)}
              style={styles.tabContainer(routes.length)}>
              <View
                style={[
                  styles.areaActive,
                  {
                    backgroundColor:
                      route.key === activeTab ? 'white' : colors.primary,
                  },
                ]}>
                <GlobalText
                  style={[
                    styles.tabText,
                    {
                      color:
                        activeTab === route?.key ? colors.primary : 'white',
                    },
                  ]}>
                  {route.title}
                </GlobalText>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {handleActiveComponent()}
    </View>
  );
};

export default React.memo(TabbarComponent);
