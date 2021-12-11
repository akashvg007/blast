import * as React from "react";
import { List } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors } from "../../util/colors";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { spaces } from "../../util/spaces";

const MyList = ({ title, icon, click }) => (
  <TouchableOpacity onPress={click}>
    <View style={styles.container}>
      <List.Item
        title={title}
        // description="Item description"
        left={(props) => (
          <List.Icon
            {...props}
            icon={() => (
              <FontAwesome5 name={icon} size={spaces.md} color={colors.black} />
            )}
          />
        )}
      />
    </View>
  </TouchableOpacity>
);
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginTop: 10,
  },
});

export default MyList;
