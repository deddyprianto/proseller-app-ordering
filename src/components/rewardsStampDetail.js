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

export default class StampDetail extends Component {
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
        <Text style={styles.title}> Get stamps for every $5 purchase. </Text>
        <Text style={styles.subTitle}> For a limited time only. </Text>
        <Text style={styles.description}> Unlock Free Items for every 3 stamps earned. </Text>
        <TouchableOpacity>
          <Text style={styles.btn}>Learn More</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: (Dimensions.get('window').height/5)-30, 
    alignContent: 'center',
    backgroundColor: colorConfig.pageIndex.activeTintColor,
    paddingLeft:10,
    paddingRight:10,
    alignItems: 'center'
  },
  title: {
    color: colorConfig.pageIndex.backgroundColor, 
    fontSize: 14,
    fontWeight: 'bold'
  },
  subTitle: {
    color: colorConfig.pageIndex.backgroundColor, 
    fontSize: 12
  },
  description: {
    color: colorConfig.pageIndex.backgroundColor, 
    fontSize: 14
  },
  btn: {
    color: colorConfig.pageIndex.listBorder, 
    fontSize: 14,
    paddingTop: 5,
    fontWeight: 'bold'
  }
});
