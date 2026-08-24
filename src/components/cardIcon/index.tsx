// src/components/cardIcon/index.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from './styles';

interface CardIconProps {
  title: string;
  imageSource: any;
  onPress?: () => void;
  description?: string;
}

export default function CardIcon({ 
  title, 
  imageSource, 
  onPress, 
  description 
}: CardIconProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.card}>
        <Image source={imageSource} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}