import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppContext from '../contexts/AppContext'
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  BackHandler,
  ActivityIndicator,
  Dimensions
} from 'react-native'
import Document from 'studentvue/StudentVue/Document/Document'
import Doc from '../components/Document'
import { Colors } from '../colors/Colors'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { FadeInFlatList } from '@ja-ka/react-native-fade-in-flatlist'

const Documents = ({ navigation }) => {
  const { client } = useContext(AppContext)
  const [documents, setDocuments] = useState(undefined as Document[])

  useEffect(() => {
    onRefresh()

    const backAction = () => {
      navigation.goBack()
      return true
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )

    return () => backHandler.remove()
  }, [])

  const base64toBlob = (base64: string, sliceSize = 512): Blob => {
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

  const downloadDocument = async (document: Document): Promise<void> => {
    const file = (await document.get())[0]
    const fileName =
      document.comment.replace(/ /g, '_') +
      file.file.name.substring(file.file.name.lastIndexOf('.'))
    if (Platform.OS === 'web') {
      require('file-saver').saveAs(base64toBlob(file.base64), fileName)
    } else {
      const filePath = FileSystem.documentDirectory + fileName
      try {
        await FileSystem.writeAsStringAsync(filePath, file.base64, {
          encoding: 'base64'
        })
        await Sharing.shareAsync(filePath)
      } catch (e) {}
    }
  }

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      setDocuments(await client.documents())
    } catch (err) {}
    setRefreshing(false)
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <View style={styles.row_container}>
        <View style={styles.title_container}>
          <Text style={styles.title}>Documents</Text>
        </View>
        {Platform.OS === 'web' && (
          <View style={styles.refresh_button_container}>
            <FontAwesome.Button
              name="refresh"
              backgroundColor="transparent"
              iconStyle={{
                color: Colors.secondary
              }}
              underlayColor="none"
              activeOpacity={0.2}
              size={24}
              onPress={onRefresh}
            ></FontAwesome.Button>
          </View>
        )}
      </View>
      {documents ? (
        <FadeInFlatList
          initialDelay={0}
          durationPerItem={500}
          parallelItems={5}
          itemsToFadeIn={Dimensions.get('window').height / 50}
          data={documents}
          renderItem={({ item }) => (
            <Doc
              name={(item as Document).comment}
              type={(item as Document).file.type}
              date={(item as Document).file.date.toLocaleDateString()}
              onPress={() => {
                downloadDocument(item)
              }}
            ></Doc>
          )}
          keyExtractor={(item) => (item as Document).documentGu}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{
            paddingHorizontal: 7,
            paddingTop: 3.5
          }}
        />
      ) : (
        <ActivityIndicator
          color={Colors.secondary}
          animating={true}
          size="large"
          style={{
            alignSelf: 'center',
            flex: 1,
            justifyContent: 'center'
          }}
        />
      )}
    </SafeAreaView>
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
  }
})

export default Documents
