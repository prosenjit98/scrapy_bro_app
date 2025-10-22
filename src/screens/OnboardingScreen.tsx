import React from 'react'
import { Image, View, Text, StyleSheet } from 'react-native'
import { useAuthStore } from '@/stores/authStore'
import Onboarding from 'react-native-onboarding-swiper'
import FastImage from 'react-native-fast-image'
import { AppTheme } from '@/theme'
import { SCREEN_WIDTH } from '@/constants'
import { useThemeStore } from '@/stores/themeStore'


const OnboardingScreen = () => {
  const { checkFirstLaunch } = useAuthStore()
  const theme = useThemeStore().theme;
  const { colors } = theme;
  console.log('theme', colors)
  console.log(colors.yellowBackground)
  // @ts-ignore
  const styles = makeStyles(colors);

  const handleDone = async () => {
    await checkFirstLaunch() // mark onboarding as completed
  }

  return (
    <Onboarding
      onDone={handleDone}
      onSkip={handleDone}
      containerStyles={styles.container}
      pages={[
        {
          backgroundColor: '#FFEE5D',
          image: <FastImage source={require('@/assets/images/onboarding_first.gif')} 
            style={styles.image} 
            resizeMode={FastImage.resizeMode.contain}
          />,
          title: 'Welcome to Scrapy',
          subtitle: 'Buy and sell quality vehicle parts from scrapped vehicles — saving money and reducing waste.',
        },
        {
          backgroundColor: '#FFEE5D',
          image: <Image source={require('@/assets/images/software_tester.gif')} style={styles.image} resizeMode={FastImage.resizeMode.contain}/>,
          title: 'Find Parts Easily',
          subtitle: 'Search, filter, and connect with verified sellers for the exact parts you need.',
        },
        {
          backgroundColor: '#FFEE5D',
          image: <FastImage source={require('@/assets/images/Onboarding_last.gif')} style={styles.image} resizeMode={FastImage.resizeMode.contain}/>,
          title: 'Join the Community',
          subtitle: 'Start trading today and be part of the eco-friendly automotive marketplace!',
        },
      ]}
      titleStyles={styles.title}
      subTitleStyles={styles.subtitle}
      imageContainerStyles={styles.imageContainer}
      showSkip={true}
      skipLabel="Skip"
      nextLabel="Next"
    />
  )
}

const makeStyles = (_colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: _colors.yellowBackground
    },
    imageContainer: {
      paddingBottom: 20,
    },
    image: {
      width: SCREEN_WIDTH * 0.9,
      height: SCREEN_WIDTH * 0.9,
      resizeMode: 'contain',
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: '#333',
      textAlign: 'center',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      paddingHorizontal: 30,
      lineHeight: 22,
    },
  })

export default OnboardingScreen

