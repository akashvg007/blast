import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';
import RoundedButton from '../components/RoundedButton';
import { spaces } from '../util/spaces';
import { countryList } from '../util/data';
import { verifyOTP } from '../api/service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default ({ setVerified }) => {
  const [otp, setOtp] = useState('');

  const handlePress = async () => {
    const no = await AsyncStorage.getItem("myphone")
    const resp = await verifyOTP({ phone: no, otp })
    AsyncStorage.setItem("token", resp.accessToken);
    setVerified(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          onChangeText={setOtp}
          placeholder="enter OTP"
          value={otp}
        />
      </View>
      <View style={styles.btnGrp}>
        <RoundedButton title="VERIFY" handlePress={handlePress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingTop: spaces.xxxl,
    alignItems: 'center',
    backgroundColor: '#fff',
    color: '#000',
  },
  btnGrp: {
    flex: 0.2,
    flexDirection: 'row',
  },
  input: {
    height: 40,
    margin: 12,
    width: '90%',
    borderWidth: 1,
    padding: 10,
  },
  inputWrapper: {
    flex: 0.8,
    flexDirection: 'row',
  },
});
