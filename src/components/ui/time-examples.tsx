"use client"

import { TimeAgo, FormattedDate, Time } from "./time"
import { useTime } from "@/hooks/use-time"
import { Card, CardContent, CardHeader, CardTitle } from "./card"

export function TimeExamples() {
  const { formatTimeAgo, formatDate, formatTime, getRelativeTime, isToday } = useTime()
  
  const now = new Date()
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const lastYear = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Time Formatting Examples</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div>
            <h4 className="font-medium mb-2">Time Ago (React Component)</h4>
            <div className="space-y-1 text-sm">
              <div>Now: <TimeAgo date={now} className="font-mono" /></div>
              <div>1 hour ago: <TimeAgo date={oneHourAgo} className="font-mono" /></div>
              <div>Yesterday: <TimeAgo date={yesterday} className="font-mono" /></div>
              <div>Last week: <TimeAgo date={lastWeek} className="font-mono" /></div>
              <div>Last year: <TimeAgo date={lastYear} className="font-mono" /></div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Formatted Dates</h4>
            <div className="space-y-1 text-sm">
              <div>Default: <FormattedDate date={now} className="font-mono" /></div>
              <div>Short: <FormattedDate date={now} format="MMM DD" className="font-mono" /></div>
              <div>Long: <FormattedDate date={now} format="dddd, MMMM Do YYYY" className="font-mono" /></div>
              <div>With time: <FormattedDate date={now} format="MMM DD, YYYY h:mm A" className="font-mono" /></div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Hook Functions</h4>
            <div className="space-y-1 text-sm">
              <div>formatTimeAgo: <span className="font-mono">{formatTimeAgo(oneHourAgo)}</span></div>
              <div>formatDate: <span className="font-mono">{formatDate(now)}</span></div>
              <div>formatTime: <span className="font-mono">{formatTime(now)}</span></div>
              <div>getRelativeTime: <span className="font-mono">{getRelativeTime(yesterday)}</span></div>
              <div>isToday: <span className="font-mono">{isToday(now).toString()}</span></div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Flexible Time Component</h4>
            <div className="space-y-1 text-sm">
              <div>From now: <Time date={oneHourAgo} fromNow className="font-mono" /></div>
              <div>Formatted: <Time date={now} fromNow={false} format="MMMM Do, YYYY" className="font-mono" /></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 