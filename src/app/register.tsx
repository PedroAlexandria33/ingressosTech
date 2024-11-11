import { View, Image, StatusBar, Alert, TouchableOpacity } from 'react-native'
import { Input } from '@/components/input'
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { db } from '@/server/apiFirebase'
import { colors } from '@/styles/colors'
import { Button } from '@/components/button'
import { Link, router } from 'expo-router'
import { useEffect, useState } from 'react'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore'
import { Picker } from '@react-native-picker/picker'
import React from 'react'
import { vincularUsuarioEvento } from '@/components/vincUsuarioEvent'

type Evento = {
  id: string
  nomeEvent: string
}

export default function Register() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [eventos, setEventos] = useState<Evento[]>([])
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const eventSnapshot = await getDocs(collection(db, 'eventos'))
        const fetchedEventos: Evento[] = eventSnapshot.docs.map(doc => ({
          id: doc.id,
          nomeEvent: doc.data().nomeEvent,
        }))
        setEventos(fetchedEventos)
      } catch (error) {
        console.error('Erro ao buscar eventos:', error)
        Alert.alert('Erro', 'Não foi possível carregar os eventos.')
      }
    }

    fetchEventos()
  }, [])

  async function handleAccesCredential() {
    const auth = getAuth()

    if (!email.trim() || !senha.trim() || !nome.trim()) {
      return Alert.alert('Ingresso', 'Informe as credenciais')
    }

    if (!selectedEvent) {
      return Alert.alert('Ingresso', 'Selecione um evento')
    }

    setLoading(true)

    try {
      // Cria o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      )
      const user = userCredential.user

      // Salva os dados do usuário no Firestore
      await setDoc(
        doc(db, `participantes/${user.uid}`),
        { nome, email },
        { merge: true }
      )

      // Vincula o usuário ao evento selecionado
      if (selectedEvent) {
        await vincularUsuarioEvento(user.uid, selectedEvent)
      }

      Alert.alert('Cadastro!', 'Dados do usuário salvos com sucesso!', [
        { text: 'Ok', onPress: () => router.push('/') },
      ])
    } catch (error) {
      console.error('Erro ao criar o usuário:', error)
      Alert.alert('Erro', 'Não foi possível concluir o cadastro.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 bg-green-500 items-center justify-center p-8">
      <StatusBar barStyle="light-content" />
      <Image
        source={require('@/assets/logo.png')}
        className="h-64"
        resizeMode="contain"
      />

      <View className="w-full mt--12 gap-3">
        <TouchableOpacity activeOpacity={0.8} className="w-full">
          <View className="w-full h-14 flex-row items-center  gap-3 p-3 border border-green-400 rounded-lg">
            <FontAwesome6 name="calendar" size={20} color={colors.green[200]} />
            <Picker
              selectedValue={selectedEvent}
              onValueChange={itemValue => setSelectedEvent(itemValue as string)}
              style={{
                flex: 1,
                color: colors.white,
                marginLeft: 10,
              }}
              mode="dialog" // Tente também "dialog" caso "dropdown" não funcione bem
            >
              <Picker.Item label="Selecione um evento" value="" />
              {eventos.map(evento => (
                <Picker.Item
                  key={evento.id}
                  label={evento.nomeEvent}
                  value={evento.id}
                />
              ))}
            </Picker>
          </View>
        </TouchableOpacity>

        <Input>
          <FontAwesome6
            name="user-circle"
            size={20}
            color={colors.green[200]}
          />
          <Input.Field placeholder="Nome Completo" onChangeText={setNome} />
        </Input>

        <Input>
          <MaterialIcons
            name="alternate-email"
            size={20}
            color={colors.green[200]}
          />
          <Input.Field
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
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
          title="Realizar cadastro"
          onPress={handleAccesCredential}
          isLoading={isLoading}
        />

        <Link
          href="/"
          className="text-gray-100 text-base font-bold text-center mt-8"
        >
          Já possui ingresso?
        </Link>
      </View>
    </View>
  )
}
