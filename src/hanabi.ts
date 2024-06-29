import { EngineState } from "./engineState";

let engineState: EngineState = EngineState.paused;

var module: any;
declare var hanabi: any;

export async function initWasm() {
    module = await hanabi();
}

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