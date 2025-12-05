import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import Content from "./Content";

const AppGradient = ({ children, colors, contentClassName }: { children: React.ReactNode; colors: readonly [string, string, ...string[]]; contentClassName?: string }) => {
  return (
    <LinearGradient colors={colors} style={styles.gradient}>
      <Content className={contentClassName}>{children}</Content>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
})

export default AppGradient
