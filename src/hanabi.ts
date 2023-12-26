import Module from './engine/hanabi.js';
import { EngineState } from "./engineState";

// Loads the wasm part of the js artifact
const module = (await Module());

let engineState: EngineState = EngineState.paused;

export function initEngine() {
    module._init_engine();
    engineState = EngineState.running;
}

export function stopEngine() {
    module._stop_engine();
    engineState = EngineState.stopped;
}

export function pauseEngine() {
    module._pause_engine();
    engineState = EngineState.paused;
}

export function playEngine() {
    module._play_engine();
    engineState = EngineState.running;
}

export function getEngineState() {
    return engineState;
} 

export function getFPS(): Number | undefined {
    switch(engineState) {
        case EngineState.running:
            return module._get_current_framerate();
        default: 
            console.error("Engine is not running")
            return undefined;
    }
}