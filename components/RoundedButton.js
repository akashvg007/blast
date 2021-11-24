import React from 'react';
import { Button, View, StyleSheet } from 'react-native';
import { spaces } from '../util/spaces';
import { colors } from "../util/colors"

export default ({ title, handlePress }) => {
  return (
    <View style={styles.container}>
      <Button
        onPress={handlePress}
        title={title}
        color={colors.prgreen}
        style={{ borderRadius: 10, height: 60 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.white,
    padding: spaces.xsm,
    borderRadius: 5
  },
});
