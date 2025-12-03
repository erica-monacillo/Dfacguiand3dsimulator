import { useState, useEffect } from 'react';
import { ArrowRight, Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { normalizePayload } from '../lib/aho-corasick';

interface StateTransitionViewerProps {
  payload: string;
  stateSequence: number[];
}

export function StateTransitionViewer({ payload, stateSequence }: StateTransitionViewerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying && currentStep < stateSequence.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 500);
      return () => clearTimeout(timer);
    } else if (currentStep >= stateSequence.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, stateSequence.length]);

  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [payload]);

  const normalizedPayload = normalizePayload(payload);

  const togglePlay = () => {
    if (currentStep >= stateSequence.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const stepForward = () => {
    if (currentStep < stateSequence.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  if (!payload || stateSequence.length === 0) {
    return (
      <div className="bg-slate-950 border border-slate-700 rounded-lg p-6">
        <p className="text-slate-500 text-sm text-center">
          Analyze a payload to see state transitions
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 border border-slate-700 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-slate-300 text-sm">DFA State Transitions</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={togglePlay}
            className="border-slate-600 text-slate-300"
          >
            {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={stepForward}
            disabled={currentStep >= stateSequence.length - 1}
            className="border-slate-600 text-slate-300"
          >
            <SkipForward className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={reset}
            className="border-slate-600 text-slate-300"
          >
            <RotateCcw className="size-4" />
          </Button>
        </div>
      </div>

      {/* Current Character */}
      <div className="bg-slate-900 rounded p-3">
        <div className="text-xs text-slate-400 mb-1">Current Character:</div>
        <div className="font-mono text-lg text-cyan-400">
          {currentStep < normalizedPayload.length ? (
            <>
              <span className="text-slate-600">{normalizedPayload.substring(0, currentStep)}</span>
              <span className="bg-cyan-400 text-slate-900 px-1">
                {normalizedPayload[currentStep]}
              </span>
              <span className="text-slate-600">{normalizedPayload.substring(currentStep + 1)}</span>
            </>
          ) : (
            <span className="text-slate-600">{normalizedPayload}</span>
          )}
        </div>
      </div>

      {/* State Transition */}
      <div className="flex items-center justify-center gap-3">
        <div className="bg-slate-800 rounded-lg px-4 py-2 border border-slate-700">
          <div className="text-xs text-slate-400">Previous State</div>
          <div className="text-lg text-cyan-400 font-mono">
            q{currentStep > 0 ? stateSequence[currentStep - 1] : 0}
          </div>
        </div>
        <ArrowRight className="size-6 text-purple-400" />
        <div className={`rounded-lg px-4 py-2 border-2 ${
          stateSequence[currentStep] === 6 
            ? 'bg-red-950/50 border-red-500' 
            : 'bg-slate-800 border-slate-700'
        }`}>
          <div className="text-xs text-slate-400">Current State</div>
          <div className={`text-lg font-mono ${
            stateSequence[currentStep] === 6 ? 'text-red-400' : 'text-purple-400'
          }`}>
            q{stateSequence[currentStep]}
            {stateSequence[currentStep] === 6 && (
              <span className="text-xs ml-1">(ACCEPT)</span>
            )}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Progress</span>
          <span>{currentStep} / {normalizedPayload.length}</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              stateSequence[currentStep] === 6 ? 'bg-red-500' : 'bg-purple-500'
            }`}
            style={{ width: `${(currentStep / normalizedPayload.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
