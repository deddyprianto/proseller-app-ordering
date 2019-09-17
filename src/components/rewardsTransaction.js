import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image
} from 'react-native';
import {connect} from "react-redux";
import {compose} from "redux";

import logoCash from '../assets/img/cash.png';
import logoVisa from '../assets/img/visa.png';
import colorConfig from "../config/colorConfig";

class RewardsTransaction extends Component {
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
          {
            console.log(this.props.recentTransaction)
          }
          {
            (this.props.recentTransaction != undefined)?
            this.props.recentTransaction.map((item, key) =>
              <View key={key}>
                {
                  <View>
                    <TouchableOpacity style={styles.item}>
                    <View style={{
                      flexDirection:'row', 
                    }}>
                      <Image resizeMode='stretch' style={styles.imageLogo} source={
                        (item.paymentType == 'Cash')? logoCash : logoVisa
                      }/>
                      <Text style={{
                        marginLeft: 10
                      }}>{item.storeName}</Text>
                    </View>
                    <Text>{item.pointDebit} > </Text>
                  </TouchableOpacity>
                  <View style={styles.line}></View>
                </View>
                }
              </View>
              ) : null
          }

          <TouchableOpacity style={{
            alignItems: 'center',
            margin:10
          }} onPress={this.logout}>
            <Text style={{
              color: colorConfig.pageIndex.activeTintColor, 
              fontWeight: 'bold'
            }}> 
              {
                (this.props.recentTransaction != undefined) ?
                  (this.props.recentTransaction.length == 0) ? 'Empty' : 'See More' : null
              }
            </Text>
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
    marginBottom: 20
  },
  item: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 5,
    flexDirection:'row', 
    justifyContent: 'space-between'
  },
  line: {
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    borderBottomWidth: 1,
    marginLeft: 10,
    marginRight:10
  },
  imageLogo: {
    width: 30,
    height: 20,
    paddingTop: 5,
    marginBottom:5,
  },
});

mapStateToProps = (state) => ({
  recentTransaction : state.rewardsReducer.dataPoint.recentTransaction
});

mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(RewardsTransaction);