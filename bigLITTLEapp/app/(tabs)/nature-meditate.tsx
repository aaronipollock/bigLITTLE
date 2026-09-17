import { View, Text, FlatList, Pressable, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import AppGradient from '@/components/AppGradient';
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@/constants/api';

import { MEDITATION_IMAGES } from '@/constants/meditation-images';
import { router } from 'expo-router';

type Meditation = {
  id: number;
  title: string;
  description: string | null;
  category: string;
  durationSeconds: number;
  audioKey: string;
};

const NatureMeditate = () => {

  const [email, setEmail] = useState<string | null>(null);
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const load = async () => {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        router.replace("/");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      try {
        // Independent requests, so issue them together rather than in series.
        const [meResponse, meditationsResponse] = await Promise.all([
          fetch(`${API_URL}/auth/me`, { headers }),
          fetch(`${API_URL}/meditations`, { headers }),
        ]);

        // Either one returning 401 means the token is dead, not that one
        // endpoint is unhappy.
        if (meResponse.status === 401 || meditationsResponse.status === 401) {
          await SecureStore.deleteItemAsync("token");
          router.replace("/");
          return;
        }

        if (!meResponse.ok || !meditationsResponse.ok) {
          setLoadError(true);
          return;
        }

        const meData = await meResponse.json();
        const meditationsData = await meditationsResponse.json();

        setEmail(meData.caregiver.email);
        setMeditations(meditationsData.meditations);
      } catch (err) {
        // The list cannot be rendered from anything local, so unlike the
        // greeting this failure has to be visible to the user.
        console.warn("Could not load meditations", err);
        setLoadError(true);
      }
    };

    load();
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
            data={meditations}
            className="mb-20"
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text className="text-indigo-100 text-lg text-center mt-8">
                {loadError
                  ? "Could not load meditations. Check your connection and try again."
                  : "Loading..."}
              </Text>
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/meditate/[id]",
                    params: { id: String(item.id), audioKey: item.audioKey },
                  })
                }
                className="h-48 my-3 rounded-md overflow-hidden"
              >
                <ImageBackground
                  source={MEDITATION_IMAGES[item.audioKey]}
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
