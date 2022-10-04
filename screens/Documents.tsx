import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppContext from '../contexts/AppContext'
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system'
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native'
import Document from 'studentvue/StudentVue/Document/Document'
import Doc from '../components/Document'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Colors } from '../colors/Colors'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { showMessage } from 'react-native-flash-message'
import AwesomeAlert from 'react-native-awesome-alerts'

const Documents = () => {
  const { client } = useContext(AppContext)
  const [documents, setDocuments] = useState(undefined as Document[])
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState()

  const fetchDocuments = async () => {
    setIsLoading(true)
    try {
      setDocuments(await client.documents())
    } catch (err) {
      setErrorMessage(err.message)
      setShowAlert(true)
    }
    setIsLoading(false)
  }
  if (!documents && !isLoading) fetchDocuments()

  const base64toBlob = (base64: string, sliceSize = 512) => {
    const byteCharacters = window.atob(base64)
    const byteArrays = []
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize)
      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }
      byteArrays.push(new Uint8Array(byteNumbers))
    }
    return new Blob(byteArrays)
  }

  const downloadDocument = async (document: Document) => {
    const file = (await document.get())[0]
    const fileName =
      document.comment.replace(/ /g, '_') +
      file.file.name.substring(file.file.name.lastIndexOf('.'))
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      const filePath = FileSystem.documentDirectory + fileName
      try {
        await FileSystem.writeAsStringAsync(filePath, file.base64, {
          encoding: 'base64'
        })
        await Sharing.shareAsync(filePath)
      } catch (e) {}
    } else {
      require('file-saver').saveAs(base64toBlob(file.base64), fileName)
    }
  }

  return (
    <>
      <SafeAreaView
        style={{ flex: 1 }}
        pointerEvents={isLoading ? 'none' : 'auto'}
      >
        <View style={styles.row_container}>
          <View style={styles.title_container}>
            <Text style={styles.title}>Documents</Text>
          </View>
          <View style={styles.refresh_button_container}>
            <FontAwesome.Button
              name="refresh"
              backgroundColor="transparent"
              iconStyle={{
                color: Colors.secondary
              }}
              underlayColor="none"
              activeOpacity={0.5}
              size={24}
              onPress={async () => {
                try {
                  setDocuments(await client.documents())
                  showMessage({
                    message: 'Refreshed',
                    type: 'info',
                    icon: 'success'
                  })
                } catch (err) {
                  setErrorMessage(err.message)
                  setShowAlert(true)
                }
              }}
            ></FontAwesome.Button>
          </View>
        </View>
        {documents && (
          <FlatList
            data={documents}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  downloadDocument(item)
                }}
              >
                <Doc
                  name={(item as Document).comment}
                  type={(item as Document).file.type}
                  date={(item as Document).file.date.toLocaleDateString()}
                ></Doc>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => (item as Document).documentGu}
          ></FlatList>
        )}
      </SafeAreaView>
      {isLoading && (
        <SafeAreaView style={styles.loading}>
          <ActivityIndicator size={'large'} />
        </SafeAreaView>
      )}
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

const styles = StyleSheet.create({
  row_container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title_container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '75%'
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 30,
    marginHorizontal: 11
  },
  refresh_button_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(200, 200, 200, 0.2)'
  }
})

export default Documents
