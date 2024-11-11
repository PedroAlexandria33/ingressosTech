import { View, Image, StatusBar, Alert } from 'react-native'
import { Input } from '@/components/input'
import { MaterialIcons } from '@expo/vector-icons'
import { colors } from '@/styles/colors'
import { Button } from '@/components/button'
import { Link, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigation, type NavigationProp } from '@react-navigation/native'
import type { RootStackParamList } from '@/types/appNavigatorTypes'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Home() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [isLoading, setLoading] = useState(false)
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()

  async function handleAccessCredential() {
    if (!email.trim() || !senha.trim()) {
      return Alert.alert('Ingresso', 'Informe as credenciais')
    }
    setLoading(true)
    const auth = getAuth()

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        senha
      )
      const user = userCredential.user

      if (user) {
        await AsyncStorage.setItem(
          '@user_session',
          JSON.stringify({ email: user.email })
        )
        navigation.navigate('ticket', { email: user.email })
      }
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      Alert.alert('Erro de autenticação', 'Usuário não encontrado')
    } finally {
      setLoading(false)
    }
  }
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    async function checkUserSession() {
      const userSession = await AsyncStorage.getItem('@user_session')
      if (userSession) {
        const { email } = JSON.parse(userSession)
        navigation.navigate('ticket', { email })
      }
    }

    checkUserSession()
  }, [])

  return (
    <View className="flex-1 bg-green-500 items-center justify-center p-8">
      <StatusBar barStyle="light-content" />
      <Image
        source={require('@/assets/logo.png')}
        className="h-64"
        resizeMode="contain"
      />

      <View className="w-full mt--12 gap-3">
        <Input>
          <MaterialIcons
            name="alternate-email"
            size={20}
            color={colors.green[200]}
          />
          <Input.Field
            placeholder="E-mail"
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
          />
        </Input>

        <Input>
          <MaterialIcons name="password" size={20} color={colors.green[200]} />
          <Input.Field
            placeholder="senha"
            secureTextEntry
            autoCapitalize="none"
            keyboardType="default"
            onChangeText={setSenha}
          />
        </Input>
        <Button
          title="Acessar credencial"
          onPress={handleAccessCredential}
          isLoading={isLoading}
        />

        <Link
          href="/register"
          className="text-gray-100 text-base font-bold text-center mt-8"
        >
          Ainda não possui ingresso?
        </Link>
      </View>
    </View>
  )
}
