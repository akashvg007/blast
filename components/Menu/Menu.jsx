import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import MyList from "../List/List";

export default function MenuWrapper({ show }) {
  const handleDeleteAll = () => {};
  const dummy = () => {};
  const listArr = [
    { title: "One tap Delete", icon: "trash", click: handleDeleteAll },
    { title: "Block this person", icon: "ban", click: handleDeleteAll },
    { title: "Clear Chat History", icon: "eraser", click: handleDeleteAll },
    { title: "Custom Background", icon: "palette", click: dummy },
    { title: "Send Gift", icon: "gift", click: handleDeleteAll },
    { title: "Start Date", icon: "heart", click: handleDeleteAll },
    { title: "Date History", icon: "history", click: handleDeleteAll },
  ];
  return (
    <View style={styles.container}>
      <ScrollView>
        {listArr.map((prop) => (
          <MyList {...prop} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    height: "100%",
    width: "100%",
  },
});
