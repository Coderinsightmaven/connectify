import { create } from 'zustand'
import { AnonymousUser, MatchState } from '../hooks/use-random-match'

interface ChatMessage {
  id: string
  message: string
  sender: 'user' | 'stranger'
  timestamp: Date
}

interface VideoCallState {
  isVideoEnabled: boolean
  isAudioEnabled: boolean
  isScreenSharing: boolean
  callDuration: number
  isConnected: boolean
}

interface VideoChatState {
  // Random matching state
  matchState: MatchState
  searchTime: number
  totalConnections: number
  reportedUsers: Set<string>
  
  // Video call state
  videoCall: VideoCallState
  
  // Chat messages
  messages: ChatMessage[]
  
  // Settings
  preferredCountries: string[]
  preferredInterests: string[]
  autoSkipEnabled: boolean
  autoSkipDelay: number // seconds
  
  // Actions - Matching
  startSearching: () => void
  stopSearching: () => void
  skipMatch: () => void
  reportUser: () => void
  setMatchState: (state: MatchState) => void
  setCurrentMatch: (user: AnonymousUser | null) => void
  incrementConnections: () => void
  
  // Actions - Video Call
  toggleVideo: () => void
  toggleAudio: () => void
  toggleScreenShare: () => void
  setCallDuration: (duration: number) => void
  setConnectionStatus: (connected: boolean) => void
  
  // Actions - Chat
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  clearMessages: () => void
  simulateStrangerResponse: () => void
  
  // Actions - Settings
  setPreferredCountries: (countries: string[]) => void
  setPreferredInterests: (interests: string[]) => void
  setAutoSkip: (enabled: boolean, delay?: number) => void
  
