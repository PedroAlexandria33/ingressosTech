import Home from '@/app'
import Ticket from '@/app/ticket'
import { createStackNavigator } from '@react-navigation/stack'
import type { RootStackParamList } from '@/types/appNavigatorTypes'
import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

const Stack = createStackNavigator<RootStackParamList>()

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="index" component={Home} />
        <Stack.Screen name="ticket" component={Ticket} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
