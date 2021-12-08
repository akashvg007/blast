import React, { memo } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

import shortnameToUnicode from "../../helper/shortnameToUnicode";

const Emoji = ({ item, press }) => {
  return (
    <TouchableOpacity
      style={styles.emojiContainer}
      onPress={(e) => press(shortnameToUnicode[`:${item}:`])}
    >
      <Text style={styles.emoji}>{shortnameToUnicode[`:${item}:`]}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  emojiContainer: {
    marginHorizontal: 9,
  },
  emoji: {
    fontSize: 25,
  },
});

export default Emoji;
