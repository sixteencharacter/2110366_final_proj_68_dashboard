"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Activity, Volume2, VolumeX, Radio, Scan, CheckCircle2, XCircle, HelpCircle, ArrowLeft } from 'lucide-react';
import { useMQTTData } from '@/lib/hooks/useMQTTData';

const LieDetectorGame = () => {

  const {gameState , heartBeat , gameResult , analysisProgress , isTalking} = useMQTTData({host : process.env.MQTT_ENDPOINT});
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const getResultColor = () => {
    if (!gameResult) return 'bg-zinc-500';
    if (gameResult.result === 'Truth') return 'bg-emerald-500';
    if (gameResult.result === 'Lie') return 'bg-red-500';
    return 'bg-amber-500';
  };

  const getResultIcon = () => {
    if (!gameResult) return null;
    if (gameResult.result === 'Truth') return <CheckCircle2 className="w-32 h-32" />;
    if (gameResult.result === 'Lie') return <XCircle className="w-32 h-32" />;
    return <HelpCircle className="w-32 h-32" />;
  };

  // Immersive Mode Views
  if (immersiveMode) {
    const ImmersiveIdleView = () => (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white p-8">
        <Activity className="w-32 h-32 text-red-500 mb-8 animate-pulse" />
        <h1 className="text-7xl font-bold mb-4">LIE DETECTOR</h1>
        <p className="text-2xl text-zinc-400 mb-12">System Ready</p>
        <div className="grid grid-cols-2 gap-8 mb-12 w-full max-w-4xl">
          <div className="text-center p-6 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <div className="text-5xl font-bold text-emerald-500 mb-2">{heartBeat}</div>
            <div className="text-sm text-zinc-400">HEART RATE</div>
          </div>
          <div className="text-center p-6 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <div className="text-5xl font-bold text-blue-500 mb-2">IDLE</div>
            <div className="text-sm text-zinc-400">STATUS</div>
          </div>
        </div>
      </div>
    );

    const ImmersiveQuestioningView = () => (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-zinc-900 to-zinc-950 text-white p-8">
        <div className="mb-8 relative">
          <Radio className="w-40 h-40 text-blue-500 animate-pulse" />
          {isTalking && (
            <>
              <div className="absolute inset-0 w-40 h-40 rounded-full border-4 border-blue-500 animate-ping"></div>
              <div className="absolute inset-0 w-40 h-40 rounded-full border-4 border-blue-400 animate-ping"></div>
            </>
          )}
        </div>
        <h1 className="text-6xl font-bold mb-4">RECORDING</h1>
        <p className="text-xl text-zinc-400 mb-8">Voice Analysis Active</p>
        
        <div className="w-full max-w-2xl mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i}
                className={`w-2 rounded-full transition-all duration-200 ${
                  isTalking ? 'bg-blue-500' : 'bg-zinc-700'
                }`}
                style={{
                  height: isTalking ? `${Math.random() * 60 + 20}px` : '16px',
                  animation: isTalking ? `soundWave 0.5s ease-in-out infinite ${i * 0.05}s` : 'none'
                }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-12 w-full max-w-3xl">
          <div className="text-center p-8 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <Activity className={`w-16 h-16 mx-auto mb-4 ${heartBeat > 100 ? 'text-red-500' : 'text-pink-500'}`} />
            <div className="text-5xl font-bold mb-2">{heartBeat}</div>
            <div className="text-sm text-zinc-400">BPM</div>
          </div>
          <div className="text-center p-8 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isTalking ? 'bg-green-500 animate-pulse' : 'bg-zinc-600'
            }`}>
              <span className="text-3xl">●</span>
            </div>
            <div className="text-5xl font-bold mb-2">{isTalking ? 'ACTIVE' : 'WAITING'}</div>
            <div className="text-sm text-zinc-400">VOICE STATUS</div>
          </div>
        </div>
      </div>
    );

    const ImmersiveAnalyzingView = () => (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-950 via-zinc-900 to-zinc-950 text-white p-8">
        <Scan className="w-40 h-40 text-purple-500 mb-8 animate-spin" style={{ animationDuration: '3s' }} />
        <h1 className="text-6xl font-bold mb-4">ANALYZING</h1>
        <p className="text-xl text-zinc-400 mb-8">Processing Biometric Data</p>
        
        <div className="w-full max-w-2xl mb-12">
          <div className="relative h-4 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-blue-500 transition-all duration-300"
              style={{width: `${analysisProgress}%`}}
            />
          </div>
          <div className="flex justify-between mt-4 text-2xl font-bold">
            <span>PROGRESS</span>
            <span className="text-purple-400">{analysisProgress}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
          <div className="text-center p-6 bg-zinc-800/50 rounded-lg border border-purple-700/50">
            <div className="text-sm text-zinc-400 mb-2">VOICE PATTERN</div>
            <div className="text-3xl font-bold text-purple-400">SCANNING...</div>
          </div>
          <div className="text-center p-6 bg-zinc-800/50 rounded-lg border border-purple-700/50">
            <div className="text-sm text-zinc-400 mb-2">HEART RATE</div>
            <div className="text-3xl font-bold text-purple-400">{heartBeat} BPM</div>
          </div>
        </div>
      </div>
    );

    const ImmersiveResultView = () => {
      const resultColors : Record<string,string> = {
        'Truth': 'from-emerald-950 via-zinc-900 to-zinc-950',
        'Lie': 'from-red-950 via-zinc-900 to-zinc-950',
        'Inconclusive': 'from-amber-950 via-zinc-900 to-zinc-950'
      };

      const iconColors : Record<string,string>  = {
        'Truth': 'text-emerald-500',
        'Lie': 'text-red-500',
        'Inconclusive': 'text-amber-500'
      };

      return (
        <div className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br ${resultColors[gameResult?.result || 'Truth']} text-white p-8`}>
          <div className={`mb-8 ${iconColors[gameResult?.result || 'Truth']}`}>
            {getResultIcon()}
          </div>
          <h1 className="text-7xl font-bold mb-4">{gameResult?.result.toUpperCase()}</h1>
          <p className="text-3xl text-zinc-400 mb-12">Detection Complete</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-12">
            <div className="text-center p-8 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <div className="text-sm text-zinc-400 mb-2">CONFIDENCE LEVEL</div>
              <div className="text-6xl font-bold mb-2">{gameResult?.confidence}%</div>
              <Progress value={gameResult?.confidence} className="h-3 mt-4" />
            </div>
            <div className="text-center p-8 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <div className="text-sm text-zinc-400 mb-2">FINAL HEART RATE</div>
              <div className="text-6xl font-bold mb-2">{heartBeat}</div>
              <div className="text-sm text-zinc-400">BPM</div>
            </div>
            <div className="text-center p-8 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <div className="text-sm text-zinc-400 mb-2">VERDICT</div>
              <div className={`text-4xl font-bold ${iconColors[gameResult?.result || 'Truth']}`}>
                {gameResult?.result === 'Truth' ? '✓ PASS' : 
                 gameResult?.result === 'Lie' ? '✗ FAIL' : '? UNCLEAR'}
              </div>
            </div>
          </div>

          <Alert className={`mb-8 max-w-3xl ${
            gameResult?.result === 'Truth' ? 'border-emerald-500 bg-emerald-950/50' :
            gameResult?.result === 'Lie' ? 'border-red-500 bg-red-950/50' :
            'border-amber-500 bg-amber-950/50'
          }`}>
            <Activity className="h-5 w-5" />
            <AlertDescription className="ml-2 text-lg">
              <span className="font-bold">Analysis Complete:</span> Based on voice pattern analysis, 
              heart rate variability, and micro-expression detection, the system has determined a{' '}
              <span className="font-bold">{gameResult?.result}</span> with {gameResult?.confidence}% confidence.
            </AlertDescription>
          </Alert>
        </div>
      );
    };

    return (
      <>
        <style>{`
          @keyframes soundWave {
            0%, 100% { transform: scaleY(0.3); }
            50% { transform: scaleY(1); }
          }
        `}</style>
        
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="bg-zinc-900/90 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            onClick={() => setImmersiveMode(false)}
            className="bg-zinc-900/90 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Summary
          </Button>
        </div>

        {gameState === 'idle' && <ImmersiveIdleView />}
        {gameState === 'recording' && <ImmersiveQuestioningView />}
        {gameState === 'processing' && <ImmersiveAnalyzingView />}
        {gameState === 'result' && <ImmersiveResultView />}
      </>
    );
  }

  // Normal Summary View
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-100">
      <div className="w-full max-w-6xl">
        <div className="flex items-center justify-between mb-8 px-4">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-zinc-900" />
            <h1 className="text-4xl font-bold text-zinc-900">Lie Detector</h1>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Game State</CardTitle>
            <CardDescription>Monitor the interrogation process in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-zinc-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-600">Game State</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-32">
                    <Badge 
                      variant={gameState === 'idle' ? 'secondary' : 'default'}
                      className={`text-lg px-4 py-2 ${
                        gameState === 'processing' ? 'bg-blue-600 animate-pulse' :
                        gameState === 'result' ? 'bg-emerald-600' : ''
                      }`}
                    >
                      {gameState.toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-600">Is Talking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-32">
                    <div className="relative">
                      {isTalking && (
                        <>
                          <div className="absolute inset-0 w-20 h-20 rounded-full bg-green-500 opacity-75 animate-ping"></div>
                          <div className="absolute inset-0 w-20 h-20 rounded-full bg-green-500 opacity-75 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                        </>
                      )}
                      <div className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isTalking ? 'bg-green-500 scale-110' : 'bg-zinc-300'
                      }`}>
                        <span className="text-3xl font-bold text-white">
                          {isTalking ? '●' : '○'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-600">Heart Beat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-32">
                    <Activity className={`w-12 h-12 mb-2 ${
                      heartBeat > 100 ? 'text-red-500 animate-pulse' : 'text-pink-500 animate-pulse'
                    }`} />
                    <span className="text-3xl font-bold">{heartBeat}</span>
                    <span className="text-xs text-zinc-500">BPM</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-600">Game Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-32">
                    {gameResult ? (
                      <>
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center ${getResultColor()}`}>
                          <span className="text-2xl font-bold text-white">
                            {gameResult.result === 'Truth' ? '✓' : 
                             gameResult.result === 'Lie' ? '✗' : '?'}
                          </span>
                        </div>
                        <span className="text-xs mt-2 text-zinc-500">
                          {gameResult.confidence}% confident
                        </span>
                      </>
                    ) : (
                      <span className="text-4xl text-zinc-400">?</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {gameState === 'processing' && (
              <div className="mt-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Analyzing Response...</span>
                  <span className="text-sm font-medium">{analysisProgress}%</span>
                </div>
                <Progress value={analysisProgress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {gameState === 'result' && gameResult && (
          <Alert className={`mb-8 ${
            gameResult.result === 'Truth' ? 'border-emerald-500 bg-emerald-50' :
            gameResult.result === 'Lie' ? 'border-red-500 bg-red-50' :
            'border-amber-500 bg-amber-50'
          }`}>
            <Activity className="h-4 w-4" />
            <AlertDescription className="ml-2">
              <span className="font-bold">Analysis Complete:</span> The detector indicates a{' '}
              <span className="font-bold">{gameResult.result}</span> with{' '}
              {gameResult.confidence}% confidence level.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col items-center gap-4">
          <Button
            onClick={() => setImmersiveMode(true)}
            variant="outline"
            className="w-64"
          >
            Enter Immersive Mode
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LieDetectorGame;