import {
  Alert,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { colors } from '@/styles/colors'
import { useEffect, useState } from 'react'
import { QRCode } from './QRCode'
import React from 'react'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { db } from '@/server/apiFirebase'
import { MotiView } from 'moti'

type Participant = {
  nome: string
  email: string
}

type Props = {
  image?: string
  nomeEvent: string
  id: string
  email?: string // Adiciona o campo de e-mail
  onChangeAvatar?: () => void
  onShowQRCode?: () => void
}

export function Credential({
  onChangeAvatar,
  image,
  onShowQRCode,
  id,
  email, // Email do usuário autenticado
}: Props) {
  const [nomeEvent, setNomeEvent] = useState<string | undefined>(undefined)
  const [eventData, setEventData] = useState<{
    nomeEvent: string
    id: string
  } | null>(null)
  const [authenticatedParticipant, setAuthenticatedParticipant] =
    useState<Participant | null>(null)

  useEffect(() => {
    async function fetchEventData() {
      try {
        if (!nomeEvent) {
          const eventQuery = query(collection(db, 'eventos'), limit(1))

          const eventSnapshot = await getDocs(eventQuery)

          if (!eventSnapshot.empty) {
            const eventDoc = eventSnapshot.docs[0]
            const eventId = eventDoc.id
            const eventNome = eventDoc.data().nomeEvent

            setNomeEvent(eventNome)

            setEventData({
              nomeEvent: eventNome || 'Nome do evento não disponível',
              id: eventId,
            })

            fetchAuthenticatedParticipant(eventId)
          } else {
            Alert.alert('Erro', 'Nenhum evento encontrado!')
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      }
    }

    async function fetchAuthenticatedParticipant(eventId: string) {
      try {
        const participantsQuery = query(
          collection(db, 'participantes'),
          where('eventId', '==', eventId),
          where('email', '==', email) // Filtra pelo email autenticado
        )

        const participantsSnapshot = await getDocs(participantsQuery)
        if (!participantsSnapshot.empty) {
          const participantDoc = participantsSnapshot.docs[0]
          const data = participantDoc.data()
          setAuthenticatedParticipant({
            nome: data.nome || 'Nome não disponível',
            email: data.email || 'Email não disponível',
          })
        } else {
          console.warn('Participante não encontrado para o email autenticado.')
        }
      } catch (error) {
        console.error('Erro ao buscar participante autenticado:', error)
      }
    }
    fetchEventData()
  }, [nomeEvent, email])

  const { height } = useWindowDimensions()

  return (
    <MotiView
      className="w-full self-stretch items-center"
      from={{
        opacity: 1,
        translateY: -height,
        rotateZ: '50deg',
        rotateY: '30deg',
        rotateX: '30deg',
      }}
      animate={{
        opacity: 1,
        translateY: 0,
        rotateZ: '0deg',
        rotateY: '0deg',
        rotateX: '0deg',
      }}
      transition={{
        type: 'spring',
        damping: 20,
        rotateZ: {
          damping: 15,
          mass: 3,
        },
      }}
    >
      <Image
        source={require('@/assets/ticket/band.png')}
        className="w-24 h-52 z-10"
      />

      <View
        className="bg-black/20 self-stretch items-center pb-6 border border-white/10 mx-3 rounded-2xl
        -mt-5"
      >
        <ImageBackground
          source={require('@/assets/ticket/header.png')}
          className="px-6 py-8 h-40 items-center self-stretch border-b border-white/10 overflow-hidden"
        >
          {eventData ? (
            <View className="w-full flex-row items-center justify-between">
              <Text className="text-zinc-50 text-sm font-bold mb-6">
                {eventData?.nomeEvent}
              </Text>
              <Text className="text-zinc-50 text-sm font-bold mb-6">
                {eventData?.id}
              </Text>
            </View>
          ) : (
            <View className="w-full flex-row items-center justify-between">
              <Text className="text-zinc-50 text-sm font-bold mb-6">
                carregando...
              </Text>
              <Text className="text-zinc-50 text-sm font-bold mb-6">
                carregando...
              </Text>
            </View>
          )}
          <View className="w-40 h-40 bg-black/70 rounded-full" />
        </ImageBackground>

        {image ? (
          <TouchableOpacity activeOpacity={0.7} onPress={onChangeAvatar}>
            <Image
              source={{ uri: image }}
              className="w-40 h-40 rounded-full -mt-24"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              width: 130,
              height: 130,
              borderRadius: 9999,
              marginTop: -96,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.gray[300],
            }}
            onPress={onChangeAvatar}
          >
            <Feather name="camera" color={colors.orange[500]} size={32} />
          </TouchableOpacity>
        )}

        {authenticatedParticipant ? (
          <View className="items-center">
            <Text className="font-bold text-2xl text-zinc-50 mt-4">
              {authenticatedParticipant.nome}
            </Text>
            <Text className="font-regular text-base text-zinc-300 mb-4">
              {authenticatedParticipant.email}
            </Text>
          </View>
        ) : (
          <Text className="font-regular text-base text-zinc-300 mt-4 mb-4">
            Carregando informações do participante...
          </Text>
        )}

        <QRCode value="teste" size={120} />

        <TouchableOpacity activeOpacity={0.7} onPress={onShowQRCode}>
          <Text className="font-body text-orange-500 text-sm mt-6">
            Ampliar QRcode
          </Text>
        </TouchableOpacity>
      </View>
    </MotiView>
  )
}
