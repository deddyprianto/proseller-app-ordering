import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl ,
  TouchableOpacity,
  Image
} from 'react-native';

import colorConfig from "../config/colorConfig";
import appConfig from "../config/appConfig";

export default class AccountUserDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
    };
  }

  editProfil = () => {
    console.log('edit profil')
  }

  render() {
    return (
      <View style={{
        marginTop: 10,
        height: 160, 
        alignItems: 'center',
      }}>
        <View style={{
          height: 100,
          width: this.state.screenWidth-100,
          backgroundColor: colorConfig.pageIndex.backgroundColor,
          marginTop: 50,
          position: 'absolute',
          alignItems: 'center',
          borderRadius: 10,
          borderColor: colorConfig.pageIndex.activeTintColor,
          borderWidth: 1
        }}>
          <View style={{
            height: 75,
            width: 75,
            borderRadius: 75,
            backgroundColor: colorConfig.pageIndex.backgroundColor,
            position: 'absolute',
            top: -40,
            alignItems: 'center',
            borderColor: colorConfig.pageIndex.activeTintColor,
            borderWidth: 1
          }}>
            <Image style={{
              height: 73,
              width: 73,
              borderRadius: 73,
            }} 
              source={appConfig.appImageNull}/>
          </View>
          <View style={{
            marginTop: 40
          }}>
            <Text> User Name </Text>
          </View>
          <View>
            <TouchableOpacity
            onPress={this.editProfil}> 
              <Text style={{
                color: colorConfig.pageIndex.inactiveTintColor,
                fontSize: 12
              }}>Edit Profile ></Text> 
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
