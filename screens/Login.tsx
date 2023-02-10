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
  TextInput as ReactNativeTextInput
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
import {
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons
} from '@expo/vector-icons'
import * as SecureStore from 'expo-secure-store'
import Modal from 'react-native-modal'
import useAsyncEffect from 'use-async-effect'
import { FadeInFlatList } from '@ja-ka/react-native-fade-in-flatlist'
import { Divider, TextInput } from 'react-native-paper'
import { toast } from '../util/Util'
import { SchoolDistrict } from 'studentvue/StudentVue/StudentVue.interfaces'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import BannerAd from '../components/BannerAd'

type loginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Login'>

type loginInfo = 'username' | 'password' | 'district'

const Login = () => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<loginScreenProp>()
  const refInput = useRef(null)
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)
  const { setClient, setMarks } = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecked, setToggleCheckBox] = useState(false)
  const [isPasswordSecure, setIsPasswordSecure] = useState(true)

  const [isDistrictModalVisible, setDistrictModalVisible] = useState(false)
  const [isQuestionsModalVisible, setQuestionsModalVisible] = useState(false)

  const [selectedDistrict, setSelectedDistrict] = useState(
    null as SchoolDistrict
  )
  const [districts, setDistricts] = useState(null as SchoolDistrict[])
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false)

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
    const district: SchoolDistrict = JSON.parse(await getValueFor('district'))

    if (!username || !password || !district) {
      return
    }

    setUsername(username)
    setPassword(password)
    setSelectedDistrict(district)
    setIsLoading(true)
    setToggleCheckBox(true)
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
            style={{
              backgroundColor: 'white',
              padding: 20,
              marginTop: insets.top,
              marginBottom: insets.bottom,
              borderRadius: 20,
              maxWidth: 350
            }}
          >
            <Text
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 14
              }}
            >
              Your username and password are the same as your school's
              StudentVue website.{'\n\n'}We do not collect your personal
              information nor can we access it remotely.
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
              padding: 20,
              marginTop: insets.top,
              marginBottom: insets.bottom,
              width: 350
            }
          ]}
        >
          <ReactNativeTextInput
            style={[styles.input, { marginBottom: 0, width: 300 }]}
            placeholder="Enter zipcode"
            keyboardType="number-pad"
            returnKeyType="done"
            onSubmitEditing={({ nativeEvent: { text } }) => onSearch(text)}
            placeholderTextColor={Colors.medium_gray}
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
                const selected =
                  selectedDistrict && selectedDistrict.name === item.name
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setDistrictModalVisible(false)
                      setSelectedDistrict(item)
                    }}
                    style={[
                      selected && {
                        backgroundColor: Colors.off_white,
                        padding: 8,
                        borderRadius: 5
                      }
                    ]}
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
                        fontSize: 14,
                        color: Colors.onyx_gray,
                        marginTop: 2
                      }}
                    >
                      {item.address}
                    </Text>
                  </TouchableOpacity>
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
                  No school districts found, did you enter the zipcode of your
                  school district?
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
        source={require('../assets/mountainbackground.png')}
        resizeMode="cover"
        style={{
          flex: 1,
          backgroundColor: Colors.white
        }}
      >
        <SafeAreaView
          style={{ alignItems: 'center' }}
          edges={['top', 'left', 'right']}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text style={styles.name}>GradeHelper</Text>
          </View>
        </SafeAreaView>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View>
            <TouchableOpacity
              style={[
                {
                  height: 48,
                  alignItems: 'center',
                  padding: 10,
                  justifyContent: 'flex-end',
                  alignSelf: 'center'
                }
              ]}
              onPress={() => setQuestionsModalVisible(true)}
            >
              <Text
                style={{
                  fontFamily: 'Inter_400Regular'
                }}
              >
                Questions/Concerns
              </Text>
            </TouchableOpacity>
            <TextInput
              defaultValue={username}
              onChangeText={(u) => setUsername(u)}
              placeholder={'Username'}
              style={styles.input}
              textColor={Colors.black}
              placeholderTextColor={Colors.medium_gray}
              returnKeyType={'next'}
              onSubmitEditing={() => refInput.current.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              defaultValue={password}
              onChangeText={(p) => setPassword(p)}
              placeholder={'Password'}
              secureTextEntry={isPasswordSecure}
              style={styles.input}
              textColor={Colors.black}
              placeholderTextColor={Colors.medium_gray}
              returnKeyType={'next'}
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
                  iconColor={Colors.black}
                />
              }
            />
            <TouchableOpacity
              style={{
                width: 250,
                flexDirection: 'row',
                borderWidth: 1,
                borderRadius: 4,
                padding: 10,
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
                minHeight: 50
              }}
              onPress={async () => onPressOpenDistrictModal()}
            >
              <Text
                style={{
                  fontFamily: 'Inter_500Medium',
                  fontSize: 14,
                  flexWrap: 'wrap',
                  flex: 1
                }}
              >
                {selectedDistrict
                  ? selectedDistrict.name
                  : 'Find Your School District'}
              </Text>
              {!selectedDistrict && (
                <MaterialCommunityIcons
                  name="school-outline"
                  size={24}
                  color="black"
                  style={{ marginRight: 2 }}
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
              />
              <Text style={styles.save_text}>Remember Me</Text>
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
        <View style={{ alignSelf: 'flex-end' }}>
          <View style={styles.row_container}>
            <TouchableOpacity
              style={styles.insta_button_container}
              onPress={() => openInstagram('richardyin99')}
            >
              <MaterialCommunityIcons
                name="instagram"
                backgroundColor="transparent"
                iconStyle={styles.insta_button}
                underlayColor="none"
                activeOpacity={0.2}
                size={20}
              />
              <Text style={styles.insta_text}>Richard Y</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.insta_button_container}
              onPress={() => openInstagram('karthik.whynot')}
            >
              <MaterialCommunityIcons
                name="instagram"
                backgroundColor="transparent"
                iconStyle={styles.insta_button}
                underlayColor="none"
                activeOpacity={0.2}
                size={20}
              />
              <Text style={styles.insta_text}>Karthik M</Text>
            </TouchableOpacity>
          </View>
          <SafeAreaView edges={['bottom', 'left', 'right']}>
            <BannerAd />
          </SafeAreaView>
        </View>
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
    backgroundColor: 'white',
    borderRadius: 20
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
    marginLeft: 5,
    marginBottom: 3
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
    marginBottom: 10,
    alignSelf: 'flex-start'
  },
  input: {
    width: 250,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
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
    borderRadius: 4
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
    borderRadius: 25,
    borderWidth: 0,
    width: 250,
    height: 50
  },
  save_text: {
    fontFamily: 'Inter_400Regular',
    marginLeft: 10
  },
  row_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15
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
