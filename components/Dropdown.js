import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { View, StyleSheet } from 'react-native';
import { spaces } from '../util/spaces';

export default ({ multiple = false, size = '100%', items = [] }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const handleValue = (value) => {
    //console.log(value);

  };
  return (
    <View style={{ ...styles.container, width: size }}>
      <DropDownPicker
        schema={{
          label: 'label',
          value: 'value',
        }}
        open={open}
        items={items}
        setOpen={setOpen}
        onChangeValue={handleValue}
        setValue={setValue}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingTop: spaces.md,
    backgroundColor: '#fff',
    color: '#000',
  },
});
