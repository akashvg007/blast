import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Snackbar } from "react-native-paper";

export const SnackBar = ({ show, title, click = null, duration }) => {
  const [visible, setVisible] = useState(show);
  const onDismissSnackBar = () => setVisible(false);

  return (
    <View style={styles.container}>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={duration || 5000}
        action={{
          label: "Close",
          onPress: click,
        }}
      >
        {title}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    top: "90%",
    left: 0,
    height: 100,
    width: "100%",
  },
});
