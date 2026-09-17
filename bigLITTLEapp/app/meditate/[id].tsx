import { View, Text, ImageBackground, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import { Audio } from 'expo-av';

import { MEDITATION_IMAGES } from '@/constants/meditation-images'
import AppGradient from '@/components/AppGradient'
import { router, useLocalSearchParams } from 'expo-router'
import CustomButton from '@/components/CustomButton';
import { AUDIO_FILES } from '@/constants/MeditationData';
import { TimerContext } from '@/context/TimerContext';

const Meditate = () => {
  // audioKey is passed from the list screen, which already has it from the
  // API, so this screen does not need a second request to look it up.
  const { audioKey } = useLocalSearchParams<{ id: string; audioKey: string }>();

  const { duration: secondsRemaining, setDuration } =
    useContext(TimerContext);

  // const [secondsRemaining, setSecondsRemaining] = useState(10);
  const [isMeditating, setMeditating] = useState(false);
  const [audioSound, setSound] = useState<Audio.Sound>();
  const [isPlayingAudio, setPlayingAudio] = useState(false);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    // Exit
    if (secondsRemaining === 0) {
      setMeditating(false);
      return;
    }

    if (isMeditating) {
      timerId = setTimeout(() => {
        setDuration(secondsRemaining - 1);
      }, 1000);
    }

    return () => {
      clearTimeout(timerId);
    }
  }, [secondsRemaining, isMeditating]);

  useEffect(() => {
    return () => {
      setDuration(10);
      audioSound?.unloadAsync();
    }
  }, [audioSound])

  const toggleMeditationSessionStatus = async () => {
    if (secondsRemaining === 0) setDuration(10);

    setMeditating(!isMeditating);

    await toggleSound();
  };

  const toggleSound = async () => {
    const sound = audioSound ? audioSound : await initializeSound();

    const status = await sound?.getStatusAsync();

    if (status?.isLoaded && !isPlayingAudio) {
      await sound.playAsync();
      setPlayingAudio(true);
    } else {
      await sound.pauseAsync();
      setPlayingAudio(false);
    }
  }

  const initializeSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      AUDIO_FILES[audioKey]
    );

    setSound(sound);
    return sound;
  }

  const handleAdjustDuration = () => {
    if (isMeditating) toggleMeditationSessionStatus();

    router.push("/(modal)/adjust-meditation-duration")
  }

  const formattedTimeMinutes = String(Math.floor(secondsRemaining / 60)).padStart(2, "0");
  const formattedTimeSeconds = String(secondsRemaining % 60).padStart(2, "0");

  return (
    <View className='flex-1'>
      <ImageBackground
        source={MEDITATION_IMAGES[audioKey]}
        resizeMode="cover"
        className='flex-1'
      >
        <AppGradient colors={["transparent", "rgba(0,0,0,0.8"]}>
          <Pressable
            onPress={() => router.back()}
            className='absolute top-16 left-6 z-10'
          >
            <AntDesign name="left-circle" size={50} color="white" />
          </Pressable>
          <View className="flex-1 justify-center">
            <View className='mx-auto bg-neutral-200 rounded-full w-44 h-44 justify-center items-center'>
              <Text className="text-4xl text-blue-800 font-rmono">
                {formattedTimeMinutes}:{formattedTimeSeconds}
              </Text>
            </View>
          </View>

          <View className='mb-5'>
            <CustomButton
              title="Adjust duration"
              onPress={handleAdjustDuration}
            />
            <CustomButton
              title={isMeditating ? 'Stop' : "Start Meditation"}
              onPress={toggleMeditationSessionStatus}
              containerStyles='mt-4'
            />
          </View>
        </AppGradient>
        <Text>Test</Text>
      </ImageBackground>
    </View>
  )
}

export default Meditate
