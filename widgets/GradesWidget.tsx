import React from 'react'
import { FlexWidget, TextWidget, IconWidget } from 'react-native-android-widget'
import { Gradebook } from 'studentvue'
import { parseCourseName } from '../gradebook/GradeUtil'
import { MD3LightTheme } from '../theme/MD3LightTheme'
import { formatAMPM } from '../util/Util'

interface GradesWidgetProps {
  gradebook?: Gradebook
  error?: string
}

export function GradesWidget({ gradebook, error }: GradesWidgetProps) {
  if (!gradebook && !error) {
    return (
      <FlexWidget
        style={{
          height: 'match_parent',
          width: 'match_parent',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderRadius: 28
        }}
        clickAction="OPEN_APP"
      >
        <TextWidget
          text={'Loading...'}
          style={{
            fontSize: 32,
            fontFamily: 'Inter',
            color: '#000000'
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
          backgroundColor: '#ffffff',
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
            color: '#000000'
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
        backgroundColor: '#ffffff',
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
            fontSize: 18
          }}
        />
        <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextWidget
            text={formatAMPM(new Date())}
            style={{
              fontSize: 12,
              marginRight: 6,
              //@ts-ignore
              color: MD3LightTheme.colors.onSurfaceVariant
            }}
          />
          <IconWidget clickAction="REFRESH" font="material" size={24} icon="refresh" />
        </FlexWidget>
      </FlexWidget>
      <FlexWidget
        style={{
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingTop: 7,
          backgroundColor: '#faf9f5',
          width: 'match_parent',
          flex: 1
        }}
      >
        {gradebook.courses.length >= 1 && <Course course={gradebook.courses[0]} />}
        {gradebook.courses.length >= 2 && <Course course={gradebook.courses[1]} />}
        {gradebook.courses.length >= 3 && <Course course={gradebook.courses[2]} />}
        {gradebook.courses.length >= 4 && <Course course={gradebook.courses[3]} />}
        {gradebook.courses.length >= 5 && <Course course={gradebook.courses[4]} />}
        {gradebook.courses.length >= 6 && <Course course={gradebook.courses[5]} />}
        {gradebook.courses.length >= 7 && <Course course={gradebook.courses[6]} />}
      </FlexWidget>
    </FlexWidget>
  )
}

const Course = ({ course }) => {
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
            textAlign: 'left'
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
            textAlign: 'right'
          }}
          maxLines={1}
        />
      )}
    </FlexWidget>
  )
}
