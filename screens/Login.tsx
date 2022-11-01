import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  Linking,
  ImageBackground
} from 'react-native'
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
import AwesomeAlert from 'react-native-awesome-alerts'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import DropDownPicker from 'react-native-dropdown-picker'
import { SchoolDistrict } from 'studentvue/StudentVue/StudentVue.interfaces'
import { useCookies } from 'react-cookie'
import * as SecureStore from 'expo-secure-store'
import { FontAwesome5 } from '@expo/vector-icons'
import Modal from 'react-native-modal'
import District from '../components/District'

type loginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Login'>

type loginInfo = 'username' | 'password' | 'district'

const Login = () => {
  const navigation = useNavigation<loginScreenProp>()
  const refInput = useRef<TextInput | null>(null)
  const { username, password, setUsername, setPassword, setClient, setMarks } =
    useContext(AppContext)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecked, setToggleCheckBox] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState(undefined as string)

  const [firstLaunch, setFirstLaunch] = useState(false)

  const [isModalVisible, setModalVisible] = useState(false)

  const [cookies, setCookie, removeCookie] = useCookies([
    'username',
    'password',
    'district'
  ] as loginInfo[])

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(undefined as string)
  const [list, setList] = useState(
    require('../assets/districts.json').map((d: SchoolDistrict) => {
      return { label: d.name, value: d.name }
    })
  )

  useEffect(() => {
    savedCredentials()
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
    setValue(value)
    setIsLoading(true)
    setToggleCheckBox(true)
    try {
      const client = await StudentVue.login(
        require('../assets/districts.json').find(
          (d: SchoolDistrict) => d.name === value
        ).parentVueUrl,
        {
          username: username,
          password: password
        }
      )
      const gradebook = await client.gradebook()
      const marks = await convertGradebook(gradebook)
      setClient(client)
      setMarks(marks)
    } catch (err) {
      setIsLoading(false)
      alert(err.message)
      return
    }
    setIsLoading(false)
    navigation.navigate('Menu')
  }

  function alert(message: string): void {
    setErrorMessage(message)
    setShowAlert(true)
  }

  async function onLogin(): Promise<void> {
    if (!username) {
      alert('Enter your username')
      return
    }
    if (!password) {
      alert('Enter your password')
      return
    }
    if (!value) {
      alert('Select your school district')
      return
    }
    setIsLoading(true)
    try {
      const client = await StudentVue.login(
        require('../assets/districts.json').find(
          (d: SchoolDistrict) => d.name === value
        ).parentVueUrl,
        {
          username: username,
          password: password
        }
      )
      const gradebook = await client.gradebook()
      const marks = await convertGradebook(gradebook)
      setClient(client)
      setMarks(marks)
    } catch (err) {
      setIsLoading(false)
      alert(err.message)
      return
    }
    if (isChecked) {
      save('username', username)
      save('password', password)
      save('district', value)
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

  return (
    <>
      <Modal
        isVisible={isModalVisible}
        coverScreen={true}
        onBackdropPress={() => setModalVisible(!isModalVisible)}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
      >
        <View style={styles.modal}>
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
              activeOpacity={0.5}
              size={25}
              onPress={() =>
                Linking.openURL('https://github.com/vaporrrr/Summit')
              }
            ></FontAwesome.Button>
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
                  activeOpacity={0.5}
                  size={18}
                  onPress={() => setModalVisible(true)}
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
            returnKeyType="next"
            onSubmitEditing={() => refInput.current.focus()}
            blurOnSubmit={false}
          />
          <TextInput
            defaultValue={password}
            onChangeText={(p) => setPassword(p)}
            placeholder={'Password'}
            secureTextEntry={true}
            style={styles.input}
            returnKeyType="next"
            ref={refInput}
            onSubmitEditing={() => setOpen(true)}
          />
          <DropDownPicker
            searchable={true}
            open={open}
            value={value}
            items={list}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setList}
            dropDownDirection={'BOTTOM'}
            style={styles.dropdown}
            textStyle={styles.dropdown_text}
            containerStyle={styles.dropdown_container}
            listMode={'FLATLIST'}
            translation={{
              SEARCH_PLACEHOLDER: 'Enter School District Name',
              PLACEHOLDER: 'Select School District',
              NOTHING_TO_SHOW:
                'Nothing found, make sure you are entering your DISTRICT NAME not SCHOOL NAME'
            }}
            tickIconStyle={styles.dropdown_tick}
            listItemLabelStyle={styles.dropdown_item}
            searchContainerStyle={styles.dropdown_search_container}
            searchTextInputStyle={styles.dropdown_search_text}
            listItemContainerStyle={styles.dropdown_list_item_container}
            renderListItem={(props) => {
              return (
                <District
                  {...props}
                  onPress={() => {
                    setValue(props.value)
                    setOpen(false)
                  }}
                ></District>
              )
            }}
            props={{
              activeOpacity: 0.5
            }}
          ></DropDownPicker>
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
              activeOpacity={0.5}
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
              activeOpacity={0.5}
              size={28}
              onPress={() => openInstagram('karthik.whynot')}
            ></FontAwesome.Button>
            <Text style={styles.insta_text}>Karthik M</Text>
          </View>
        </View>
      </ImageBackground>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={'Error'}
        message={errorMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={true}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText={'Ok'}
        confirmButtonColor={Colors.primary}
        confirmButtonTextStyle={{ color: Colors.black }}
        onConfirmPressed={() => {
          setShowAlert(false)
        }}
      ></AwesomeAlert>
    </>
  )
}

export default Login

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
    marginTop: 10
  },
  modal: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    width: 250,
    height: 140
  },
  modal_view: {
    width: 250,
    height: 140,
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
    marginBottom: 10
  },
  security: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    marginTop: 8
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
