import React, {useEffect, useState} from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import {CheckBox} from 'react-native-elements';

import colorConfig from '../config/colorConfig';
import EGiftCard from '../components/eGIftCard/EGiftCard';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
  },
  viewHeader: {
    paddingTop: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  viewBody: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    width: WIDTH * 0.35,
    height: HEIGHT * 0.035,
    backgroundColor: colorConfig.fifthColor,
  },
  textTitle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  textDescription: {
    color: 'black',
    textAlign: 'center',
    fontSize: 12,
    width: WIDTH * 0.6,
    letterSpacing: 0.2,
    marginTop: 30,
    marginBottom: 20,
  },
  text1: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  text2: {
    marginTop: 10,
    color: 'black',
    fontSize: 14,
  },
  text3: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  textRequired: {
    marginTop: 10,
    color: 'red',
    fontSize: 14,
  },
  input: {
    height: 35,
    marginTop: 5,
    borderWidth: 1,
    fontSize: 10,
    borderRadius: 5,
  },
  inputEmpty: {
    height: 35,
    marginTop: 5,
    borderWidth: 1,
    fontSize: 10,
    borderRadius: 5,
    borderColor: 'red',
  },
  viewText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: colorConfig.primaryColor,
    height: 35,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    color: 'white',
    fontSize: 20,
  },
  viewOr: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textOr: {
    color: 'black',
    fontSize: 20,
  },
});

