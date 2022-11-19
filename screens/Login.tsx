import React, { useContext, useRef, useState } from 'react'
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Linking,
  ImageBackground,
  BackHandler,
  Alert,
  TouchableOpacity,
  FlatList
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import StudentVue from 'studentvue'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../types/RootStackParams'
import { useNavigation } from '@react-navigation/native'
import CustomButton from '../components/CustomButton'
import LoginView from '../components/Login'
import AppContext from '../contexts/AppContext'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import { convertGradebook } from '../gradebook/GradeUtil'
import { Colors } from '../colors/Colors'
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons'
import { useCookies } from 'react-cookie'
import * as SecureStore from 'expo-secure-store'
import Modal from 'react-native-modal'
import useAsyncEffect from 'use-async-effect'
import * as Location from 'expo-location'
import allDistricts from '../assets/districts.json'

type loginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Login'>

type loginInfo = 'username' | 'password' | 'district'

const Login = () => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<loginScreenProp>()
  const refInput = useRef<TextInput | null>(null)
  const { username, password, setUsername, setPassword, setClient, setMarks } =
    useContext(AppContext)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecked, setToggleCheckBox] = useState(false)

  const [firstLaunch, setFirstLaunch] = useState(false)

  const [isModalVisible, setModalVisible] = useState(false)
  const [isDistrictModalVisible, setDistrictModalVisible] = useState(false)

  const [cookies, setCookie, removeCookie] = useCookies([
    'username',
    'password',
    'district'
  ] as loginInfo[])

  const [selected, setSelected] = useState(null)
  const [districts, setDistricts] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  useAsyncEffect(async () => {
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
    const value: string = await getValueFor('district')

    // Auto login
    if (!username || !password || !value) {
      setFirstLaunch(true)
      return
    }

    setUsername(username)
    setPassword(password)
    setSelected(allDistricts.find((d) => d.parentVueUrl === value))
    setIsLoading(true)
    setToggleCheckBox(true)
    try {
      const client = await StudentVue.login(value, {
        username: username,
        password: password
      })
      const gradebook = await client.gradebook()
      const marks = await convertGradebook(gradebook)
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
    if (!selected) {
      Alert.alert('Select your school district')
      return
    }
    setIsLoading(true)
    try {
      const client = await StudentVue.login(selected.parentVueUrl, {
        username: username,
        password: password
      })
      const gradebook = await client.gradebook()
      const marks = await convertGradebook(gradebook)
      setClient(client)
      setMarks(marks)
    } catch (err) {
      setIsLoading(false)
      Alert.alert('Error logging in', err.message)
      return
    }
    if (isChecked) {
      save('username', username)
      save('password', password)
      save('district', selected.parentVueUrl)
    } else {
      remove('username')
      remove('password')
      remove('username')
    }
    setIsLoading(false)
    navigation.navigate('Menu')
  }

  async function openInstagram(username: string): Promise<void> {
    if (Platform.OS !== 'web') {
      const appUrl = `instagram://user?username=${username}`
      try {
        if (await Linking.canOpenURL(appUrl)) {
          Linking.openURL(appUrl)
        } else {
          try {
            Linking.openURL(`https://instagram.com/${username}`)
          } catch (err) {}
        }
      } catch (err) {}
    } else {
      try {
        Linking.openURL(`https://instagram.com/${username}`)
      } catch (err) {}
    }
  }

  function nameFontSize(): number {
    return Platform.OS === 'web' ? 60 : 40
  }

  function descriptionFontSize(): number {
    return Platform.OS === 'web' ? 25 : 20
  }

  function mountainSize(): number {
    return Platform.OS === 'web' ? 40 : 30
  }

  async function save(key: loginInfo, value: string): Promise<void> {
    if (value === null) return
    if (Platform.OS === 'web') {
      setCookie(key, value, { path: '/' })
    } else {
      await SecureStore.setItemAsync(key, value)
    }
  }

  async function getValueFor(key: loginInfo): Promise<string> {
    if (Platform.OS === 'web') {
      return cookies[key]
    } else {
      return await SecureStore.getItemAsync(key)
    }
  }

  const remove = async (key: loginInfo): Promise<void> => {
    if (Platform.OS === 'web') {
      removeCookie(key, { path: '/' })
    } else {
      await SecureStore.deleteItemAsync(key)
    }
  }

  const onPress = async () => {
    setDistrictModalVisible(true)
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied')
      setDistricts(null)
      return
    } else {
      setErrorMsg(null)
    }

    let { coords } = await Location.getCurrentPositionAsync()
    const { latitude, longitude } = coords
    let reverse = await Location.reverseGeocodeAsync({ latitude, longitude })
    const districtsFound = await StudentVue.findDistricts(reverse[0].postalCode)
    const newDistricts = allDistricts.filter((d) =>
      districtsFound.some((e) => e.name === d.name)
    )
    let d = newDistricts.map((d) => ({
      ...d,
      distance: distance(
        { lat: latitude, long: longitude },
        { lat: d.latitude, long: d.longitude }
      )
    }))
    d.sort((a, b) => {
      if (a.distance > b.distance) {
        return 1
      } else if (a.distance < b.distance) {
        return -1
      }
      return 0
    })
    setDistricts(d)
  }

  return (
    <>
      <Modal
        isVisible={isModalVisible}
        coverScreen={false}
        onBackdropPress={() => setModalVisible(!isModalVisible)}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
      >
        <View style={[styles.modal, { width: 250 }]}>
          <View style={styles.modal_view}>
            <Text style={styles.security_modal}>
              We do not collect/save your login information. Info entered is
              sent directly to your school district's StudentVue website.
            </Text>
            <FontAwesome.Button
              name="github"
              backgroundColor="transparent"
              iconStyle={{
                color: Colors.black
              }}
              underlayColor="none"
              activeOpacity={0.2}
              size={28}
              onPress={() =>
                Linking.openURL('https://github.com/vaporrrr/Summit')
              }
              style={{ padding: 0, alignSelf: 'flex-end' }}
            ></FontAwesome.Button>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={isDistrictModalVisible}
        coverScreen={false}
        onBackdropPress={() => setDistrictModalVisible(!isDistrictModalVisible)}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
      >
        <View style={[styles.modal, { marginTop: insets.top }]}>
          <View style={[styles.modal_view, {}]}>
            {errorMsg ? (
              <>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14 }}>
                  {errorMsg}
                </Text>
                <View>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      borderRadius: 5,
                      borderWidth: 1,
                      padding: 10,
                      alignItems: 'center',
                      marginTop: 10,
                      alignSelf: 'center',
                      backgroundColor: Colors.off_white
                    }}
                    onPress={async () => {
                      setDistrictModalVisible(false)
                      Linking.openSettings()
                    }}
                  >
                    <Text
                      style={{ fontFamily: 'Inter_500Medium', fontSize: 18 }}
                    >
                      Settings
                    </Text>
                    <Ionicons
                      name="settings-outline"
                      size={24}
                      color="black"
                      style={{ padding: 0, marginLeft: 4 }}
                    />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              !districts && (
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14 }}>
                  Waiting...
                </Text>
              )
            )}
            <FlatList
              data={districts}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelected(item)
                    setDistrictModalVisible(!isDistrictModalVisible)
                  }}
                  style={{ paddingVertical: 10 }}
                >
                  <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 16 }}>
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Inter_400Regular',
                      fontSize: 16,
                      color: Colors.onyx_gray,
                      marginTop: 2
                    }}
                  >
                    {item.distance.toFixed(2)} mi
                  </Text>
                </TouchableOpacity>
              )}
              style={{ flexGrow: 0 }}
              ItemSeparatorComponent={Seperator}
            ></FlatList>
          </View>
        </View>
      </Modal>
      <ImageBackground
        source={require('../assets/mountainbackground.png')}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ alignItems: 'center' }}>
          <View style={styles.horizontal_container}>
            <Text style={[styles.name, { fontSize: nameFontSize() }]}>
              Summit
            </Text>
            <View style={styles.mountain}>
              <FontAwesome5
                name="mountain"
                size={mountainSize()}
                color="black"
              />
            </View>
          </View>
          <Text
            style={[styles.description, { fontSize: descriptionFontSize() }]}
          >
            Grade Viewer
          </Text>
        </SafeAreaView>
        <LoginView>
          {firstLaunch && (
            <View style={styles.login_info_container}>
              <View style={styles.horizontal_container}>
                <Text style={styles.security}>
                  This app is safe to use and open source
                </Text>
                <FontAwesome.Button
                  name="info-circle"
                  backgroundColor="transparent"
                  iconStyle={{
                    color: Colors.black
                  }}
                  underlayColor="none"
                  activeOpacity={0.2}
                  size={20}
                  onPress={() => setModalVisible(true)}
                  style={{
                    padding: 0,
                    paddingLeft: 6
                  }}
                ></FontAwesome.Button>
              </View>
              <Text style={styles.login_info}>
                Login info is the same as StudentVue
              </Text>
            </View>
          )}
          <TextInput
            defaultValue={username}
            onChangeText={(u) => setUsername(u)}
            placeholder={'Username'}
            style={styles.input}
            returnKeyType={'next'}
            onSubmitEditing={() => refInput.current.focus()}
            blurOnSubmit={false}
          />
          <TextInput
            defaultValue={password}
            onChangeText={(p) => setPassword(p)}
            placeholder={'Password'}
            secureTextEntry={true}
            style={styles.input}
            returnKeyType={'next'}
            ref={refInput}
          />
          <TouchableOpacity
            style={{
              width: 250,
              flexDirection: 'row',
              borderWidth: 1,
              borderRadius: 5,
              padding: 10,
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10
            }}
            onPress={async () => onPress()}
          >
            <Text
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 14,
                flexWrap: 'wrap',
                flex: 1
              }}
            >
              {selected ? selected.name : 'Find Your School District'}
            </Text>
            {selected ? (
              <Ionicons name="school-outline" size={24} color="black" />
            ) : (
              <Ionicons name="location-outline" size={24} color="black" />
            )}
          </TouchableOpacity>
          <View style={styles.checkbox_container}>
            <BouncyCheckbox
              size={24}
              fillColor={Colors.navy}
              unfillColor="transparent"
              disableText
              innerIconStyle={{
                borderWidth: 1,
                borderColor: Colors.black
              }}
              isChecked={isChecked}
              disableBuiltInState
              onPress={async () => {
                setToggleCheckBox(!isChecked)
              }}
            />
            <Text style={styles.save_text}>Save Login Information</Text>
          </View>
          <CustomButton
            onPress={() => {
              if (!isLoading) onLogin()
            }}
            text={'Login'}
            backgroundColor={
              !isLoading ? Colors.navy : 'rgba(100, 100, 100, 0.6)'
            }
            textColor={Colors.white}
            fontFamily="Inter_800ExtraBold"
            containerStyle={styles.button_container}
            disabled={isLoading}
          ></CustomButton>
          <ActivityIndicator
            color={Colors.secondary}
            animating={isLoading}
            style={{ marginBottom: 50 }}
            size="large"
          />
        </LoginView>
        <View style={styles.row_container}>
          <View style={styles.insta_button_container}>
            <FontAwesome.Button
              name="instagram"
              backgroundColor="transparent"
              iconStyle={styles.insta_button}
              underlayColor="none"
              activeOpacity={0.2}
              size={28}
              onPress={() => openInstagram('richardyin99')}
            ></FontAwesome.Button>
            <Text style={styles.insta_text}>Richard Y</Text>
          </View>
          <View style={styles.insta_button_container}>
            <FontAwesome.Button
              name="instagram"
              backgroundColor="transparent"
              iconStyle={styles.insta_button}
              underlayColor="none"
              activeOpacity={0.2}
              size={28}
              onPress={() => openInstagram('karthik.whynot')}
            ></FontAwesome.Button>
            <Text style={styles.insta_text}>Karthik M</Text>
          </View>
        </View>
      </ImageBackground>
    </>
  )
}

