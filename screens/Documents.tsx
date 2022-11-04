import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppContext from '../contexts/AppContext'
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system'
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl
} from 'react-native'
import Document from 'studentvue/StudentVue/Document/Document'
import Doc from '../components/Document'
import { Colors } from '../colors/Colors'
import FontAwesome from '@expo/vector-icons/FontAwesome'

const Documents = () => {
  const { client } = useContext(AppContext)
  const [documents, setDocuments] = useState(undefined as Document[])

  useEffect(() => {
    onRefresh()
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
    <SafeAreaView style={{ flex: 1 }}>
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
              activeOpacity={0.5}
              size={24}
              onPress={onRefresh}
            ></FontAwesome.Button>
          </View>
        )}
      </View>
      {documents && (
        <FlatList
          data={documents}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                downloadDocument(item)
              }}
              activeOpacity={0.5}
            >
              <Doc
                name={(item as Document).comment}
                type={(item as Document).file.type}
                date={(item as Document).file.date.toLocaleDateString()}
              ></Doc>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => (item as Document).documentGu}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        ></FlatList>
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
