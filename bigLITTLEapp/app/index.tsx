import { View, Text, ImageBackground, StyleSheet } from 'react-native'
import React from 'react'
import { StatusBar } from "expo-status-bar";

import beachImage from "@/assets/meditation-images/beach.webp";
import CustomButton from '@/components/CustomButton'
import { useRouter } from 'expo-router';
import AppGradient from '@/components/AppGradient';

const App = () => {
  const router = useRouter();

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
              onPress={() => router.push("/nature-meditate")}
              title='Get Started'
              containerStyles='w-85 min-h-[52px] px-6 ml-5 mr-5'
              textStyles='text-xl'
            />
          </View>
          <StatusBar style="light" />
        </AppGradient>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
})

export default App
