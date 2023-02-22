import React, { useContext, useRef, useState } from 'react'
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  Linking,
  ImageBackground,
  BackHandler,
  Alert,
  TouchableOpacity,
  Keyboard,
  View,
  Platform,
  KeyboardAvoidingView,
  Appearance
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import StudentVue from 'studentvue'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../types/RootStackParams'
import { useNavigation } from '@react-navigation/native'
import CustomButton from '../components/CustomButton'
import AppContext from '../contexts/AppContext'
import { convertGradebook } from '../gradebook/GradeUtil'
import { Colors } from '../colors/Colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as SecureStore from 'expo-secure-store'
import Modal from 'react-native-modal'
import useAsyncEffect from 'use-async-effect'
import { FadeInFlatList } from '@ja-ka/react-native-fade-in-flatlist'
import { Divider, TextInput, useTheme } from 'react-native-paper'
import { toast } from '../util/Util'
import { SchoolDistrict } from 'studentvue/StudentVue/StudentVue.interfaces'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import BannerAd from '../components/BannerAd'
import Constants from 'expo-constants'
import District from '../components/District'
import { StatusBar } from 'expo-status-bar'
import AsyncStorage from '@react-native-async-storage/async-storage'

type loginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Login'>

type loginInfo = 'username' | 'password' | 'district'