const SendEGift = () => {
  const [text, onChangeText] = useState('');
  const [selectedValue, setSelectedValue] = useState({});
  const [quantityValue, setQuantityValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [confirmEmailValue, setConfirmEmailValue] = useState('');
  const [recipientNameValue, setRecipientNameValue] = useState('');
  const [recipientEmailValue, setRecipientEmailValue] = useState('');

  const categories = [
    {
      id: 1,
      name: 'martin',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      id: 2,
      name: 'test',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      id: 3,
      name: 'anjay',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      id: 4,
      name: 'martin',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      id: 5,
      name: 'test',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      id: 6,
      name: 'anjay',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      id: 7,
      name: 'martin',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      id: 8,
      name: 'test',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      id: 9,
      name: 'anjay',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      id: 10,
      name: 'anjay',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      id: 11,
      name: 'martin',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      id: 12,
      name: 'test',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      id: 13,
      name: 'anjay',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
  ];

  const values = [
    {id: 1, value: 5},
    {id: 2, value: 10},
    {id: 3, value: 15},
    {id: 4, value: 20},
  ];

  useEffect(() => {
    const a = [
      {id: 1, value: 5},
      {id: 2, value: 10},
      {id: 3, value: 15},
      {id: 4, value: 20},
    ];

    setSelectedValue(a[0]);
  }, []);

  //   const handleStyleInput = value => {
  //     if (value) {
  //       return styles.input;
  //     } else {
  //       return styles.inputEmpty;
  //     }
  //   };

  const handleCheckboxSelected = value => {
    if (selectedValue.id === value.id) {
      return true;
    } else {
      return false;
    }
  };

  const renderCheckBoxValue = () => {
    const result = values.map(value => {
      return (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: -20,
          }}>
          <CheckBox
            onPress={() => {
              setSelectedValue(value);
            }}
            checked={handleCheckboxSelected(value)}
            checkedColor={colorConfig.primaryColor}
          />
          <Text style={{marginLeft: -20}}>${value.value}</Text>
        </View>
      );
    });
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginRight: 10,
        }}>
        {result}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.viewHeader}>
        <View style={styles.viewTitle}>
          <Text style={styles.textTitle}>Send A Gift</Text>
        </View>
        <Text style={styles.textDescription}>
          Send a gift to your love ones or friends with a custom design voucher
        </Text>
      </View>
      <Text style={styles.text1}>Select the following options</Text>
      <View style={styles.viewText}>
        <Text style={styles.text2}>Pick a Design </Text>
        <Text style={styles.textRequired}>*</Text>
      </View>

      <EGiftCard eGifts={categories} />

      <View style={styles.viewText}>
        <Text style={styles.text2}>Value of Voucher </Text>
        <Text style={styles.textRequired}>*</Text>
      </View>

      {renderCheckBoxValue()}

      <View style={styles.viewText}>
        <Text style={styles.text2}>Quantity </Text>
        <Text style={styles.textRequired}>*</Text>
      </View>
      {/* <SafeAreaView>
        <TextInput
          style={handleStyleInput(quantityValue)}
          onChangeText={value => {
            setQuantityValue(value);
          }}
          value={quantityValue}
          placeholder="cannot be empty"
        />
      </SafeAreaView> */}
      <TextInput
        style={styles.input}
        onChangeText={value => {
          setQuantityValue(value.replace(/[^0-9]/g, ''));
        }}
        value={quantityValue}
      />
      <Text style={styles.text3}>This gift is from : </Text>
      <View style={styles.viewText}>
        <Text style={styles.text2}>Your email address </Text>
        <Text style={styles.textRequired}>*</Text>
      </View>
      {/* <Text style={styles.text2}>Your email address :</Text> */}
      {/* <SafeAreaView>
        <TextInput
          style={handleStyleInput(quantityValue)}
          onChangeText={value => {
            setQuantityValue(value);
          }}
          value={quantityValue}
          placeholder="cannot be empty"
        />
      </SafeAreaView> */}
      <TextInput
        style={styles.input}
        onChangeText={setEmailValue}
        value={emailValue}
      />
      <View style={styles.viewText}>
        <Text style={styles.text2}>Confirm your email address </Text>
        <Text style={styles.textRequired}>*</Text>
      </View>
      {/* <Text style={styles.text2}>Confirm your email address :</Text> */}
      {/* <SafeAreaView>
        <TextInput
          style={handleStyleInput(quantityValue)}
          onChangeText={value => {
            setQuantityValue(value);
          }}
          value={quantityValue}
          placeholder="cannot be empty"
        />
      </SafeAreaView> */}
      <TextInput
        style={styles.input}
        onChangeText={setConfirmEmailValue}
        value={confirmEmailValue}
      />
      <Text style={styles.text3}>Deliver this gift to :</Text>
      <View style={styles.viewText}>
        <Text style={styles.text2}>Recipient Name </Text>
        <Text style={styles.textRequired}>*</Text>
      </View>
      {/* <Text style={styles.text2}>Recipient Name :</Text> */}
      {/* <SafeAreaView>
        <TextInput
          style={handleStyleInput(quantityValue)}
          onChangeText={value => {
            setQuantityValue(value);
          }}
          value={quantityValue}
          placeholder="cannot be empty"
        />
      </SafeAreaView> */}
      <TextInput
        style={styles.input}
        onChangeText={setRecipientNameValue}
        value={recipientNameValue}
      />
      <View style={styles.viewText}>
        <Text style={styles.text2}>Recipient Email </Text>
        <Text style={styles.textRequired}>*</Text>
      </View>
      {/* <Text style={styles.text2}>Recipient Email :</Text> */}
      {/* <SafeAreaView>
        <TextInput
          style={handleStyleInput(quantityValue)}
          onChangeText={value => {
            setQuantityValue(value);
          }}
          value={quantityValue}
          placeholder="cannot be empty"
        />
      </SafeAreaView> */}
      <TextInput
        style={styles.input}
        onChangeText={setRecipientEmailValue}
        value={recipientEmailValue}
      />

      <TouchableOpacity onPress={() => {}}>
        <View style={styles.viewButton}>
          <Text style={styles.textButton}>Pay with Paylah</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.viewOr}>
        <Text style={styles.textOr}>OR</Text>
      </View>

      <TouchableOpacity onPress={() => {}}>
        <View style={styles.viewButton}>
          <Text style={styles.textButton}>Pay 10 SGD</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SendEGift;
