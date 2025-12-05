import { View, Text, ImageBackground, StyleSheet } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from "expo-status-bar";

import beachImage from "@/assets/meditation-images/beach.webp";
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton'

const App = () => {
  return (
    <View className='flex-1'>
      <ImageBackground
        source={beachImage}
        resizeMode="cover"
        className="flex-1"
      >
        <LinearGradient
          style={styles.gradient}
          colors={["rgba(0, 0, 0, 0.4)", "rgba(0, 0, 0, 0.8)"]}
        >
          <SafeAreaView className="flex-1 mx-5 my-12 justify-between">
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
                onPress={() => console.log('tap')}
                title='Get Started'
              />
            </View>

            <StatusBar style="light" />
          </SafeAreaView>
        </LinearGradient>
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
