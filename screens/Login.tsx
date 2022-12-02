import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  TextInput,
  Text,
  StyleSheet,
  ActivityIndicator,
  Linking,
  ImageBackground,
  BackHandler,
  Alert,
  TouchableOpacity,
  Keyboard,
  View
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
import * as SecureStore from 'expo-secure-store'
import Modal from 'react-native-modal'
import useAsyncEffect from 'use-async-effect'
import * as Location from 'expo-location'
import { FadeInFlatList } from '@ja-ka/react-native-fade-in-flatlist'
import districtsFile from '../assets/districts.json'
import DropDownPicker from 'react-native-dropdown-picker'
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import District from '../components/District'

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

  const [selected, setSelected] = useState(null)
  const [districts, setDistricts] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(null)
  const [allDistricts, setAllDistricts] = useState(
    districtsFile.map((d, index) => {
      return { label: d.name, value: index }
    })
  )

  useEffect(() => {
    setSelected(districtsFile[value])
    setDistrictModalVisible(false)
  }, [value])

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
    setSelected(districtsFile.find((d) => d.parentVueUrl === value))
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

  const onPress = async () => {
    Keyboard.dismiss()
    setDistrictModalVisible(true)
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied')
      setDistricts(null)
      return
    } else {
      setErrorMsg(null)
    }

    const { coords } = await Location.getCurrentPositionAsync()
    const { latitude, longitude } = coords
    const reverse = await Location.reverseGeocodeAsync({ latitude, longitude })
    const districtsFound = await StudentVue.findDistricts(reverse[0].postalCode)
    const newDistricts = districtsFile.filter((d) =>
      districtsFound.some((e) => e.name === d.name)
    )
    const d = newDistricts.map((d) => ({
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
        backdropTransitionOutTiming={0}
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
        backdropTransitionOutTiming={0}
      >
        <View
          style={[
            styles.modal,
            { marginTop: insets.top, maxHeight: 500, padding: 15 }
          ]}
        >
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
                  <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 18 }}>
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
          {districts && (
            <MaskedView
              style={{ flex: 1 }}
              maskElement={
                <LinearGradient
                  style={{ flex: 1 }}
                  colors={[Colors.white, Colors.transparent]}
                  locations={[0.8, 1]}
                />
              }
            >
              <FadeInFlatList
                initialDelay={0}
                durationPerItem={500}
                parallelItems={5}
                itemsToFadeIn={15}
                data={districts}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setSelected(item)
                        setValue(
                          allDistricts.findIndex((d) => d.label === item.name)
                        )
                        setDistrictModalVisible(!isDistrictModalVisible)
                      }}
                      style={{
                        backgroundColor:
                          selected &&
                          selected.name === item.name &&
                          Colors.light_gray,
                        borderRadius: 5
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: 'Inter_500Medium',
                          fontSize: 16
                        }}
                      >
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
                  )
                }}
                style={{ flexGrow: 1 }}
                ItemSeparatorComponent={Seperator}
              />
            </MaskedView>
          )}
          <Text
            style={{
              fontFamily: 'Inter_700Bold',
              fontSize: 20,
              marginTop: 15
            }}
          >
            Manually Select School District
          </Text>
          <DropDownPicker
            open={open}
            value={value}
            items={allDistricts}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setAllDistricts}
            style={{ marginTop: 10 }}
            labelProps={{ numberOfLines: 1 }}
            translation={{
              SEARCH_PLACEHOLDER: 'Enter Your School District Name',
              NOTHING_TO_SHOW: 'No School Districts Found',
              PLACEHOLDER: 'Press to Select'
            }}
            textStyle={styles.dropdown_text_style}
            listMode="MODAL"
            listItemContainerStyle={{
              paddingHorizontal: 8,
              paddingVertical: 5
            }}
            listItemLabelStyle={styles.dropdown_text_style}
            renderListItem={(props) => {
              return (
                <District
                  {...props}
                  onPress={() => {
                    setValue(props.value)
                    setOpen(false)
                  }}
                />
              )
            }}
            searchable={true}
          />
        </View>
      </Modal>
      <ImageBackground
        source={require('../assets/mountainbackground.png')}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ alignItems: 'center' }}>
          <View style={styles.horizontal_container}>
            <Text style={styles.name}>Summit</Text>
            <View style={styles.mountain}>
              <FontAwesome5 name="mountain" size={30} color="black" />
            </View>
          </View>
          <Text style={styles.description}>Grade Viewer</Text>
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
            onSubmitEditing={() => {
              onPress()
            }}
            blurOnSubmit={false}
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
                fontFamily: 'Inter_500Medium',
                fontSize: 14,
                flexWrap: 'wrap',
                flex: 1
              }}
              numberOfLines={1}
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
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: Colors.secondary,
        marginVertical: 10
      }}
    ></View>
  )
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
    fontFamily: 'Montserrat_900Black',
    fontSize: 40
  },
  description: {
    fontFamily: 'RussoOne_400Regular',
    textAlign: 'center',
    fontSize: 20
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
  },
  dropdown_text_style: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16
  }
})
