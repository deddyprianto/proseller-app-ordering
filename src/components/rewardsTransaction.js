import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  Dimensions,
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
          <View style={{
            height: 50, 
            flexDirection:'row',
            // borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
            // borderBottomWidth: 1,
          }}>
            <View style={{margin: 5, paddingVertical: 8}}>
              <Text>icon</Text>
            </View>
            <View style={{margin: 5, paddingVertical: 8}}>
              <Text>detail</Text>
            </View>
            <View style={{margin: 5, paddingVertical: 8}}>
              <Text>poin</Text>
            </View>
          </View>
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
    fontWeight: 'bold'
  },
  card: {
    borderColor: colorConfig.pageIndex.inactiveTintColor, 
    borderWidth:1, 
    borderRadius: 10,
    backgroundColor: colorConfig.store.storesItem,
    justifyContent :'space-between', 
    flexDirection:'row',
  },
  item: {
    backgroundColor: '#CBCBCB',
    width:40,
    height:40,
    borderRadius: 40,
    marginHorizontal: 2,
    paddingVertical: 10,
    alignItems:'center',
  },
  detail: {
    textAlign: 'center',
    fontSize: 10
  }
});