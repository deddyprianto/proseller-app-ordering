import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import Swiper from 'react-native-swiper';
import awsConfig from "../config/awsConfig";
import Loader from "../components/loader";

const styles = StyleSheet.create({
  container : {
    flex: 1,
    padding:10,
  },
  propotion: {
    height: 100
  },
  propotionSlide: {
    flex: 1
  }
});
export default class Store extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataStores: [],
      isLoading: true,
      screenHeight: Dimensions.get('window').height,
    };
  }

  componentDidMount(){
    if (this.state.dataStores.length === 0){
      this.setState({ isLoading: true });
    } else {
      this.setState({ isLoading: false });
    }
    
    fetch(awsConfig.getStores)
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        dataStores: responseJson.Items
      });
    })
    .catch((error) =>{
      console.error(error);
    });
  }

  renderStores = () => {
    return (<View>
        {
          this.state.dataStores.map((item, key)=> 
            <TouchableOpacity key={key} 
              style={{
                height: 103, 
                flexDirection:'row', 
                borderColor: '#FAA21C', 
                borderWidth:1, 
                marginBottom: 10,
                borderRadius: 15,
                backgroundColor: '#FFFFFF'
              }}>
              <View>
                <Image 
                  style={{
                    height: 100, 
                    width: 100, 
                    borderTopLeftRadius: 15,
                    borderBottomLeftRadius: 15,
                  }} 
                  source={require('../assets/slide/slide1.jpg')}/>
              </View>
              <View style={{padding: 10, borderLeftColor: '#FAA21C', borderLeftWidth: 1}}>
                <Text>{item.storeName}</Text>
                <Text>{item.region}</Text>
                <Text>{item.createdAt}</Text>
              </View>
            </TouchableOpacity>
          )
        }
    </View>)
  }

  render() {
    return (
      <ScrollView style={{backgroundColor: '#FFFBF4'}}>
        {
          (this.state.isLoading === true) ? 
          <View style={{height: this.state.screenHeight}}>
            {(this.state.isLoading) && <Loader />}
          </View> :

          <View style={styles.container}>
            {/* <View>
              <Text>Propotion</Text>
              <Swiper style={{height:100}}>
                <View style={{flex: 1}}>
                  <Image source={require('../assets/slide/slide1.jpg')}/>
                </View>
                <View style={{flex: 1}}>
                  <Image source={require('../assets/slide/slide2.jpg')}/>
                </View>
                <View style={{flex: 1}}>
                  <Image source={require('../assets/slide/slide3.jpg')}/>
                </View>
                <View style={{flex: 1}}>
                  <Image source={require('../assets/slide/slide4.jpg')}/>
                </View>
              </Swiper>
            </View>
            <View>
              <Text>Stores Near You</Text>
            </View> */}
            <View style={{paddingTop: 10}}>
              <Text style={{paddingBottom: 10}}>Stores - Central Region</Text>
              <View>
                {this.renderStores()}
              </View>
            </View>
          </View>
        }
      </ScrollView>
    );
  }
}