  // Utility actions
  generateRandomUser: () => AnonymousUser
  resetState: () => void
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

const strangerResponses = [
  "Hey there!", "Hi!", "How are you?", "Nice to meet you!",
  "Where are you from?", "What are your hobbies?", "Cool!",
  "That's interesting", "I like that too!", "Haha", "Really?",
  "Tell me more", "Same here!", "Awesome!", "What do you think?",
  "I agree", "That's funny", "Wow!", "No way!", "Exactly!"
]

const generateAvatar = () => {
  const seed = Math.random().toString(36).substring(7)
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
}

export const useVideoChatStore = create<VideoChatState>((set, get) => ({
  // Initial state
  matchState: {
    status: 'idle',
    currentMatch: null,
    searchTime: 0,
    totalConnections: 0
  },
  searchTime: 0,
  totalConnections: 0,
  reportedUsers: new Set(),
  
  videoCall: {
    isVideoEnabled: true,
    isAudioEnabled: true,
    isScreenSharing: false,
    callDuration: 0,
    isConnected: false
  },
  
  messages: [],
  
  preferredCountries: [],
  preferredInterests: [],
  autoSkipEnabled: false,
  autoSkipDelay: 30,
  
  // Matching actions
  startSearching: () => {
    set({
      matchState: {
        status: 'searching',
        currentMatch: null,
        searchTime: 0,
        totalConnections: get().totalConnections
      },
      messages: []
    })
    
    // Simulate finding a match after 2-8 seconds
    const searchDuration = Math.random() * 6000 + 2000
    
    setTimeout(() => {
      const { generateRandomUser } = get()
      const newMatch = generateRandomUser()
      
      set({
        matchState: {
          status: 'connected',
          currentMatch: newMatch,
          searchTime: 0,
          totalConnections: get().totalConnections + 1
        },
        totalConnections: get().totalConnections + 1
      })
    }, searchDuration)
  },
  
  stopSearching: () => {
    set({
      matchState: {
        status: 'idle',
        currentMatch: null,
        searchTime: 0,
        totalConnections: 0
      },
      messages: [],
      totalConnections: 0
    })
  },
  
  skipMatch: () => {
    const { matchState } = get()
    if (matchState.currentMatch) {
      set({
        matchState: {
          ...matchState,
          status: 'disconnected',
          currentMatch: null
        },
        messages: []
      })
      
      // Start searching for new match after delay
      setTimeout(() => {
        get().startSearching()
      }, 1000)
    }
  },
  
  reportUser: () => {
    const { matchState, reportedUsers } = get()
    if (matchState.currentMatch) {
      const newReportedUsers = new Set([...reportedUsers, matchState.currentMatch.id])
      set({ reportedUsers: newReportedUsers })
      get().skipMatch()
    }
  },
  
  setMatchState: (matchState: MatchState) => {
    set({ matchState })
  },
  
  setCurrentMatch: (user: AnonymousUser | null) => {
    set({
      matchState: {
        ...get().matchState,
        currentMatch: user
      }
    })
  },
  
  incrementConnections: () => {
    set({ totalConnections: get().totalConnections + 1 })
  },
  
  // Video call actions
  toggleVideo: () => {
    set({
      videoCall: {
        ...get().videoCall,
        isVideoEnabled: !get().videoCall.isVideoEnabled
      }
    })
  },
  
  toggleAudio: () => {
    set({
      videoCall: {
        ...get().videoCall,
        isAudioEnabled: !get().videoCall.isAudioEnabled
      }
    })
  },
  
  toggleScreenShare: () => {
    set({
      videoCall: {
        ...get().videoCall,
        isScreenSharing: !get().videoCall.isScreenSharing
      }
    })
  },
  
  setCallDuration: (duration: number) => {
    set({
      videoCall: {
        ...get().videoCall,
        callDuration: duration
      }
    })
  },
  
  setConnectionStatus: (connected: boolean) => {
    set({
      videoCall: {
        ...get().videoCall,
        isConnected: connected
      }
    })
  },
  
  // Chat actions
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    
    set({
      messages: [...get().messages, newMessage]
    })
    
    // Auto-trigger stranger response for user messages
    if (message.sender === 'user' && get().matchState.status === 'connected') {
      setTimeout(() => {
        get().simulateStrangerResponse()
      }, Math.random() * 3000 + 1000) // 1-4 seconds delay
    }
  },
  
  clearMessages: () => {
    set({ messages: [] })
  },
  
  simulateStrangerResponse: () => {
    const { matchState } = get()
    if (matchState.status === 'connected') {
      const response = strangerResponses[Math.floor(Math.random() * strangerResponses.length)]
      
      const strangerMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: response,
        sender: 'stranger',
        timestamp: new Date()
      }
      
      set({
        messages: [...get().messages, strangerMessage]
      })
    }
  },
  
  // Settings actions
  setPreferredCountries: (countries: string[]) => {
    set({ preferredCountries: countries })
  },
  
  setPreferredInterests: (interests: string[]) => {
    set({ preferredInterests: interests })
  },
  
  setAutoSkip: (enabled: boolean, delay = 30) => {
    set({
      autoSkipEnabled: enabled,
      autoSkipDelay: delay
    })
  },
  
  // Utility actions
  generateRandomUser: (): AnonymousUser => {
    const { preferredCountries, preferredInterests } = get()
    
    const randomName = anonymousNames[Math.floor(Math.random() * anonymousNames.length)]
    const randomCountry = preferredCountries.length > 0 
      ? preferredCountries[Math.floor(Math.random() * preferredCountries.length)]
      : countries[Math.floor(Math.random() * countries.length)]
    
    const availableInterests = preferredInterests.length > 0 ? preferredInterests : interests
    const userInterests = availableInterests
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
  },
  
  resetState: () => {
    set({
      matchState: {
        status: 'idle',
        currentMatch: null,
        searchTime: 0,
        totalConnections: 0
      },
      searchTime: 0,
      totalConnections: 0,
      reportedUsers: new Set(),
      videoCall: {
        isVideoEnabled: true,
        isAudioEnabled: true,
        isScreenSharing: false,
        callDuration: 0,
        isConnected: false
      },
      messages: []
    })
  }
})) 