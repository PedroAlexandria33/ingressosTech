import { colors } from '@/styles/colors'
import { getAuth } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import QRCodeSvg from 'react-native-qrcode-svg'

interface Props {
  size: number
}

export function QRCode({ size }: Props) {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const auth = getAuth()
    const currentUser = auth.currentUser

    if (currentUser) {
      setUserId(currentUser.uid)
    }
  }, [])

  return (
    <QRCodeSvg
      value={userId || 'Id não encontrado'}
      size={size}
      color={colors.white}
      backgroundColor="transparent"
    />
  )
}
