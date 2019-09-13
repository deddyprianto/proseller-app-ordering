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

export default class StoreStores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataStoreRegion: this.props.dataStoreRegion,
      dataAllStore: this.props.dataAllStore
    };
  }

  render() {
    return (
      <View>
        { this.state.dataStoreRegion.map((region, index) =>
          <View style={styles.stores} key={index}>
            <Text style={styles.stores}>Stores - {region}</Text>
            {
              this.state.dataAllStore[this.state.dataStoreRegion[index]].map((item, keys)=>
                <View key={keys}>
                {
                  <TouchableOpacity 
                    style={styles.storesItem}>
                    <View>
                      <Image 
                        style={styles.storesImage} 
                        source={
                          (item.image != '') ?
                          {uri:item.image} : appConfig.appImageNull
                        }/>
                    </View>
                    <View style={styles.storesDetail}>
                      <Text style={{fontSize:14}}>{item.storeName}</Text>
                      {
                        (item.storeJarak != '-') ? 
                        <Text style={{fontSize:12, color: colorConfig.store.defaultColor}}>{item.storeJarak+' KM'}</Text>: null
                      }
                      <Text style={{fontSize:12, color: colorConfig.store.defaultColor}}>{item.storeStatus}</Text>
                    </View>
                  </TouchableOpacity>
                }
                </View>
              )
            }
          </View>
          )
        }
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
  storesItem: {
    height: (Dimensions.get('window').width/4)+3, 
    flexDirection:'row', 
    borderColor: colorConfig.store.defaultColor, 
    borderWidth:1, 
    marginBottom: 5,
    borderRadius: 10,
    backgroundColor: colorConfig.store.storesItem,
  },
  storesImage: {
    height: (Dimensions.get('window').width/4), 
    width: (Dimensions.get('window').width/4), 
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  storesDetail: {
    padding: 10, 
    borderLeftColor: colorConfig.store.defaultColor, 
    borderLeftWidth: 1
  },
});
