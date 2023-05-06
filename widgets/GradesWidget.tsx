import React from 'react'
import { FlexWidget, TextWidget, IconWidget } from 'react-native-android-widget'
import { Gradebook } from 'studentvue'
import { parseCourseName } from '../gradebook/GradeUtil'
import { MD3DarkTheme } from '../theme/MD3DarkTheme'
import { MD3LightTheme } from '../theme/MD3LightTheme'
import { formatAMPM } from '../util/Util'

interface GradesWidgetProps {
  gradebook?: Gradebook
  error?: string
  dark?: boolean
}

const background = '#1d1d1d'

export function GradesWidget({ gradebook, error, dark }: GradesWidgetProps) {
  if (!gradebook && !error) {
    return (
      <FlexWidget
        style={{
          height: 'match_parent',
          width: 'match_parent',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: dark ? background : '#ffffff',
          borderRadius: 28
        }}
        clickAction="OPEN_APP"
      >
        <TextWidget
          text={'Loading...'}
          style={{
            fontSize: 32,
            fontFamily: 'Inter',
            color: dark ? '#ffffff' : '#000000'
          }}
        />
      </FlexWidget>
    )
  }

  if (error) {
    return (
      <FlexWidget
        style={{
          height: 'match_parent',
          width: 'match_parent',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: dark ? background : '#ffffff',
          borderRadius: 28,
          padding: 20
        }}
        clickAction="OPEN_APP"
      >
        <TextWidget
          text={error}
          style={{
            fontSize: 20,
            fontFamily: 'Inter',
            color: dark ? '#ffffff' : '#000000'
          }}
        />
        <IconWidget clickAction="REFRESH" font="material" size={40} icon="refresh" />
      </FlexWidget>
    )
  }

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: dark ? background : '#ffffff',
        borderRadius: 28,
        padding: 16
      }}
      clickAction="OPEN_APP"
    >
      <FlexWidget
        style={{
          flexDirection: 'row',
          marginBottom: 4,
          width: 'match_parent',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <TextWidget
          text={gradebook.reportingPeriod.current.name}
          style={{
            fontSize: 18,
            color: dark ? '#ffffff' : '#000000'
          }}
        />
        <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextWidget
            text={formatAMPM(new Date())}
            style={{
              fontSize: 12,
              marginRight: 8,
              //@ts-ignore
              color: dark
                ? MD3DarkTheme.colors.onSurfaceVariant
                : MD3LightTheme.colors.onSurfaceVariant
            }}
          />
          <IconWidget
            clickAction="REFRESH"
            font="material"
            size={24}
            icon="refresh"
            style={{ color: dark ? '#ffffff' : '#000000', marginRight: 8 }}
          />
          <IconWidget
            clickAction={dark ? 'LIGHT_MODE' : 'DARK_MODE'}
            font="material"
            size={24}
            icon="brightness_6"
            style={{ color: dark ? '#ffffff' : '#000000' }}
            clickActionData={{ dark: dark }}
          />
        </FlexWidget>
      </FlexWidget>
      <FlexWidget
        style={{
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingTop: 7,
          backgroundColor: dark ? '#2D2D2D' : '#f6f6f6',
          width: 'match_parent',
          flex: 1
        }}
      >
        {gradebook.courses.length >= 1 && <Course course={gradebook.courses[0]} dark={dark} />}
        {gradebook.courses.length >= 2 && <Course course={gradebook.courses[1]} dark={dark} />}
        {gradebook.courses.length >= 3 && <Course course={gradebook.courses[2]} dark={dark} />}
        {gradebook.courses.length >= 4 && <Course course={gradebook.courses[3]} dark={dark} />}
        {gradebook.courses.length >= 5 && <Course course={gradebook.courses[4]} dark={dark} />}
        {gradebook.courses.length >= 6 && <Course course={gradebook.courses[5]} dark={dark} />}
        {gradebook.courses.length >= 7 && <Course course={gradebook.courses[6]} dark={dark} />}
      </FlexWidget>
    </FlexWidget>
  )
}

const Course = ({ course, dark }) => {
  return (
    <FlexWidget
      style={{
        flexDirection: 'row',
        width: 'match_parent',
        marginTop: 1
      }}
      key={course.title}
    >
      <FlexWidget style={{ marginRight: 10, flex: 1 }}>
        <TextWidget
          text={parseCourseName(course.title)}
          style={{
            fontSize: 14,
            textAlign: 'left',
            color: dark ? '#ffffff' : '#000000'
          }}
          maxLines={1}
          truncate={'END'}
        />
      </FlexWidget>
      {course.marks[0].calculatedScore.string !== 'N/A' && (
        <TextWidget
          text={`${course.marks[0].calculatedScore.raw}`}
          style={{
            fontSize: 14,
            textAlign: 'right',
            color: dark ? '#ffffff' : '#000000'
          }}
          maxLines={1}
        />
      )}
    </FlexWidget>
  )
}
