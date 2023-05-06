import React, { useContext, useReducer, useRef, useState } from 'react'
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
  useWindowDimensions
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
import { SchoolDistrict } from 'studentvue/StudentVue/StudentVue.interfaces'
import District from '../components/District'
import { StatusBar } from 'expo-status-bar'
import AsyncStorage from '@react-native-async-storage/async-storage'
import BackgroundFetch from 'react-native-background-fetch'
import { updateGradesWidget } from '../util/Widget'
import Dot from '../components/Dot'
import ThemePicker from '../components/ThemePicker'
import Svg, { Path } from 'react-native-svg'

const Login = () => {
  const insets = useSafeAreaInsets()
  const svgWidth = 500
  const svgHeight = 130 + insets.bottom
  const { height, width } = useWindowDimensions()
  const theme = useTheme()
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
  const { isDarkTheme, setClient, setMarks } = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecked, setCheckBox] = useState(false)
  const [isPasswordSecure, togglePasswordSecure] = useReducer((s) => !s, true)

  const [districtDialogVisible, toggleDistrictDialog] = useReducer((s) => !s, false)
  const [securityDialogVisible, toggleSecurityDialog] = useReducer((s) => !s, false)
  const [themeDialogVisible, toggleThemeDialog] = useReducer((s) => !s, false)

  const [selectedDistrict, setSelectedDistrict] = useState(null as SchoolDistrict)
  const [districts, setDistricts] = useState(null as SchoolDistrict[])
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false)

  useAsyncEffect(async () => {
    if (Platform.OS === 'android') configureBackgroundFetch()
    let isThemeSelected = false
    try {
      if (!(await AsyncStorage.getItem('ThemeColor'))) {
        isThemeSelected = true
      }
    } catch (e) {}
    if (isThemeSelected) {
      toggleThemeDialog()
    } else {
      savedCredentials()
    }

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
    const savedIsParent = await getValueFor('isParent')
    const isParent: boolean = savedIsParent === 'true'
    if (!username || !password || !district || !savedIsParent) {
      return
    }
    setIsLoading(true)
    setUsername(username)
    setPassword(password)
    setSelectedDistrict(district)
    setCheckBox(isParent)
    try {
      const client = await StudentVue.login(district.parentVueUrl, {
        username: username,
        password: password,
        isParent: isParent
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
      Alert.alert('Enter your username')
      return
    }
    if (!password) {
      Alert.alert('Enter your password')
      return
    }
    if (!selectedDistrict) {
      Alert.alert('Select your school district')
      return
    }
    setIsLoading(true)
    try {
      const client = await StudentVue.login(selectedDistrict.parentVueUrl, {
        username: username,
        password: password,
        isParent: isChecked
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
    save('username', username)
    save('password', password)
    save('district', JSON.stringify(selectedDistrict))
    save('isParent', isChecked.toString())
    setIsLoading(false)
    navigation.navigate('Menu')
  }

  const onPressOpenDistrictDialog = () => {
    Keyboard.dismiss()
    toggleDistrictDialog()
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
        // The api misspells this error message
        // cspell:disable-next-line
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
      <ThemePicker visible={themeDialogVisible} onDismiss={toggleThemeDialog} />
      <Portal>
        <Dialog
          visible={securityDialogVisible}
          onDismiss={toggleSecurityDialog}
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
            <Button onPress={toggleSecurityDialog}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog
          visible={districtDialogVisible}
          onDismiss={toggleDistrictDialog}
          style={{
            backgroundColor: theme.colors.surface,
            marginTop: Math.max(insets.top, 20),
            maxHeight: height - insets.top - insets.bottom - 40,
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
                        toggleDistrictDialog()
                        setSelectedDistrict(item)
                      }}
                      item={item}
                      selected={selectedDistrict && selectedDistrict.name === item.name}
                    />
                  )
                }}
                style={{ flexGrow: 0 }}
                contentContainerStyle={{ flexGrow: 0, marginTop: 12 }}
                ItemSeparatorComponent={Separator}
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
      <View
        style={{
          flex: 1
        }}
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
              style={{
                paddingBottom: 8,
                height: 48,
                alignSelf: 'center',
                paddingHorizontal: 12,
                justifyContent: 'flex-end',
                alignItems: 'center',
                width: 250
              }}
              onPress={onPressOpenDistrictDialog}
              disabled={isLoading}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={{
                      fontFamily: 'Inter_400Regular',
                      textDecorationLine: 'underline',
                      flexShrink: 1,
                      color: theme.colors.onSurfaceVariant
                    }}
                    numberOfLines={1}
                  >
                    {selectedDistrict ? selectedDistrict.name : 'Select School District'}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="school-outline"
                  size={20}
                  color={theme.colors.onSurfaceVariant}
                  style={{
                    marginLeft: 4
                  }}
                />
              </View>
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
              onSubmitEditing={onLogin}
              blurOnSubmit={false}
              right={
                <TextInput.Icon
                  icon={isPasswordSecure ? 'eye-off-outline' : 'eye-outline'}
                  style={{ marginRight: -2 }}
                  onPress={togglePasswordSecure}
                />
              }
            />
            <CustomButton
              onPress={onLogin}
              text="Login"
              backgroundColor={theme.colors.secondaryContainer}
              textColor={theme.colors.onSecondaryContainer}
              fontFamily="RobotoSerif_900Black_Italic"
              containerStyle={[
                styles.button_container,
                {
                  opacity: isLoading ? 0.2 : 1
                }
              ]}
              disabled={isLoading}
            >
              {isLoading && (
                <ActivityIndicator
                  color={theme.colors.onSecondaryContainer}
                  size="small"
                  style={{ margin: 0, marginLeft: 10 }}
                />
              )}
            </CustomButton>
          </View>
        </KeyboardAvoidingView>
        <View
          style={{
            width: width + 10,
            aspectRatio: svgWidth / svgHeight,
            marginLeft: -5
          }}
        >
          <Svg
            height="100%"
            width="100%"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            style={{ position: 'absolute' }}
          >
            <Path
              d={`M0 0 C203 2 266 ${90 + insets.bottom} 500 10 l0 ${130 + insets.bottom} L0 ${
                140 + insets.bottom
              } L0 0`}
              fill={theme.colors.secondaryContainer}
            />
          </Svg>
          <SafeAreaView
            style={{
              alignItems: 'center',
              position: 'absolute',
              bottom: 10,
              width: '100%'
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={styles.parent_button}
                onPress={() => setCheckBox(!isChecked)}
                disabled={isLoading}
              >
                <MaterialCommunityIcons
                  name="check"
                  size={20}
                  color={isChecked ? theme.colors.onSurface : Colors.transparent}
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.questions_text, { color: theme.colors.onSurface }]}>
                  Parent Login
                </Text>
              </TouchableOpacity>
              <Dot size={16} style={{ marginHorizontal: 8 }} />
              <TouchableOpacity
                style={styles.questions_button}
                onPress={toggleSecurityDialog}
                disabled={isLoading}
              >
                <Text style={[styles.questions_text, { color: theme.colors.onSurface }]}>
                  Security/Privacy
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </View>
  )
}

const Separator = () => {
  return (
    <Divider
      style={{
        marginVertical: 4
      }}
      bold
    />
  )
}

const configureBackgroundFetch = () => {
  BackgroundFetch.configure(
    {
      minimumFetchInterval: 15,
      enableHeadless: true,
      stopOnTerminate: false,
      startOnBoot: true,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY
    },
    async (taskId) => {
      updateGradesWidget(taskId)
    },
    async (taskId) => {
      BackgroundFetch.finish(taskId)
    }
  )
}

const save = async (
  key: 'username' | 'password' | 'district' | 'isParent',
  value: string
): Promise<void> => {
  if (value === null) return
  await SecureStore.setItemAsync(key, value)
}

const getValueFor = async (
  key: 'username' | 'password' | 'district' | 'isParent'
): Promise<string> => {
  return await SecureStore.getItemAsync(key)
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
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: 20
  },
  questions_text: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14
  },
  parent_button: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row'
  },
  name_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  name: {
    fontFamily: 'RobotoSerif_900Black_Italic',
    fontSize: 40,
    marginTop: 10
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent'
  },
  selected_district_text: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    flex: 1,
    marginHorizontal: 16
  },
  button_container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
    borderWidth: 0,
    width: 250,
    height: 56,
    marginTop: 40
  },
  details_container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  details_text: {
    fontFamily: 'Inter_400Regular'
  }
})

export default Login