const Login = () => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<loginScreenProp>()
  const refInput = useRef(null)
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)
  const { isDarkTheme, setClient, setMarks, setIsDarkTheme } =
    useContext(AppContext)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecked, setToggleCheckBox] = useState(true)
  const [isPasswordSecure, setIsPasswordSecure] = useState(true)

  const [isDistrictModalVisible, setDistrictModalVisible] = useState(false)
  const [isQuestionsModalVisible, setQuestionsModalVisible] = useState(false)

  const [selectedDistrict, setSelectedDistrict] = useState(
    null as SchoolDistrict
  )
  const [districts, setDistricts] = useState(null as SchoolDistrict[])
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false)

  useAsyncEffect(async () => {
    Appearance.addChangeListener(async ({ colorScheme }) => {
      const theme = await AsyncStorage.getItem('Theme')
      if (!theme || theme === 'device')
        setIsDarkTheme(colorScheme === 'dark' ? true : false)
    })
    savedCredentials()

    const backAction = () => {
      BackHandler.exitApp()
      return true
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )

    return () => backHandler.remove()
  }, [])

  async function savedCredentials(): Promise<void> {
    const username: string = await getValueFor('username')
    const password: string = await getValueFor('password')
    const district: SchoolDistrict = JSON.parse(await getValueFor('district'))

    if (!username || !password || !district) {
      return
    }

    setUsername(username)
    setPassword(password)
    setSelectedDistrict(district)
    setIsLoading(true)
    try {
      const client = await StudentVue.login(district.parentVueUrl, {
        username: username,
        password: password
      })
      const gradebook = await client.gradebook()
      const marks = convertGradebook(gradebook)
      setClient(client)
      setMarks(marks)
    } catch (err) {
      setIsLoading(false)
      Alert.alert(err.message)
      return
    }
    setIsLoading(false)
    navigation.navigate('Menu')
  }

  async function onLogin(): Promise<void> {
    if (!username) {
      toast('Enter your username')
      return
    }
    if (!password) {
      toast('Enter your password')
      return
    }
    if (!selectedDistrict) {
      toast('Select your school district')
      return
    }
    setIsLoading(true)
    try {
      const client = await StudentVue.login(selectedDistrict.parentVueUrl, {
        username: username,
        password: password
      })
      const gradebook = await client.gradebook()
      const marks = convertGradebook(gradebook)
      setClient(client)
      setMarks(marks)
    } catch (err) {
      setIsLoading(false)
      Alert.alert(err.message)
      return
    }
    if (isChecked) {
      save('username', username)
      save('password', password)
      save('district', JSON.stringify(selectedDistrict))
    }
    setIsLoading(false)
    navigation.navigate('Menu')
  }

  async function openInstagram(username: string): Promise<void> {
    const appUrl = `instagram://user?username=${username}`
    try {
      if (await Linking.canOpenURL(appUrl)) {
        Linking.openURL(appUrl)
      } else {
        // Instagram app not installed
        try {
          Linking.openURL(`https://instagram.com/${username}`)
        } catch (err) {}
      }
    } catch (err) {}
  }

  async function save(key: loginInfo, value: string): Promise<void> {
    if (value === null) return
    await SecureStore.setItemAsync(key, value)
  }

  async function getValueFor(key: loginInfo): Promise<string> {
    return await SecureStore.getItemAsync(key)
  }

  const onPressOpenDistrictModal = () => {
    Keyboard.dismiss()
    setDistrictModalVisible(true)
  }

  const onSearch = async (zipcode: string) => {
    setIsLoadingDistricts(true)
    setDistricts(null)
    try {
      const districtsFound: SchoolDistrict[] = await StudentVue.findDistricts(
        zipcode
      )
      setIsLoadingDistricts(false)
      setDistricts(districtsFound)
    } catch (e) {
      setIsLoadingDistricts(false)
      let message = e.message
      switch (message) {
        case 'Please enter zip code. Missing zip code as expected parameters.':
          message = 'Please enter a zipcode'
          break
        case 'Please enter zip code with atleast 3 characters and not more than 5 characters.':
          message = 'Zipcode must be between 3-5 characters'
          break
        case 'Network Error':
          message = 'Network error, check your connection'
          break
      }
      Alert.alert(message)
      return
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Modal
        isVisible={isQuestionsModalVisible}
        coverScreen={false}
        onBackdropPress={() => setQuestionsModalVisible(false)}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        backdropTransitionOutTiming={0}
      >
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={[
              styles.questions_modal,
              {
                marginTop: insets.top,
                marginBottom: insets.bottom,
                backgroundColor: theme.colors.surface
              }
            ]}
          >
            <Text
              style={[styles.questions_text, { color: theme.colors.onSurface }]}
            >
              Your username and password are the same as your school's
              StudentVue website.{'\n\n'}We do not collect your personal
              information nor can we access it remotely
            </Text>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={isDistrictModalVisible}
        coverScreen={false}
        onBackdropPress={() => setDistrictModalVisible(false)}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        backdropTransitionOutTiming={0}
      >
        <View
          style={[
            styles.modal,
            {
              marginTop: insets.top,
              marginBottom: insets.bottom,
              paddingTop: 16,
              backgroundColor: theme.colors.surface
            }
          ]}
        >
          <TextInput
            mode="outlined"
            label="Enter school district zipcode"
            keyboardType="number-pad"
            returnKeyType="done"
            onSubmitEditing={({ nativeEvent: { text } }) => onSearch(text)}
          />
          {districts && (
            <FadeInFlatList
              initialDelay={0}
              durationPerItem={300}
              parallelItems={5}
              itemsToFadeIn={20}
              data={districts}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => {
                return (
                  <District
                    onPress={() => {
                      setDistrictModalVisible(false)
                      setSelectedDistrict(item)
                    }}
                    item={item}
                    selected={
                      selectedDistrict && selectedDistrict.name === item.name
                    }
                  />
                )
              }}
              style={{ flexGrow: 0 }}
              contentContainerStyle={{ flexGrow: 0, marginTop: 15 }}
              ItemSeparatorComponent={Seperator}
              ListEmptyComponent={
                <Text
                  style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 14
                  }}
                >
                  No school districts found
                </Text>
              }
            />
          )}
          {isLoadingDistricts && (
            <ActivityIndicator
              color={Colors.secondary}
              animating={true}
              size="large"
              style={{ marginTop: 20 }}
            />
          )}
        </View>
      </Modal>
      <ImageBackground
        source={
          theme.dark
            ? require('../assets/mountainbackground-dark.png')
            : require('../assets/mountainbackground.png')
        }
        resizeMode="cover"
        style={{
          flex: 1,
          backgroundColor: Colors.white
        }}
      >
        <StatusBar style={isDarkTheme ? 'light' : 'dark'} />
        <SafeAreaView
          style={{ alignItems: 'center' }}
          edges={['top', 'left', 'right']}
        >
          <View style={styles.name_container}>
            <Text
              style={[
                styles.name,
                {
                  color: theme.dark
                    ? theme.colors.onSurfaceVariant
                    : Colors.black
                }
              ]}
            >
              GradeHelper
            </Text>
          </View>
        </SafeAreaView>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View>
            <TouchableOpacity
              style={styles.questions_button}
              onPress={() => setQuestionsModalVisible(true)}
            >
              <Text
                style={[
                  styles.questions_text,
                  { color: theme.colors.onSurface }
                ]}
              >
                Questions/Concerns
              </Text>
            </TouchableOpacity>
            <TextInput
              mode="outlined"
              defaultValue={username}
              onChangeText={(u) => setUsername(u)}
              placeholder="Username"
              style={[styles.input, { width: 250 }]}
              returnKeyType="next"
              onSubmitEditing={() => refInput.current.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              mode="outlined"
              defaultValue={password}
              onChangeText={(p) => setPassword(p)}
              placeholder="Password"
              secureTextEntry={isPasswordSecure}
              style={[styles.input, { width: 250 }]}
              returnKeyType="next"
              ref={refInput}
              onSubmitEditing={() => {
                onPressOpenDistrictModal()
              }}
              blurOnSubmit={false}
              right={
                <TextInput.Icon
                  icon={isPasswordSecure ? 'eye-off-outline' : 'eye-outline'}
                  style={{ marginRight: -2 }}
                  onPress={() => setIsPasswordSecure(!isPasswordSecure)}
                />
              }
            />
            <TouchableOpacity
              style={[
                styles.districts_button,
                { borderColor: theme.colors.outline }
              ]}
              onPress={async () => onPressOpenDistrictModal()}
            >
              <Text
                style={[
                  styles.selected_district_text,
                  {
                    color: selectedDistrict
                      ? theme.colors.onSurface
                      : theme.colors.onSurfaceVariant
                  }
                ]}
                numberOfLines={2}
              >
                {selectedDistrict
                  ? selectedDistrict.name
                  : 'Find School District'}
              </Text>
              {!selectedDistrict && (
                <MaterialCommunityIcons
                  name="school-outline"
                  size={24}
                  color={theme.colors.onSurfaceVariant}
                  style={{
                    marginRight: 12
                  }}
                />
              )}
            </TouchableOpacity>
            <View style={styles.checkbox_container}>
              <BouncyCheckbox
                disableBuiltInState
                disableText
                isChecked={isChecked}
                size={24}
                fillColor={Colors.navy}
                onPress={() => {
                  setToggleCheckBox(!isChecked)
                }}
                disabled={isLoading}
              />
              <Text
                style={[styles.save_text, { color: theme.colors.onSurface }]}
              >
                Remember Me
              </Text>
            </View>
            <CustomButton
              onPress={() => {
                if (!isLoading) onLogin()
              }}
              text="Login"
              backgroundColor={
                !isLoading ? Colors.navy : 'rgba(100, 100, 100, 0.6)'
              }
              textColor={Colors.white}
              fontFamily="Inter_800ExtraBold"
              containerStyle={styles.button_container}
              disabled={isLoading}
            >
              {isLoading && (
                <ActivityIndicator
                  color={Colors.white}
                  size="small"
                  style={{ margin: 0, marginRight: 10 }}
                />
              )}
            </CustomButton>
          </View>
        </KeyboardAvoidingView>
        <SafeAreaView
          edges={['bottom', 'left', 'right']}
          style={{
            alignSelf: 'flex-end',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <BannerAd
            androidId={Constants.expoConfig.extra.LOGIN_BANNER_ANDROID}
            iosId={Constants.expoConfig.extra.LOGIN_BANNER_IOS}
          />
          <View style={styles.insta_container}>
            <TouchableOpacity
              style={styles.insta_button_container}
              onPress={() => openInstagram('richardyin99')}
            >
              <View style={styles.insta_icon_container}>
                <MaterialCommunityIcons
                  name="instagram"
                  backgroundColor="transparent"
                  iconStyle={styles.insta_button}
                  underlayColor="none"
                  size={20}
                  color={theme.colors.onSurfaceVariant}
                />
              </View>
              <Text
                style={[
                  styles.insta_text,
                  { color: theme.colors.onSurfaceVariant }
                ]}
              >
                Richard Y
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.insta_button_container}
              onPress={() => openInstagram('karthik.whynot')}
            >
              <View style={styles.insta_icon_container}>
                <MaterialCommunityIcons
                  name="instagram"
                  backgroundColor="transparent"
                  iconStyle={styles.insta_button}
                  underlayColor="none"
                  size={20}
                  color={theme.colors.onSurfaceVariant}
                />
              </View>
              <Text
                style={[
                  styles.insta_text,
                  { color: theme.colors.onSurfaceVariant }
                ]}
              >
                Karthik M
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  )
}

