import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, IconButton } from "react-native-paper";
import EmojiSelector, { Categories } from "react-native-emoji-selector";

export default function ChatInput({ setText, text, send }) {
  const pressEmoji = () => {
    return (
      <EmojiSelector
        category={Categories.symbols}
        onEmojiSelected={(emoji) => console.log(emoji)}
      />
    );
  };
  return (
    <View>
      <TextInput
        style={styles.textInput}
        multiline
        placeholder="Type a Message"
        onChangeText={setText}
        value={text}
        left={
          <TextInput.Icon
            style={styles.emoji}
            onPress={pressEmoji}
            name={require("../assets/emoticon-happy.png")}
          />
        }
        right={<TextInput.Icon onPress={send} name="send" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: "#fff",
  },
  emoji: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