export default Login

const Seperator = () => {
  return <View style={{ borderWidth: 1, borderColor: Colors.secondary }}></View>
}

const distance = ({ lat: x1, long: y1 }, { lat: x2, long: y2 }) => {
  function toRadians(value) {
    return (value * Math.PI) / 180
  }

  var R = 6371.071
  var rlat1 = toRadians(x1) // Convert degrees to radians
  var rlat2 = toRadians(x2) // Convert degrees to radians
  var difflat = rlat2 - rlat1 // Radian difference (latitudes)
  var difflon = toRadians(y2 - y1) // Radian difference (longitudes)
  return (
    2 *
    R *
    Math.asin(
      Math.sqrt(
        Math.sin(difflat / 2) * Math.sin(difflat / 2) +
          Math.cos(rlat1) *
            Math.cos(rlat2) *
            Math.sin(difflon / 2) *
            Math.sin(difflon / 2)
      )
    )
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  horizontal_container: {
    flexDirection: 'row'
  },
  modal: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10
  },
  modal_view: {
    padding: 15
  },
  security_modal: {
    fontFamily: 'Inter_400Regular'
  },
  mountain: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5
  },
  name: {
    fontFamily: 'Montserrat_900Black'
  },
  description: {
    fontFamily: 'RussoOne_400Regular',
    textAlign: 'center'
  },
  login_info_container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  login_info: {
    fontFamily: 'Montserrat_300Light_Italic',
    fontSize: 12,
    marginBottom: 10,
    marginTop: 5
  },
  security: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14
  },
  checkbox_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  input: {
    width: 250,
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 5,
    marginBottom: 10
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.black,
    width: 250,
    marginBottom: 10,
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5
  },
  dropdown_text: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12
  },
  dropdown_container: {
    width: 250
  },
  dropdown_item: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontFamily: 'Inter_600SemiBold'
  },
  dropdown_tick: {
    marginLeft: 10
  },
  dropdown_search_container: {
    padding: 10,
    borderBottomWidth: 0
  },
  dropdown_search_text: {
    fontFamily: 'Inter_400Regular'
  },
  dropdown_list_item_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  district_name_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  loading: {
    margin: 'auto'
  },
  button_container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: 100,
    height: 50,
    padding: 10,
    borderRadius: 10,
    borderWidth: 0,
    marginBottom: 10
  },
  save_text: {
    marginLeft: 8,
    fontFamily: 'Inter_400Regular'
  },
  row_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25
  },
  insta_button_container: {
    marginHorizontal: 10
  },
  insta_button: {
    color: Colors.black
  },
  insta_text: {
    fontFamily: 'Inter_300Light',
    fontSize: 10
  }
})
