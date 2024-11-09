import React from 'react'
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from 'react-native'

type Props = TouchableOpacityProps & {
  title: string
  isLoading?: boolean
}

export function Button({ title, isLoading = false, ...rest }: Props) {
  return (
    <TouchableOpacity disabled={isLoading} activeOpacity={0.7} {...rest}>
      {isLoading ? (
        <ActivityIndicator className="w-full h-14 bg-orange-500 items-center justify-center rounded-lg text-green-500" />
      ) : (
        <Text className="w-full h-14 bg-orange-500 items-center justify-center rounded-lg text-center p-4 font-bold uppercase">
          {title}
        </Text>
      )}
    </TouchableOpacity>
  )
}
