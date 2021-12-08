import React, { memo } from "react";
import { FlatList, Dimensions } from "react-native";

import Emoji from "./Emoji";
import { emojisByCategory } from "../../data/emojis";

const EmojiCategory = ({ category, press }) => {
  return (
    <FlatList
      data={emojisByCategory[category]}
      renderItem={({ item }) => <Emoji press={press} item={item} />}
      keyExtractor={(item) => item}
      numColumns={8}
    />
  );
};

export default memo(EmojiCategory);
