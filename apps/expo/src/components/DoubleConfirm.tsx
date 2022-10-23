import React from 'react'
import { View } from 'react-native'
import Animated, { RollInRight, RollOutRight } from 'react-native-reanimated'
import { ClassInput } from 'twrnc/dist/esm/types'
import tw from '../tailwind'
import ButtonContainer from './ButtonContainer'

type Props = {
  style?: ClassInput
  first: JSX.Element
  second: JSX.Element
  accessibilityLabel: string
}

export default function DoubleConfirm({ style, first, second, accessibilityLabel }: Props) {
  const [toggle, setToggle] = React.useState(false)

  return (
    <View style={tw.style('relative', style)}>
      <ButtonContainer
        onPress={() => {
          setToggle(!toggle)
        }}
        accessibilityLabel={`${toggle ? 'Conceal' : 'Reveal'} button to ${accessibilityLabel}`}
      >
        {first}
      </ButtonContainer>
      {toggle && (
        <Animated.View
          entering={RollInRight.springify().stiffness(50).damping(6).mass(0.3)}
          exiting={RollOutRight.springify().stiffness(50).damping(6).mass(0.3)}
          style={[tw.style('absolute items-center justify-center h-full right-0')]}
          accessible
          accessibilityLabel={`${accessibilityLabel}`}
          accessibilityRole="button"
        >
          {second}
        </Animated.View>
      )}
    </View>
  )
}

DoubleConfirm.defaultProps = {
  style: undefined
}
