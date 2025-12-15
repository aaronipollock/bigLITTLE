import React from 'react';
import { View, Text, FlatList, Pressable, Image } from 'react-native';
import { Link } from 'expo-router';
import { GalleryPreviewData } from '@/constants/AffirmationCategory';

const GuidedAffirmationsGallery = ({ title, previews }: { title: string; previews: GalleryPreviewData[] }) => {
  return (
    <View className="my-5">
      <View className="mb-2">
        <Text className="text-white font-bold text-xl">{title}</Text>
      </View>
      <View className="space-y-2">
        <FlatList
          data={previews}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Link
                href={{ pathname: "/affirmations", params: { id: item.id.toString() } }}
                asChild
            >
              <Pressable>
                <View className="h-36 w-32 rounded-md mr-4">
                  <Image source={item.image} resizeMode="cover" className="w-full h-full" />
                </View>
              </Pressable>
            </Link>
          )}
          horizontal
        />
      </View>
    </View>
  );
};

export default GuidedAffirmationsGallery;
