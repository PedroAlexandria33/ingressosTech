import { colors } from '@/styles/colors'
import React from 'react'
import QRCodeSvg from 'react-native-qrcode-svg'

type Props = {
  value: string
  size: number
}

export function QRCode({ value, size }: Props) {
  return (
    <QRCodeSvg
      value="https://github.com/PedroAlexandria33"
      size={size}
      color={colors.white}
      backgroundColor="transparent"
    />
  )
}
