import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Content = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <SafeAreaView className={className || 'flex-1 px-5 py-3'}>{children}</SafeAreaView>
  )
}

export default Content
