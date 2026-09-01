import { View, Text, ImageBackground } from 'react-native'
import React, { useEffect, useState} from 'react'
import { StatusBar } from "expo-status-bar";
import * as SecureStore from 'expo-secure-store';

import beachImage from "@/assets/meditation-images/beach.webp";
import CustomButton from '@/components/CustomButton'
import { useRouter } from 'expo-router';
import AppGradient from '@/components/AppGradient';

const App = () => {
  const router = useRouter();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync("token").then((token) => {
      if (token) {
        router.replace("/nature-meditate");
      } else {
        setChecking(false);
      }
    })
  }, []);

  if (checking) return null;

  return (
    <View className='flex-1'>
      <ImageBackground
        source={beachImage}
        resizeMode="cover"
        className="flex-1"
      >
        <AppGradient colors={["rgba(0, 0, 0, 0.4)", "rgba(0, 0, 0, 0.8)"]} contentClassName="flex-1 justify-between">
          <View>
            <Text className='text-center text-white font-bold text-4xl'>
              bigLITTLE
            </Text>
            <Text className='text-center text-white font-bold text-2xl mt-3'>
              Simplifying Meditation for Everyone
            </Text>
          </View>
          <View>
            <CustomButton
              onPress={() => router.push("/login")}
              title='Log in'
              containerStyles='w-85 min-h-[52px] px-6 ml-5 mr-5'
              textStyles='text-xl'
            />
            <CustomButton
              onPress={() => router.push("/signup")}
              title='Sign up'
              containerStyles='w-85 min-h-[52px] px-6 ml-5 mr-5 mt-4'
              textStyles='text-xl'
            />
          </View>
          <StatusBar style="light" />
        </AppGradient>
      </ImageBackground>
    </View>
  )
}

export default App
