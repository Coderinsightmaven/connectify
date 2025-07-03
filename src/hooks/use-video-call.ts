import { useState, useRef, useCallback, useEffect } from 'react'

export interface CallState {
  isInCall: boolean
  isConnecting: boolean
  callDuration: number
  connectionState: 'disconnected' | 'connecting' | 'connected' | 'failed'
}

export interface MediaState {
  isVideoEnabled: boolean
  isAudioEnabled: boolean
  isScreenSharing: boolean
  localStream: MediaStream | null
  remoteStream: MediaStream | null
}

export interface CallParticipant {
  id: string
  name: string
  avatar?: string
}

export function useVideoCall() {
  // Call state
  const [callState, setCallState] = useState<CallState>({
    isInCall: false,
    isConnecting: false,
    callDuration: 0,
    connectionState: 'disconnected'
  })

  // Media state
  const [mediaState, setMediaState] = useState<MediaState>({
    isVideoEnabled: true,
    isAudioEnabled: true,
    isScreenSharing: false,
    localStream: null,
    remoteStream: null
  })

  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const callTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize peer connection
  const initializePeerConnection = useCallback(() => {
    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // Add TURN servers here for production
      ]
    }

    const peerConnection = new RTCPeerConnection(configuration)

    peerConnection.oniceconnectionstatechange = () => {
      const state = peerConnection.iceConnectionState
      setCallState(prev => ({
        ...prev,
        connectionState: state === 'connected' || state === 'completed' 
          ? 'connected' 
          : state === 'failed' || state === 'disconnected'
          ? 'disconnected'
          : 'connecting'
      }))
    }

    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams
      setMediaState(prev => ({ ...prev, remoteStream }))
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream
      }
    }

    peerConnectionRef.current = peerConnection
    return peerConnection
  }, [])

  // Get user media
  const getUserMedia = useCallback(async (constraints: MediaStreamConstraints = { video: true, audio: true }) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      setMediaState(prev => ({ ...prev, localStream: stream }))
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // Add tracks to peer connection if it exists
      if (peerConnectionRef.current) {
        stream.getTracks().forEach(track => {
          peerConnectionRef.current?.addTrack(track, stream)
        })
      }

      return stream
    } catch (error) {
      console.error('Error accessing media devices:', error)
      throw error
    }
  }, [])

  // Start call
  const startCall = useCallback(async (participant: CallParticipant) => {
    try {
      setCallState(prev => ({ ...prev, isConnecting: true, connectionState: 'connecting' }))
      
              // Initialize peer connection
        initializePeerConnection()
      
      // Get user media
      await getUserMedia()
      
      setCallState(prev => ({ 
        ...prev, 
        isInCall: true, 
        isConnecting: false,
        connectionState: 'connected' 
      }))

      // Start call timer
      callTimerRef.current = setInterval(() => {
        setCallState(prev => ({ ...prev, callDuration: prev.callDuration + 1 }))
      }, 1000)

    } catch (error) {
      console.error('Error starting call:', error)
      setCallState(prev => ({ 
        ...prev, 
        isConnecting: false, 
        connectionState: 'failed' 
      }))
    }
  }, [getUserMedia, initializePeerConnection])

  // End call
  const endCall = useCallback(() => {
    // Stop all tracks
    if (mediaState.localStream) {
      mediaState.localStream.getTracks().forEach(track => track.stop())
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }

    // Clear timer
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current)
    }

    // Reset state
    setCallState({
      isInCall: false,
      isConnecting: false,
      callDuration: 0,
      connectionState: 'disconnected'
    })

    setMediaState({
      isVideoEnabled: true,
      isAudioEnabled: true,
      isScreenSharing: false,
      localStream: null,
      remoteStream: null
    })
  }, [mediaState.localStream])

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (mediaState.localStream) {
      const videoTrack = mediaState.localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !mediaState.isVideoEnabled
        setMediaState(prev => ({ ...prev, isVideoEnabled: !prev.isVideoEnabled }))
      }
    }
  }, [mediaState.localStream, mediaState.isVideoEnabled])

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (mediaState.localStream) {
      const audioTrack = mediaState.localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !mediaState.isAudioEnabled
        setMediaState(prev => ({ ...prev, isAudioEnabled: !prev.isAudioEnabled }))
      }
    }
  }, [mediaState.localStream, mediaState.isAudioEnabled])

  // Toggle screen sharing
  const toggleScreenShare = useCallback(async () => {
    try {
      if (mediaState.isScreenSharing) {
        // Stop screen sharing, go back to camera
        await getUserMedia({ video: true, audio: true })
        setMediaState(prev => ({ ...prev, isScreenSharing: false }))
      } else {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        })
        
        setMediaState(prev => ({ ...prev, localStream: screenStream, isScreenSharing: true }))
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream
        }

        // Handle screen share ending
        screenStream.getVideoTracks()[0].onended = () => {
          getUserMedia({ video: true, audio: true })
          setMediaState(prev => ({ ...prev, isScreenSharing: false }))
        }
      }
    } catch (error) {
      console.error('Error with screen sharing:', error)
    }
  }, [mediaState.isScreenSharing, getUserMedia])

  // Format call duration
  const formatDuration = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endCall()
    }
  }, [endCall])

  return {
    // State
    callState,
    mediaState,
    
    // Refs
    localVideoRef,
    remoteVideoRef,
    
    // Actions
    startCall,
    endCall,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    
    // Utils
    formatDuration
  }
} 