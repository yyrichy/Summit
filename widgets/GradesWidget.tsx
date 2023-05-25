import React from 'react'
import { FlexWidget, TextWidget, IconWidget, ListWidget } from 'react-native-android-widget'
import { Gradebook } from 'studentvue'
import { parseCourseName } from '../gradebook/GradeUtil'
import { MD3DarkTheme } from '../theme/MD3DarkTheme'
import { MD3LightTheme } from '../theme/MD3LightTheme'
import { formatAMPM } from '../util/Util'

interface GradesWidgetProps {
  gradebook?: Gradebook
  error?: string
  dark: boolean
}

export function GradesWidget({ gradebook, error, dark }: GradesWidgetProps) {
  const backgroundColor = dark ? '#1d1d1d' : '#ffffff'
  const textColor = dark ? '#ffffff' : '#000000'

  if (!gradebook && !error) {
    return (
      <FlexWidget
        style={{
          height: 'match_parent',
          width: 'match_parent',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: backgroundColor,
          borderRadius: 28
        }}
        clickAction="OPEN_APP"
      >
        <TextWidget
          text={'Loading...'}
          style={{
            fontSize: 32,
            fontFamily: 'Inter',
            color: textColor
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
          backgroundColor: backgroundColor,
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
            color: textColor
          }}
        />
        <IconWidget
          clickAction="REFRESH"
          font="material"
          size={40}
          icon="refresh"
          style={{ color: textColor }}
        />
      </FlexWidget>
    )
  }

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: backgroundColor,
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
            color: textColor
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
            style={{ color: textColor, marginRight: 8 }}
          />
          <IconWidget
            clickAction={'TOGGLE_THEME'}
            font="material"
            size={22}
            icon="brightness_6"
            style={{ color: textColor }}
            clickActionData={{ dark: dark }}
          />
        </FlexWidget>
      </FlexWidget>
      <FlexWidget
        style={{
          borderRadius: 12,
          paddingTop: 6,
          backgroundColor: dark ? '#2D2D2D' : '#f6f6f6',
          width: 'match_parent',
          height: 'match_parent'
        }}
      >
        <ListWidget style={{ width: 'match_parent', height: 'match_parent' }}>
          {gradebook.courses.map((c, i) => (
            <Course course={c} textColor={textColor} key={i} />
          ))}
        </ListWidget>
      </FlexWidget>
    </FlexWidget>
  )
}

const Course = ({ course, textColor, key }) => {
  return (
    <FlexWidget
      style={{
        flexDirection: 'row',
        width: 'match_parent',
        paddingVertical: 2,
        marginHorizontal: 12
      }}
      key={key}
      clickAction="OPEN_APP"
    >
      <FlexWidget style={{ marginRight: 10, flex: 1 }}>
        <TextWidget
          text={parseCourseName(course.title)}
          style={{
            fontSize: 16,
            textAlign: 'left',
            color: textColor
          }}
          maxLines={1}
          truncate={'END'}
        />
      </FlexWidget>
      {course.marks[0].calculatedScore.string !== 'N/A' && (
        <TextWidget
          text={`${course.marks[0].calculatedScore.raw}`}
          style={{
            fontSize: 16,
            textAlign: 'right',
            color: textColor,
            fontWeight: '600'
          }}
          maxLines={1}
        />
      )}
    </FlexWidget>
  )
}
