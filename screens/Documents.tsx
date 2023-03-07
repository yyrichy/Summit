import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppContext from '../contexts/AppContext'
import * as FileSystem from 'expo-file-system'
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Alert
} from 'react-native'
import Document from 'studentvue/StudentVue/Document/Document'
import Doc from '../components/Document'
import { Colors } from '../colors/Colors'
import { FadeInFlatList } from '@ja-ka/react-native-fade-in-flatlist'
import { useTheme } from 'react-native-paper'
import FileViewer from 'react-native-file-viewer'

const Documents = () => {
  const { client } = useContext(AppContext)
  const [documents, setDocuments] = useState(null as Document[])
  const theme = useTheme()

  useEffect(() => {
    onRefresh()
  }, [])

  const downloadDocument = async (document: Document) => {
    const file = (await document.get())[0]
    const fileName =
      document.comment.replace(/ /g, '_') +
      file.file.name.substring(file.file.name.lastIndexOf('.'))
    const filePath = FileSystem.documentDirectory + fileName
    try {
      await FileSystem.writeAsStringAsync(filePath, file.base64, {
        encoding: 'base64'
      })
      FileViewer.open(filePath)
    } catch (err) {
      Alert.alert(err.message)
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
      <View style={styles.title_container}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>Documents</Text>
      </View>
      {documents ? (
        <FadeInFlatList
          initialDelay={0}
          durationPerItem={300}
          parallelItems={5}
          itemsToFadeIn={Dimensions.get('window').height / 50}
          data={documents}
          renderItem={({ item }) => (
            <Doc
              name={(item as Document).comment}
              type={(item as Document).file.type}
              date={(item as Document).file.date}
              onPress={() => downloadDocument(item)}
            />
          )}
          keyExtractor={(item: Document) => item.file.name + item.documentGu}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingTop: 4
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
    marginHorizontal: 10
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 30
  },
  refresh_button_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
})

export default Documents
