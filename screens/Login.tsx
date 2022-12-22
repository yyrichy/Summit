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
import {
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  Feather
} from '@expo/vector-icons'
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
import { TextInput } from 'react-native-paper'
import AppIntroSlider from 'react-native-app-intro-slider'
import AsyncStorage from '@react-native-async-storage/async-storage'

type loginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Login'>

type loginInfo = 'username' | 'password' | 'district'

type District = {
  address: string
  name: string
  parentVueUrl: string
  latitude?: number
  longitude?: number
}

const Login = () => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<loginScreenProp>()
  const refInput = useRef(null)
  const { username, password, setUsername, setPassword, setClient, setMarks } =
    useContext(AppContext)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecked, setToggleCheckBox] = useState(false)
  const [isPasswordSecure, setIsPasswordSecure] = useState(true)

  const [isModalVisible, setModalVisible] = useState(false)
  const [isDistrictModalVisible, setDistrictModalVisible] = useState(false)

  const [selected, setSelected] = useState(null)
  const [districts, setDistricts] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(null)
  const [allDistricts, setAllDistricts] = useState(
    districtsFile.map((d, index) => {
      return { label: d.name, value: index }
    })
  )

  useAsyncEffect(async () => {
    try {
      const alreadyLaunched = await AsyncStorage.getItem('alreadyLaunched')
      if (alreadyLaunched === null) {
        setShowRealApp(false)
        await AsyncStorage.setItem('alreadyLaunched', 'true')
        return
      }
    } catch (e) {}

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

    if (!username || !password || !value) {
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
      setErrorMessage('Permission to access location was denied')
      setDistricts(null)
      return
    } else {
      setErrorMessage(null)
    }

    const { coords } = await Location.getCurrentPositionAsync()
    const { latitude, longitude } = coords
    const reverse = await Location.reverseGeocodeAsync({ latitude, longitude })
    try {
      var districtsFound: District[] = await StudentVue.findDistricts(
        reverse[0].postalCode
      )
    } catch (e) {
      let message = e.message
      switch (message) {
        case 'Please enter zip code. Missing zip code as expected parameters.':
          message = 'Zipcode not found'
          break
        case 'Please enter zip code with atleast 3 characters and not more than 5 characters.':
          message = 'Not in an US zipcode'
          break
      }
      setErrorMessage(message)
      return
    }
    districtsFound.forEach((d) => {
      const districtWithCoords = districtsFile.find(
        (i) => i.name === d.name || i.parentVueUrl === d.parentVueUrl
      )
      if (districtWithCoords) {
        d.latitude = districtWithCoords.latitude
        d.longitude = districtWithCoords.longitude
      }
    })
    const d = districtsFound.map((d) => ({
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
    if (d.length === 0) {
      setErrorMessage('No school districts found in your area')
      return
    }
    setDistricts(d)
  }

  const [showRealApp, setShowRealApp] = useState(true)

  const onDone = () => {
    setShowRealApp(true)
  }

  const onSkip = () => {
    setShowRealApp(true)
  }

  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: item.backgroundColor
        }}
      >
        <SafeAreaView>
          <Text style={styles.intro_title_style}>{item.title}</Text>
        </SafeAreaView>
        <SafeAreaView
          style={{
            alignItems: 'center',
            justifyContent: 'space-around',
            flex: 1
          }}
        >
          <MaterialCommunityIcons name={item.icon} size={120} />
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.intro_text_style}>{item.text}</Text>
            {item.github && (
              <FontAwesome.Button
                name="github"
                backgroundColor="transparent"
                iconStyle={{
                  color: Colors.black
                }}
                underlayColor="none"
                activeOpacity={0.2}
                size={36}
                onPress={() =>
                  Linking.openURL('https://github.com/vaporrrr/Summit')
                }
                style={{ padding: 0, marginTop: 8 }}
              ></FontAwesome.Button>
            )}
          </View>
        </SafeAreaView>
      </View>
    )
  }

  const renderNextButton = () => {
    return <Ionicons name="arrow-forward-circle-outline" size={48} />
  }
  const renderDoneButton = () => {
    return <Ionicons name="checkmark-circle-outline" size={48} />
  }

  const renderSkipButton = () => {
    return <Ionicons name="play-skip-forward-circle" size={48} />
  }

  if (!showRealApp) {
    return (
      <AppIntroSlider
        data={slides}
        renderItem={renderItem}
        onDone={onDone}
        showSkipButton={true}
        onSkip={onSkip}
        renderDoneButton={renderDoneButton}
        renderNextButton={renderNextButton}
        renderSkipButton={renderSkipButton}
      />
    )
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
            { padding: 15, marginTop: insets.top, marginBottom: insets.bottom }
          ]}
        >
          {errorMessage ? (
            <>
              <Text
                style={{
                  fontFamily: 'Montserrat_600SemiBold',
                  fontSize: 14,
                  marginBottom: 4
                }}
              >
                Error occured while automatically searching:
              </Text>
              <Text
                style={{
                  fontFamily: 'Inter_400Regular',
                  fontSize: 12,
                  marginBottom: 16
                }}
              >
                {errorMessage}
              </Text>
              {errorMessage === 'Permission to access location was denied' && (
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
                    onPress={() => {
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
              )}
            </>
          ) : (
            !districts && (
              <Text
                style={{
                  fontFamily: 'Inter_500Medium',
                  fontSize: 14,
                  marginBottom: 15
                }}
              >
                Waiting...
              </Text>
            )
          )}
          {districts && (
            <MaskedView
              style={{ flexShrink: 1, marginBottom: 15 }}
              maskElement={
                <LinearGradient
                  style={{ flexGrow: 1 }}
                  colors={[Colors.white, Colors.transparent]}
                  locations={[0.8, 1]}
                />
              }
            >
              <FadeInFlatList
                initialDelay={0}
                durationPerItem={350}
                parallelItems={5}
                itemsToFadeIn={20}
                data={districts}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setDistrictModalVisible(false)
                        setSelected(item)
                        setValue(
                          allDistricts.findIndex((d) => d.label === item.name)
                        )
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
                style={{ flexGrow: 0 }}
                contentContainerStyle={{ flexGrow: 0 }}
                ItemSeparatorComponent={Seperator}
              />
            </MaskedView>
          )}
          <Text
            style={{
              fontFamily: 'Inter_700Bold',
              fontSize: 20
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
                    setSelected(
                      districtsFile.find((d) => d.name === props.label)
                    )
                    setDistrictModalVisible(false)
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
          <TouchableOpacity
            style={styles.horizontal_container}
            onPress={() => setShowRealApp(false)}
          >
            <Text
              style={{
                textDecorationLine: 'underline',
                fontFamily: 'Inter_400Regular',
                fontSize: 14
              }}
            >
              Questions/Concerns?
            </Text>
            <Feather
              name="info"
              backgroundColor="transparent"
              iconStyle={{
                color: Colors.black
              }}
              underlayColor="none"
              activeOpacity={0.2}
              size={18}
              style={{
                padding: 0,
                marginLeft: 2
              }}
            ></Feather>
          </TouchableOpacity>
          <TextInput
            defaultValue={username}
            onChangeText={(u) => setUsername(u)}
            placeholder={'Username'}
            style={styles.input}
            returnKeyType={'next'}
            onSubmitEditing={() => refInput.current.focus()}
            blurOnSubmit={false}
            activeUnderlineColor={Colors.navy}
            textColor={Colors.black}
          />
          <TextInput
            defaultValue={password}
            onChangeText={(p) => setPassword(p)}
            placeholder={'Password'}
            secureTextEntry={isPasswordSecure}
            style={styles.input}
            returnKeyType={'next'}
            ref={refInput}
            onSubmitEditing={() => {
              onPress()
            }}
            blurOnSubmit={false}
            activeUnderlineColor={Colors.navy}
            right={
              <TextInput.Icon
                icon={isPasswordSecure ? 'eye-off-outline' : 'eye-outline'}
                style={{ marginRight: -2 }}
                onPress={() => setIsPasswordSecure(!isPasswordSecure)}
              />
            }
            textColor={Colors.black}
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
              marginBottom: 10,
              minHeight: 50
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
            >
              {selected ? selected.name : 'Find Your School District'}
            </Text>
            {!selected && (
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
  if (!x1 || !x2 || !y1 || !y2) return NaN
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

const slides = [
  {
    key: '1',
    title: 'Username and Password',
    text: "Students from any school that uses StudentVue can use this app. Username and password are the same as your school's website",
    icon: 'form-textbox-password',
    backgroundColor: Colors.primary
  },
  {
    key: '2',
    title: 'Safe and Open Source',
    text: "Your login info is sent directly to your schools website. Saving your username and password saves directly to your phone's storage. Code is open source on Github",
    github: 'https://github.com/vaporrrr/Summit',
    icon: 'lock',
    backgroundColor: Colors.dark_yellow
  }
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  horizontal_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 4
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
  checkbox_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  input: {
    width: 250,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: 'transparent',
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    paddingHorizontal: 10
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
  },
  intro_image_style: {
    width: 200,
    height: 200
  },
  intro_text_style: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 16,
    fontFamily: 'Inter_400Regular'
  },
  intro_title_style: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Montserrat_700Bold',
    marginTop: 16
  }
})
