import { View, Text, ImageBackground } from 'react-native'
import React from 'react'
import { StatusBar } from "expo-status-bar";
import { useRouter } from 'expo-router';

import beachImage from "@/assets/meditation-images/beach.webp";
import CustomButton from '@/components/CustomButton'
import AppGradient from '@/components/AppGradient';

const Signup = () => {
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
              Sign up
            </Text>
          </View>
          <View>
            <CustomButton
              onPress={() => router.push("/nature-meditate")}
              title='Continue'
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

export default Signup
