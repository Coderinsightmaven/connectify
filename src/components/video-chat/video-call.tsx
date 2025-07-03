"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { PLACEHOLDER_AVATAR } from "@/lib/placeholders"

interface VideoCallProps {
  className?: string
  isInCall?: boolean
  onEndCall?: () => void
  onStartCall?: () => void
  participantName?: string
  participantAvatar?: string
}

export function VideoCall({ 
  className, 
  isInCall = false, 
  onEndCall, 
  onStartCall,
  participantName = "John Doe",
  participantAvatar = PLACEHOLDER_AVATAR
}: VideoCallProps) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [callDuration, setCallDuration] = useState(0)
  
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  // Timer for call duration
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isInCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    } else {
      setCallDuration(0)
    }
    return () => clearInterval(interval)
  }, [isInCall])

  // Get user media
  const getUserMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      setStream(mediaStream)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Error accessing media devices:', error)
    }
  }

  // Start call
  const handleStartCall = async () => {
    await getUserMedia()
    onStartCall?.()
  }

  // End call
  const handleEndCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    onEndCall?.()
  }

  // Toggle video
  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled
        setIsVideoEnabled(!isVideoEnabled)
      }
    }
  }

  // Toggle audio
  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled
        setIsAudioEnabled(!isAudioEnabled)
      }
    }
  }

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        // Stop screen sharing, go back to camera
        await getUserMedia()
        setIsScreenSharing(false)
      } else {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        })
        setStream(screenStream)
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream
        }
        setIsScreenSharing(true)
      }
    } catch (error) {
      console.error('Error with screen sharing:', error)
    }
  }

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!isInCall) {
    return (
      <div className={cn("flex items-center justify-center h-full", className)}>
        <Card variant="elevated" className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-6">
            <div className="space-y-4">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage src={participantAvatar} alt={participantName} />
                <AvatarFallback className="text-2xl">
                  {participantName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{participantName}</h3>
                <p className="text-sm text-muted-foreground">Ready to video chat</p>
              </div>
            </div>
            
            <div className="flex gap-3 justify-center">
              <Button onClick={handleStartCall} size="lg" className="flex-1">
                <Icons.video className="h-4 w-4 mr-2" />
                Start Video Call
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col h-full bg-black relative", className)}>
      {/* Call Header */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-medium">
              {formatDuration(callDuration)}
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
            <span className="text-white text-sm">{participantName}</span>
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="flex-1 relative">
        {/* Remote Video (Main) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />
        
        {/* Remote Video Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center space-y-4">
            <Avatar className="h-32 w-32 mx-auto">
              <AvatarImage src={participantAvatar} alt={participantName} />
              <AvatarFallback className="text-4xl">
                {participantName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-white">
              <h3 className="text-xl font-semibold">{participantName}</h3>
              <p className="text-sm text-gray-300">Camera is off</p>
            </div>
          </div>
        </div>

        {/* Local Video (Picture in Picture) */}
        <div className="absolute bottom-20 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20">
          {isVideoEnabled ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <Avatar className="h-16 w-16">
                <AvatarImage src={PLACEHOLDER_AVATAR} alt="You" />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>

      {/* Call Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-4 bg-black/70 backdrop-blur-sm rounded-2xl px-6 py-4">
          {/* Mute Audio */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAudio}
            className={cn(
              "h-12 w-12 rounded-full",
              isAudioEnabled 
                ? "bg-white/20 text-white hover:bg-white/30" 
                : "bg-red-500 text-white hover:bg-red-600"
            )}
          >
            {isAudioEnabled ? (
              <Icons.mic className="h-5 w-5" />
            ) : (
              <Icons.micOff className="h-5 w-5" />
            )}
          </Button>

          {/* End Call */}
          <Button
            variant="destructive"
            size="icon"
            onClick={handleEndCall}
            className="h-12 w-12 rounded-full bg-red-500 hover:bg-red-600"
          >
            <Icons.phoneOff className="h-5 w-5" />
          </Button>

          {/* Toggle Video */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleVideo}
            className={cn(
              "h-12 w-12 rounded-full",
              isVideoEnabled 
                ? "bg-white/20 text-white hover:bg-white/30" 
                : "bg-red-500 text-white hover:bg-red-600"
            )}
          >
            {isVideoEnabled ? (
              <Icons.video className="h-5 w-5" />
            ) : (
              <Icons.videoOff className="h-5 w-5" />
            )}
          </Button>

          {/* Screen Share */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleScreenShare}
            className={cn(
              "h-12 w-12 rounded-full",
              isScreenSharing 
                ? "bg-blue-500 text-white hover:bg-blue-600" 
                : "bg-white/20 text-white hover:bg-white/30"
            )}
          >
            <Icons.monitor className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
} 