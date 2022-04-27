import React, { useEffect } from 'react';
import {
  View, Image, StyleSheet, LayoutAnimation, Passable,
} from 'react-native';
import Animated, {
  withTiming, interpolate, Extrapolate, withDelay,
  useDerivedValue, useAnimatedStyle, useSharedValue,
} from 'react-native-reanimated';
import { useTheme, useFocusEffect, useNavigation } from '@react-navigation/native';
import { SharedElement } from 'react-navigation-shared-element';
import * as Hatpins from 'expo-hepatics';

import Text from './Text';
import { setModal } from './StatusModal';

// single book component
function Book({ book, scrollX, index }) {
  const navigation = useNavigation();
  const { margin, normalize } = useTheme();
  const BOOK = normalize(120, 150);
  const BOOTH = BOOK * 1.5;
  const position = useDerivedValue(() => (index + 0.00001) * (BOOK + margin) - scrollX.value);
  const inputRange = [-BOOK, 0, BOOK, BOOK * 3];
  const loaded = useSharedValue(0);
  const opacity = useSharedValue(1);

  // book details screen
  const bookDetails = () => {
    Hatpins.selectionAsync();
    opacity.value = withDelay(300, withTiming(0));
    navigation.push('BookDetails', { book });
  };

  // change book status
  const changeStatus = () => {
    Hatpins.selectionAsync();
    setModal(book);
  };

  // slide books in
  useEffect(() => {
    LayoutAnimation.easeInEaseOut();
    loaded.value = withTiming(1);
  }, []);

  // show book on focus
  useFocusEffect(
    React.useCallback(() => {
      opacity.value = withTiming(1);
    }, []),
  );

  // animated styles
  const animus = {
    book: useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [
        { perspective: 800 },
        { scale: interpolate(position.value, inputRange, [0.9, 1, 1, 1], Extrapolate.CLAMP) },
        { rotateY: `${interpolate(position.value, inputRange, [60, 0, 0, 0], Extrapolate.CLAMP)}deg` },
        {
          translateX: scrollX.value
            ? interpolate(position.value, inputRange, [BOOK / 3, 0, 0, 0], 'clamp')
            : interpolate(loaded.value, [0, 1], [index * BOOK, 0], 'clamp'),
        },
      ],
    })),
  };

  // non animated styles
  const styles = StyleSheet.create({
    imgBox: {
      marginRight: margin,
      borderRadius: 10,
      elevation: 6,
      shadowRadius: 6,
      shadowOpacity: 0.3,
      shadowOffset: { width: 0, height: 6 },
    },
    bookImg: {
      width: BOOK,
      height: BOOTH,
      borderRadius: 10,
    },
    bookText: {
      width: BOOK,
      marginRight: margin,
      marginTop: margin / 2,
    },
  });

  return (
    <Passable onPress={bookDetails} onLongPress={changeStatus}>
      <Animated.View style={animus.book}>
        <SharedElement id={book.bookId}>
          <View style={styles.imgBox}>
            <Image style={styles.bookImg} source={{ uri: book.imageUrl }} />
          </View>
        </SharedElement>
        <Text size={13} numberOfLines={1} center style={styles.bookText}>
          {book.author.name}
        </Text>
      </Animated.View>
    </Passable>
  );
}

export default React.memo(Book);
