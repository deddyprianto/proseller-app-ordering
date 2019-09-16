import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import colorConfig from "../config/colorConfig";

export default class RewardsTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recent Transactions</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.item}>
            <Text> Point </Text>
            <Text> > </Text>
          </TouchableOpacity>

          <View style={styles.line}></View>

          <TouchableOpacity style={{
            alignItems: 'center',
            margin:10
          }} onPress={this.logout}>
            <Text style={{
              color: colorConfig.pageIndex.activeTintColor, 
              fontWeight: 'bold'
            }}> See More </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    margin:10
  },
  title: {
    color: colorConfig.pageIndex.activeTintColor, 
    fontSize: 16,
    marginBottom:5,
    marginLeft:10,
    fontWeight: 'bold'
  },
  card: {
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    borderRadius: 15,
    marginLeft: 10,
    marginRight: 10,
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
  },
  item: {
    margin: 10,
    flexDirection:'row', 
    justifyContent: 'space-between'
  },
  line: {
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    borderBottomWidth: 1,
    marginLeft: 10,
    marginRight:10
  }
});