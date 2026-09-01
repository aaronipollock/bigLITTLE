import { View, Text, FlatList, Pressable, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import AppGradient from '@/components/AppGradient';
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@/constants/api';

import { MEDITATION_DATA } from '@/constants/MeditationData';
import MEDITATION_IMAGES from '@/constants/meditation-images';
import { router } from 'expo-router';

const NatureMeditate = () => {

  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadCaregiver = async () => {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        router.replace("/");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          await SecureStore.deleteItemAsync("token");
          router.replace("/");
          return;
        }

        const data = await response.json();
        setEmail(data.caregiver.email);
      } catch {
        // Network failure. Leave the greeting generic rather than
        // signing the user out over a temporary connectivity problem.
      }
    };

    loadCaregiver();
  }, [])

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    router.replace("/");
  }

  return (
    <View className='flex-1'>
      <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
        <View className="mb-6">
          <Pressable onPress={handleLogout} className="self-end mb-2">
            <Text className="text-indigo-100 text-base font-medium">Log out</Text>
          </Pressable>
          <Text className="text-gray-200 mb-3 font-bold text-4xl text-left">
            Welcome {email ?? "back"}
          </Text>
          <Text className="text-indigo-100 text-xl font-medium">
            Start your meditation practice today
          </Text>
        </View>
        <View>
          <FlatList
            data={MEDITATION_DATA}
            className="mb-20"
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push(`/meditate/${item.id}`)}
                className="h-48 my-3 rounded-md overflow-hidden"
              >
                <ImageBackground
                  source={MEDITATION_IMAGES[item.id - 1]}
                  resizeMode="cover"
                  className="flex-1 rounded-lg justify-center"
                >
                  <LinearGradient
                    colors={[
                      "transparent",
                      "rgba(0, 0, 0, 0.8)",
                    ]}
                    className="flex-1 justify-center items-center"
                  >
                  </LinearGradient>

                  <Text className="text-gray-100 text-3xl font-bold text-center">
                    {item.title}
                  </Text>
                </ImageBackground>
              </Pressable>
            )}
          />
        </View>
      </AppGradient>

      <StatusBar style="light" />
    </View>
  )
}

export default NatureMeditate
