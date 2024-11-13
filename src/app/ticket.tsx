import { FontAwesome } from '@expo/vector-icons'
import { Credential } from '@/components/credential'
import { Header } from '@/components/header'
import { colors } from '@/styles/colors'
import {
  StatusBar,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Share,
} from 'react-native'
import { Button } from '@/components/button'
import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { QRCode } from '@/components/QRCode'
import React from 'react'
import {
  type RouteProp,
  useRoute,
  useNavigation,
} from '@react-navigation/native'
import { router } from 'expo-router'
import { MotiView } from 'moti'
import AsyncStorage from '@react-native-async-storage/async-storage'

type TicketRouteProp = RouteProp<{ Ticket: { email: string } }, 'Ticket'>

export default function Ticket() {
  const [image, setImage] = useState('')
  const [showQRCode, setShowQRCode] = useState(false)
  const navigation = useNavigation
  // Captura o e-mail do usuário da navegação
  const route = useRoute<TicketRouteProp>()
  const userEmail = route.params?.email

  async function handleRemoveTicket() {
    await AsyncStorage.removeItem('@user_session')
    router.push('/')
  }

  async function handleShare() {
    try {
      const result = await Share.share({
        message: 'Aqui estão os detalhes do seu ingresso!',
        url: 'https://www.vozaotickets.com/', // Substitua com um link real, se houver.
        title: 'Compartilhar ingresso',
      })
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar o ingresso.')
      console.error('Erro ao compartilhar:', error)
    }
  }

  async function handleSelectImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
      })

      if (result.assets) {
        setImage(result.assets[0].uri)
      }
    } catch (error) {
      console.log(error)
      Alert.alert('Foto', 'Não foi possível selecionar a imagem.')
    }
  }

  return (
    <View className="flex-1 bg-green-500">
      <StatusBar barStyle="light-content" />
      <Header title="minha credencial" />
      <ScrollView
        className="-mt-28 -z-10"
        contentContainerClassName="px-8 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <Credential
          image={image}
          onChangeAvatar={handleSelectImage}
          onShowQRCode={() => setShowQRCode(true)}
          nomeEvent=""
          id=""
          email={userEmail}
        />
        <MotiView
          from={{
            translateY: 0,
          }}
          animate={{
            translateY: 10,
          }}
          transition={{
            loop: true,
            type: 'timing',
            duration: 500,
          }}
        >
          <FontAwesome
            name="angle-double-down"
            size={24}
            color={colors.gray[300]}
            className="self-center my-3"
          />
        </MotiView>

        <Text className="text-white font-bold text-2xl mt-4">
          Compartilhar Credencial
        </Text>
        <Text className="text-white font-regular text-base mt-1 mb-6">
          Compartilhe para todos os seus amigos
        </Text>
        <Button onPress={handleShare} title="Compartilhar" />
        <TouchableOpacity onPress={handleRemoveTicket}>
          <Text className="text-base text-white font-bold text-center mt-3">
            Remover Ingresso
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showQRCode} statusBarTranslucent animationType="slide">
        <View className="flex-1 bg-green-500 items-center justify-center ">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowQRCode(false)}
          >
            <QRCode size={300} />
            <Text className="text-base text-orange-500 font-bold text-center mt-10">
              Fechar
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}
