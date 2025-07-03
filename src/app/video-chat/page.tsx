"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/ui/icons"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useVideoChatStore } from "@/stores"

export default function VideoChat() {
  const {
    matchState,
    videoCall,
    messages,
    startSearching,
    stopSearching,
    skipMatch,
    reportUser,
    toggleVideo,
    toggleAudio,
    addMessage,
    clearMessages
  } = useVideoChatStore()

  const [newMessage, setNewMessage] = useState("")
  const localVideoRef = useRef<HTMLVideoElement>(null)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || matchState.status !== 'connected') return

    addMessage({
      message: newMessage,
      sender: "user"
    })
    
    setNewMessage("")
  }

  const handleNewMatch = () => {
    clearMessages()
    startSearching()
  }

  const handleSkip = () => {
    clearMessages()
    skipMatch()
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatSearchTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`
    }
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  // Idle/Start state
  if (matchState.status === 'idle') {
    return (
      <div className="h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20">
        <div className="container mx-auto p-6 h-full flex items-center justify-center">
          <Card variant="floating" className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Random Video Chat
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Connect with strangers from around the world instantly
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">1.2M+</div>
                  <div className="text-sm text-muted-foreground">Online Users</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Daily Matches</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">190+</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/30">
                  <Icons.video className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-semibold">Video Chat</div>
                    <div className="text-sm text-muted-foreground">Face to face conversations</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/30">
                  <Icons.messageCircle className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-semibold">Text Chat</div>
                    <div className="text-sm text-muted-foreground">Send messages instantly</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/30">
                  <Icons.user className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-semibold">Anonymous</div>
                    <div className="text-sm text-muted-foreground">No registration required</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/30">
                  <Icons.search className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-semibold">Random Match</div>
                    <div className="text-sm text-muted-foreground">Meet anyone, anywhere</div>
                  </div>
                </div>
              </div>

              {/* Safety Notice */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icons.bell className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-semibold text-yellow-700 dark:text-yellow-400">Safety First</div>
                    <div className="text-yellow-600 dark:text-yellow-300 mt-1">
                      Please be respectful and report inappropriate behavior. Keep personal information private.
                    </div>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <Button onClick={handleNewMatch} size="lg" className="w-full">
                <Icons.video className="h-5 w-5 mr-2" />
                Start Video Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Main chat interface
  return (
    <div className="h-screen bg-black flex">
      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video */}
        <div className="w-full h-full bg-gray-900 relative">
          {matchState.status === 'searching' ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <div className="text-white">
                  <h3 className="text-xl font-semibold">Looking for someone...</h3>
                  <p className="text-gray-300">Search time: {formatSearchTime(matchState.searchTime)}</p>
                </div>
              </div>
            </div>
          ) : matchState.status === 'disconnected' ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-white">
                  <h3 className="text-xl font-semibold">Stranger disconnected</h3>
                  <p className="text-gray-300">Looking for a new person...</p>
                </div>
              </div>
            </div>
          ) : matchState.currentMatch ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <div className="text-center space-y-4">
                <Avatar className="h-32 w-32 mx-auto">
                  <AvatarImage src={matchState.currentMatch.avatar} alt="Stranger" />
                  <AvatarFallback className="text-4xl">
                    {matchState.currentMatch.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-white">
                  <h3 className="text-xl font-semibold">{matchState.currentMatch.name}</h3>
                  <p className="text-gray-300">Connected from {matchState.currentMatch.country}</p>
                  {matchState.currentMatch.interests && (
                    <div className="flex flex-wrap gap-1 justify-center mt-2">
                      {matchState.currentMatch.interests.slice(0, 3).map((interest, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {/* Local Video (Picture in Picture) */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20">
            {videoCall.isVideoEnabled ? (
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
                <Icons.videoOff className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Match Info */}
          {matchState.status === 'connected' && (
            <div className="absolute top-4 left-4 right-4">
              <div className="flex items-center justify-between">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="text-white text-sm">
                    <span className="text-green-400">●</span> Connected
                  </div>
                </div>
                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="text-white text-sm">
                    Matches: {matchState.totalConnections}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-4 bg-black/70 backdrop-blur-sm rounded-2xl px-6 py-4">
            {/* Mute Audio */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleAudio}
              className={cn(
                "h-12 w-12 rounded-full",
                videoCall.isAudioEnabled 
                  ? "bg-white/20 text-white hover:bg-white/30" 
                  : "bg-red-500 text-white hover:bg-red-600"
              )}
            >
              {videoCall.isAudioEnabled ? (
                <Icons.mic className="h-5 w-5" />
              ) : (
                <Icons.micOff className="h-5 w-5" />
              )}
            </Button>

            {/* Skip/Next */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSkip}
              disabled={matchState.status === 'searching'}
              className="h-12 w-12 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
            >
              <Icons.search className="h-5 w-5" />
            </Button>

            {/* Stop */}
            <Button
              variant="destructive"
              size="icon"
              onClick={stopSearching}
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
                videoCall.isVideoEnabled 
                  ? "bg-white/20 text-white hover:bg-white/30" 
                  : "bg-red-500 text-white hover:bg-red-600"
              )}
            >
              {videoCall.isVideoEnabled ? (
                <Icons.video className="h-5 w-5" />
              ) : (
                <Icons.videoOff className="h-5 w-5" />
              )}
            </Button>

            {/* Report */}
            {matchState.status === 'connected' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={reportUser}
                className="h-12 w-12 rounded-full bg-orange-500 text-white hover:bg-orange-600"
              >
                <Icons.bell className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className="w-80 bg-card border-l border-border">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Chat</h3>
              {matchState.status === 'connected' && (
                <Badge variant="outline" className="text-xs">
                  {matchState.currentMatch?.name || 'Stranger'}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && matchState.status === 'connected' && (
              <div className="text-center text-muted-foreground text-sm">
                Say hello to start the conversation!
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-lg px-3 py-2",
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={matchState.status === 'connected' ? "Type a message..." : "Waiting for connection..."}
                disabled={matchState.status !== 'connected'}
                className="flex-1"
              />
              <Button 
                type="submit" 
                size="icon"
                disabled={!newMessage.trim() || matchState.status !== 'connected'}
              >
                <Icons.plus className="h-4 w-4 rotate-45" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 