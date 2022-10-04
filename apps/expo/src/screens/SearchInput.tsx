import React from "react";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";

type Props = {
  onChange: (text?: string) => void;
};

export default function SearchInput({ onChange }: Props) {
  const [searchText, setSearchText] = React.useState<string>();
  const [showCancelButton, setShowCancelButton] = React.useState(false);

  return (
    <View className="flex-row justify-between">
      <View>
        <TextInput
          onChangeText={(text) => {
            setShowCancelButton(text?.length > 0);
            onChange(text);
            setSearchText(text);
          }}
          value={searchText || ""}
          placeholder="Search..."
        />
      </View>
      {showCancelButton && (
        <View>
          <Pressable
            onPress={() => {
              onChange(undefined);
              setSearchText(undefined);
              setShowCancelButton(false);
              Keyboard.dismiss();
            }}
            accessibilityLabel="Clear exercise filter"
          >
            <Text>Cancel</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
