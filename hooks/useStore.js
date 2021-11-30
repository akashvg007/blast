import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "Blast-";
export default function useStore(key, initialValue) {
  const prefixedKey = PREFIX + key;
  const [value, setValue] = useState(async () => {
    const jsonValue = await AsyncStorage.getItem(prefixedKey);
    if (jsonValue && jsonValue != null) return JSON.parse(jsonValue);
    if (typeof initialValue === "function") {
      return initialValue();
    } else return initialValue;
  });
  useEffect(() => {
    AsyncStorage.setItem(prefixedKey, JSON.stringify(value));
  }, [prefixedKey, value]);
  return [value, setValue];
}
