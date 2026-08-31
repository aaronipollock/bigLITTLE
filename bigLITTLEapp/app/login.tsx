import { View, Text, ImageBackground, TextInput } from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from "expo-status-bar";
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@/constants/api';

import beachImage from "@/assets/meditation-images/beach.webp";
import CustomButton from '@/components/CustomButton'
import AppGradient from '@/components/AppGradient';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // fetch does not throw on 4xx or 5xx, so check this explicitly.
      if (!response.ok) {
        setError(data.error?.message ?? "Something went wrong");
        return;
      }

      await SecureStore.setItemAsync("token", data.token);
      router.replace("/nature-meditate");
    } catch {
      setError("Could not reach the server.");
    } finally {
      setSubmitting(false);
    }
  };

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
              Log in
            </Text>
          </View>
          <View className='px-5'>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              className='bg-white/90 rounded-xl px-4 min-h-[52px] mb-4 text-lg'
            />

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              className='bg-white/90 rounded-xl px-4 min-h-[52px] mb-4 text-lg'
            />

            <View className='min-h-[28px] mt-4'>
              {error && (
                <Text className='text-red-300 text-center text-base'>
                  {error}
                </Text>
              )}
            </View>
          </View>
          <View>
            <CustomButton
              onPress={handleLogin}
              title={submitting ? 'Logging in...' : 'Continue'}
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

export default Login
