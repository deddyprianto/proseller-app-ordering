import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import colorConfig from "../config/colorConfig";
import appConfig from '../config/appConfig';

export default class RewardsStamp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Stamp Card</Text>
        <View style={styles.card}>
          <ScrollView 
            horizontal={true} 
            style={{flex:1, alignContent: 'space-between'}}
            showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.item}>
              <Text style={styles.detail}>{appConfig.appName}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item}>
              <Text style={styles.detail}>{appConfig.appName}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.itemFree}>
              <Text style={styles.detailFree}>Free</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item}>
              <Text style={styles.detail}>{appConfig.appName}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item}>
              <Text style={styles.detail}>{appConfig.appName}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.itemFree}>
              <Text style={styles.detailFree}>Free</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item}>
              <Text style={styles.detail}>{appConfig.appName}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item}>
              <Text style={styles.detail}>{appConfig.appName}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.itemFree}>
              <Text style={styles.detailFree}>Free</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: (Dimensions.get('window').height/5)-15, 
    alignContent: 'center',
    backgroundColor: colorConfig.pageIndex.activeTintColor,
  },
  title: {
    color: colorConfig.pageIndex.backgroundColor, 
    marginTop: 10, 
    textAlign: 'center',
    fontSize: 16
  },
  card: {
    height: (Dimensions.get('window').height/6)-200, 
    width: Dimensions.get('window').width-20,
    borderColor: colorConfig.pageIndex.activeTintColor, 
    borderWidth:1, 
    marginLeft: 10, 
    marginRight: 10,
    borderRadius: 10,
    marginTop:5,
    backgroundColor: colorConfig.pageIndex.activeTintColor,
    justifyContent :'space-between', 
    flexDirection:'row',
    padding: 10,
  },
  item: {
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    width:40,
    height:40,
    borderRadius: 40,
    marginHorizontal: 5,
    paddingVertical: 12,
    alignItems:'center',
  },
  detail: {
    textAlign: 'center',
    fontSize: 10
  },
  itemFree: {
    backgroundColor: colorConfig.pageIndex.listBorder,
    width:40,
    height:40,
    borderRadius: 40,
    marginHorizontal: 5,
    paddingVertical: 12,
    alignItems:'center'
  },
  detailFree: {
    textAlign: 'center',
    fontSize: 10,
    color: colorConfig.pageIndex.backgroundColor
  }
});
