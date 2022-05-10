import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Client, DocumentFile } from 'studentvue'
import AppContext from '../contexts/AppContext'
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native'
import Document from 'studentvue/StudentVue/Document/Document'
import DocumentComponent from '../components/Document'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Colors } from '../colors/Colors'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { showMessage } from 'react-native-flash-message'

const Documents = () => {
  const { client } = useContext(AppContext)
  const [documents, setDocuments] = useState(undefined)
  const fetchDocuments = async () => {
    const docs = []
    try {
      const documents = await (client as Client).documents()
      for (const document of documents) {
        docs.push({ document: document, files: await document.get() })
      }
    } catch (err) {
      Alert.alert('Error', err.message)
      return false
    }
    setDocuments(docs)
    return true
  }
  if (documents === undefined) fetchDocuments()

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
              setDocuments(undefined)
              if (await fetchDocuments()) {
                showMessage({
                  message: 'Documents refreshed',
                  type: 'info',
                  icon: 'success'
                })
              }
            }}
          ></FontAwesome.Button>
        </View>
      </View>
      {documents == undefined ? (
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
      ) : (
        <FlatList
          data={documents}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={async () => {
                const file = item.files[0] as DocumentFile
                const document = item.document as Document
                const filePath =
                  FileSystem.documentDirectory +
                  document.comment.replaceAll(' ', '_') +
                  file.file.name.substring(file.file.name.lastIndexOf('.'))
                try {
                  await FileSystem.writeAsStringAsync(filePath, file.base64, {
                    encoding: 'base64'
                  })
                  await Sharing.shareAsync(filePath)
                } catch (e) {}
              }}
            >
              <DocumentComponent
                name={(item.document as Document).comment}
                type={(item.document as Document).file.type}
                date={(
                  item.document as Document
                ).file.date.toLocaleDateString()}
              ></DocumentComponent>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => (item.document as Document).documentGu}
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