export default Login

const Seperator = () => {
  return (
    <Divider
      style={{
        marginVertical: 8
      }}
      bold
    />
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  modal: {
    alignSelf: 'center',
    borderRadius: 20,
    padding: 20,
    width: 350
  },
  questions_button: {
    height: 48,
    alignItems: 'center',
    padding: 10,
    justifyContent: 'flex-end',
    alignSelf: 'center'
  },
  questions_modal: {
    padding: 20,
    borderRadius: 20,
    maxWidth: 350
  },
  questions_text: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14
  },
  name_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  name: {
    fontFamily: 'Montserrat_900Black',
    fontSize: 40
  },
  checkbox_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'flex-start'
  },
  input: {
    marginBottom: 6,
    backgroundColor: 'transparent'
  },
  districts_button: {
    width: 250,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    minHeight: 56,
    marginTop: 6
  },
  selected_district_text: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.black,
    flex: 1,
    margin: 16
  },
  button_container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 0,
    width: 250,
    height: 50
  },
  save_text: {
    fontFamily: 'Inter_400Regular',
    marginLeft: 10
  },
  insta_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  insta_icon_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  insta_button_container: {
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    minWidth: 48
  },
  insta_button: {
    color: Colors.black
  },
  insta_text: {
    fontFamily: 'Inter_300Light',
    fontSize: 11
  }
})
