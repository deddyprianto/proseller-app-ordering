import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions, 
} from 'react-native';

import colorConfig from "../config/colorConfig";

export default class StoreNearYou extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataStoresNear: this.props.dataStoresNear,
      screenWidth: Dimensions.get('window').width,
    };
  }

  render() {
    return (
      <View style={styles.stores}>
        <Text style={styles.stores}>Stores Near You</Text>
        <View style={{ justifyContent :'space-between', flexDirection:'row' }}>
            
          <TouchableOpacity 
            style={styles.storesNearItem}>
            <View>
              <Image 
                style={styles.storesNearImage}
                source={
                  (this.state.dataStoresNear[0].image != '') ?
                  {uri:this.state.dataStoresNear[0].image} : appConfig.appImageNull
                }/>
            </View>
            <View
              style={styles.storesNearDetail}>
              <Text style={{ fontSize: 10 }}>{this.state.dataStoresNear[0].storeName}</Text>
              <Text style={{ fontSize: 10, color: colorConfig.store.defaultColor }}>{this.state.dataStoresNear[0].storeJarak+' KM'}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.storesNearItem}>
            <View>
              <Image 
                style={styles.storesNearImage}
                source={
                  (this.state.dataStoresNear[1].image != '') ?
                  {uri:this.state.dataStoresNear[1].image} : appConfig.appImageNull
                }/>
            </View>
            <View
              style={styles.storesNearDetail}>
              <Text style={{ fontSize: 10 }}>{this.state.dataStoresNear[1].storeName}</Text>
              <Text style={{ fontSize: 10, color: colorConfig.store.defaultColor }}>{this.state.dataStoresNear[1].storeJarak+' KM'}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.storesNearItem}>
            <View>
              <Image 
                style={styles.storesNearImage}
                source={
                  (this.state.dataStoresNear[2].image != '') ?
                  {uri:this.state.dataStoresNear[2].image} : appConfig.appImageNull
                }/>
            </View>
            <View
              style={styles.storesNearDetail}>
              <Text style={{ fontSize: 10 }}>{this.state.dataStoresNear[2].storeName}</Text>
              <Text style={{ fontSize: 10, color: colorConfig.store.defaultColor }}>{this.state.dataStoresNear[2].storeJarak+' KM'}</Text>
            </View>
          </TouchableOpacity>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  stores: {
    paddingTop: 5,
    paddingBottom:10,
    color: colorConfig.store.storesTitle,
    fontSize: 16,
    fontWeight: 'bold'
  },
  storesNearItem: {
    borderColor: colorConfig.store.defaultColor, 
    borderWidth:2, 
    borderRadius: 10,
    backgroundColor: colorConfig.store.storesItem,
    width: (Dimensions.get('window').width/3)-10,
  },
  storesNearImage: {
    height: (Dimensions.get('window').width/3)-14, 
    width: (Dimensions.get('window').width/3)-14,
    borderTopLeftRadius:10,
    borderTopRightRadius:10
  },
  storesNearDetail: {
    padding: 10,
    borderTopColor: colorConfig.store.defaultColor,
    borderTopWidth: 1
  },
});
