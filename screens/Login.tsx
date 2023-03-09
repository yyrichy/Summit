import React, { useContext, useRef, useState } from 'react'
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  BackHandler,
  Alert,
  TouchableOpacity,
  Keyboard,
  View,
  Platform,
  KeyboardAvoidingView,
  Appearance,
  Dimensions,
  ImageBackground
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import StudentVue from 'studentvue'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import CustomButton from '../components/CustomButton'
import AppContext from '../contexts/AppContext'
import { convertGradebook } from '../gradebook/GradeUtil'
import { Colors } from '../colors/Colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as SecureStore from 'expo-secure-store'
import useAsyncEffect from 'use-async-effect'
import { FadeInFlatList } from '@ja-ka/react-native-fade-in-flatlist'
import {
  Dialog,
  Divider,
  Portal,
  TextInput,
  useTheme,
  Text as PaperText,
  Button
} from 'react-native-paper'
import { toast } from '../util/Util'
import { SchoolDistrict } from 'studentvue/StudentVue/StudentVue.interfaces'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import BannerAd from '../components/BannerAd'
import Constants from 'expo-constants'
import District from '../components/District'
import { StatusBar } from 'expo-status-bar'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Login = () => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<
    NativeStackNavigationProp<
      {
        Login: any
        Menu: any
      },
      'Login'
    >
  >()
  const refInput = useRef(null)
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)
  const { isDarkTheme, setClient, setMarks, setIsDarkTheme } = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecked, setToggleCheckBox] = useState(true)
  const [isPasswordSecure, setIsPasswordSecure] = useState(true)

  const [districtDialogVisible, setDistrictDialog] = useState(false)
  const [securityDialogVisible, setSecurityDialog] = useState(false)

  const [selectedDistrict, setSelectedDistrict] = useState(null as SchoolDistrict)
  const [districts, setDistricts] = useState(null as SchoolDistrict[])
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false)

  useAsyncEffect(async () => {
    Appearance.addChangeListener(async ({ colorScheme }) => {
      const theme = await AsyncStorage.getItem('Theme')
      if (!theme || theme === 'device') setIsDarkTheme(colorScheme === 'dark' ? true : false)
    })
    savedCredentials()

    const backAction = () => {
      BackHandler.exitApp()
      return true
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)

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
      toast('Enter your username', theme.dark)
      return
    }
    if (!password) {
      toast('Enter your password', theme.dark)
      return
    }
    if (!selectedDistrict) {
      toast('Select your school district', theme.dark)
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

  async function save(key: 'username' | 'password' | 'district', value: string): Promise<void> {
    if (value === null) return
    await SecureStore.setItemAsync(key, value)
  }

  async function getValueFor(key: 'username' | 'password' | 'district'): Promise<string> {
    return await SecureStore.getItemAsync(key)
  }

  const onPressOpenDistrictModal = () => {
    Keyboard.dismiss()
    setDistrictDialog(true)
  }

  const onSearch = async (zipcode: string) => {
    setIsLoadingDistricts(true)
    setDistricts(null)
    try {
      const districtsFound: SchoolDistrict[] = await StudentVue.findDistricts(zipcode)
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
      <Portal>
        <Dialog
          visible={securityDialogVisible}
          onDismiss={() => setSecurityDialog(false)}
          style={{ backgroundColor: theme.colors.surface }}
        >
          <Dialog.Icon icon="shield-check-outline" />
          <Dialog.Title style={{ textAlign: 'center' }}>Security/Privacy</Dialog.Title>
          <Dialog.Content>
            <PaperText variant="bodyMedium">
              We do not collect your login information. We cannot access your personal information
              remotely.
            </PaperText>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setSecurityDialog(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog
          visible={districtDialogVisible}
          onDismiss={() => setDistrictDialog(false)}
          style={{
            backgroundColor: theme.colors.surface,
            marginTop: Math.max(insets.top, 20),
            maxHeight: Dimensions.get('window').height - insets.top - insets.bottom - 40,
            marginBottom: Math.max(insets.bottom, 20)
          }}
        >
          <Dialog.Title>Choose School District</Dialog.Title>
          <Dialog.ScrollArea style={{ borderColor: theme.colors.surface }}>
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
                        setDistrictDialog(false)
                        setSelectedDistrict(item)
                      }}
                      item={item}
                      selected={selectedDistrict && selectedDistrict.name === item.name}
                    />
                  )
                }}
                style={{ flexGrow: 0 }}
                contentContainerStyle={{ flexGrow: 0, marginTop: 12 }}
                ItemSeparatorComponent={Seperator}
                ListEmptyComponent={
                  <PaperText variant="bodyMedium">No school districts found</PaperText>
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
          </Dialog.ScrollArea>
        </Dialog>
      </Portal>
      <ImageBackground
        source={
          theme.dark
            ? require('../assets/mountainbackground-dark.png')
            : require('../assets/mountainbackground.png')
        }
        style={{
          flex: 1,
          backgroundColor: Colors.primary
        }}
        resizeMode="cover"
      >
        <StatusBar style={isDarkTheme ? 'light' : 'dark'} />
        <SafeAreaView style={{ alignItems: 'center' }} edges={['top', 'left', 'right']}>
          <View style={styles.name_container}>
            <Text
              style={[
                styles.name,
                {
                  color: theme.dark ? theme.colors.onSurfaceVariant : Colors.black
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
              onPress={() => setSecurityDialog(true)}
            >
              <Text style={[styles.questions_text, { color: theme.colors.onSurface }]}>
                Security/Privacy
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
              onSubmitEditing={onPressOpenDistrictModal}
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
              style={[styles.districts_button, { borderColor: theme.colors.outline }]}
              onPress={onPressOpenDistrictModal}
            >
              <Text
                style={[
                  styles.selected_district_text,
                  {
                    color: selectedDistrict ? theme.colors.onSurface : theme.colors.onSurfaceVariant
                  }
                ]}
                numberOfLines={2}
              >
                {selectedDistrict ? selectedDistrict.name : 'Find School District'}
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
              <Text style={[styles.save_text, { color: theme.colors.onSurface }]}>Remember Me</Text>
            </View>
            <CustomButton
              onPress={onLogin}
              text="Login"
              backgroundColor={!isLoading ? Colors.navy : 'rgba(100, 100, 100, 0.6)'}
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
        marginVertical: 4
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
  questions_button: {
    height: 48,
    alignItems: 'center',
    padding: 10,
    justifyContent: 'flex-end',
    alignSelf: 'center'
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
  details_container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  details_text: {
    fontFamily: 'Inter_400Regular'
  }
})
