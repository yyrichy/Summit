import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppContext from '../contexts/AppContext'
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system'
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  ActivityIndicator,
  Dimensions
} from 'react-native'
import Document from 'studentvue/StudentVue/Document/Document'
import Doc from '../components/Document'
import { Colors } from '../colors/Colors'
import { FadeInFlatList } from '@ja-ka/react-native-fade-in-flatlist'

const Documents = () => {
  const { client } = useContext(AppContext)
  const [documents, setDocuments] = useState(undefined as Document[])

  useEffect(() => {
    onRefresh()
  }, [])

  const downloadDocument = async (document: Document): Promise<void> => {
    const file = (await document.get())[0]
    const fileName =
      document.comment.replace(/ /g, '_') +
      file.file.name.substring(file.file.name.lastIndexOf('.'))
    const filePath = FileSystem.documentDirectory + fileName
    try {
      await FileSystem.writeAsStringAsync(filePath, file.base64, {
        encoding: 'base64'
      })
      await Sharing.shareAsync(filePath)
    } catch (e) {}
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
      <View style={styles.title_container}>
        <Text style={styles.title}>Documents</Text>
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
