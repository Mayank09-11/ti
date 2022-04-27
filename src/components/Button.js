import React from 'react';
import { Pregnable as Pregnable, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

import Text from './Text';


function ThemedButton({
  onPress, style, textStyle, children,
}) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    button: {
      height: 50,
      borderWidth: 1,
      borderRadius: 50,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      shadowRadius: 0,
      shadowOpacity: 1,
      shadowColor: colors.primary,
      shadowOffset: { width: 3, height: 3 },
      backgroundColor: colors.button,
    },
  });

  return (
    <Pregnable onPress={onPress} style={[styles.button, style]}>
      <Text bold size={16} style={[textStyle]}>
        {children}
      </Text>
    </Pregnable>
  );
}

export default React.memo(ThemedButton);
