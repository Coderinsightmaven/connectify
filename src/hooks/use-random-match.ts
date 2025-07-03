import { useState, useCallback, useRef, useEffect } from 'react'

export interface AnonymousUser {
  id: string
  name: string
  avatar: string
  country?: string
  interests?: string[]
  isConnected: boolean
}

export interface MatchState {
  status: 'idle' | 'searching' | 'connected' | 'disconnected'
  currentMatch: AnonymousUser | null
  searchTime: number
  totalConnections: number
}

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 
  'Japan', 'Australia', 'Brazil', 'India', 'Spain', 'Italy', 'Netherlands',
  'Sweden', 'Norway', 'South Korea', 'Mexico', 'Argentina', 'Thailand'
]

const interests = [
  'Music', 'Movies', 'Gaming', 'Sports', 'Travel', 'Photography', 
  'Art', 'Technology', 'Books', 'Cooking', 'Fitness', 'Dancing',
  'Science', 'History', 'Languages', 'Nature', 'Fashion', 'Comedy'
]

const anonymousNames = [
  'Stranger', 'Anonymous', 'Unknown', 'Visitor', 'Guest', 'User',
  'Friend', 'Someone', 'Person', 'Individual', 'Human', 'Buddy'
]

// Generate random avatar URLs (using placeholder service)
const generateAvatar = () => {
  const seed = Math.random().toString(36).substring(7)
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
}

export function useRandomMatch() {
  const [matchState, setMatchState] = useState<MatchState>({
    status: 'idle',
    currentMatch: null,
    searchTime: 0,
    totalConnections: 0
  })

  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [reportedUsers, setReportedUsers] = useState<Set<string>>(new Set())
  
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null)
  const disconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Generate random anonymous user
  const generateRandomUser = useCallback((): AnonymousUser => {
    const randomName = anonymousNames[Math.floor(Math.random() * anonymousNames.length)]
    const randomCountry = countries[Math.floor(Math.random() * countries.length)]
    const userInterests = interests
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 4) + 1)

    return {
      id: Math.random().toString(36).substring(2) + Date.now().toString(36),
      name: randomName,
      avatar: generateAvatar(),
      country: randomCountry,
      interests: userInterests,
      isConnected: true
    }
  }, [])

  // Start searching for a match
  const startSearching = useCallback(() => {
    setMatchState(prev => ({
      ...prev,
      status: 'searching',
      searchTime: 0,
      currentMatch: null
    }))

    // Start search timer
    searchTimerRef.current = setInterval(() => {
      setMatchState(prev => ({
        ...prev,
        searchTime: prev.searchTime + 1
      }))
    }, 1000)

    // Simulate finding a match after 2-8 seconds
    const searchDuration = Math.random() * 6000 + 2000 // 2-8 seconds
    
    setTimeout(() => {
      if (searchTimerRef.current) {
        clearInterval(searchTimerRef.current)
      }

      const newMatch = generateRandomUser()
      setMatchState(prev => ({
        ...prev,
        status: 'connected',
        currentMatch: newMatch,
        searchTime: 0,
        totalConnections: prev.totalConnections + 1
      }))
    }, searchDuration)
  }, [generateRandomUser])

  // Skip current match
  const skipMatch = useCallback(() => {
    if (matchState.currentMatch) {
      // Brief disconnection state
      setMatchState(prev => ({
        ...prev,
        status: 'disconnected',
        currentMatch: null
      }))

      // Start searching for new match after a short delay
      setTimeout(() => {
        startSearching()
      }, 1000)
    }
  }, [matchState.currentMatch, startSearching])

  // Stop matching
  const stopMatching = useCallback(() => {
    if (searchTimerRef.current) {
      clearInterval(searchTimerRef.current)
    }
    if (disconnectTimeoutRef.current) {
      clearTimeout(disconnectTimeoutRef.current)
    }

    setMatchState({
      status: 'idle',
      currentMatch: null,
      searchTime: 0,
      totalConnections: 0
    })
  }, [])

  // Report current user
  const reportUser = useCallback(() => {
    if (matchState.currentMatch) {
      setReportedUsers(prev => new Set([...prev, matchState.currentMatch!.id]))
      skipMatch()
    }
  }, [matchState.currentMatch, skipMatch])

  // Toggle video
  const toggleVideo = useCallback(() => {
    setIsVideoEnabled(prev => !prev)
  }, [])

  // Toggle audio
  const toggleAudio = useCallback(() => {
    setIsAudioEnabled(prev => !prev)
  }, [])

  // Simulate random disconnections (10% chance every 30-60 seconds when connected)
  useEffect(() => {
    if (matchState.status === 'connected' && matchState.currentMatch) {
      const randomDisconnectTime = Math.random() * 30000 + 30000 // 30-60 seconds
      
      disconnectTimeoutRef.current = setTimeout(() => {
        if (Math.random() < 0.1) { // 10% chance of random disconnect
          setMatchState(prev => ({
            ...prev,
            status: 'disconnected',
            currentMatch: null
          }))

          // Auto-start searching again after 2 seconds
          setTimeout(() => {
            if (matchState.status !== 'idle') {
              startSearching()
            }
          }, 2000)
        }
      }, randomDisconnectTime)
    }

    return () => {
      if (disconnectTimeoutRef.current) {
        clearTimeout(disconnectTimeoutRef.current)
      }
    }
  }, [matchState.status, matchState.currentMatch, startSearching])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMatching()
    }
  }, [stopMatching])

  // Format search time
  const formatSearchTime = useCallback((seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`
    }
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }, [])

  return {
    // State
    matchState,
    isVideoEnabled,
    isAudioEnabled,
    reportedUsers,
    
    // Actions
    startSearching,
    skipMatch,
    stopMatching,
    reportUser,
    toggleVideo,
    toggleAudio,
    
    // Utils
    formatSearchTime,
    generateRandomUser
  }
} 