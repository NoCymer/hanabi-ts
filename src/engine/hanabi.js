
var Module = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return (
function(moduleArg = {}) {

// include: shell.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = moduleArg;

// Set up the promise that indicates the Module is initialized
var readyPromiseResolve, readyPromiseReject;
Module['ready'] = new Promise((resolve, reject) => {
  readyPromiseResolve = resolve;
  readyPromiseReject = reject;
});
["_main","_init_engine","_stop_engine","_pause_engine","_play_engine","_get_current_state","_get_current_framerate","_fflush","onRuntimeInitialized"].forEach((prop) => {
  if (!Object.getOwnPropertyDescriptor(Module['ready'], prop)) {
    Object.defineProperty(Module['ready'], prop, {
      get: () => abort('You are getting ' + prop + ' on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'),
      set: () => abort('You are setting ' + prop + ' on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'),
    });
  }
});

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)


// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = Object.assign({}, Module);

var arguments_ = [];
var thisProgram = './this.program';
var quit_ = (status, toThrow) => {
  throw toThrow;
};

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).

// Attempt to auto-detect the environment
var ENVIRONMENT_IS_WEB = typeof window == 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts == 'function';
// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
var ENVIRONMENT_IS_NODE = typeof process == 'object' && typeof process.versions == 'object' && typeof process.versions.node == 'string';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

if (Module['ENVIRONMENT']) {
  throw new Error('Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)');
}

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = '';
function locateFile(path) {
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var read_,
    readAsync,
    readBinary,
    setWindowTitle;

if (ENVIRONMENT_IS_NODE) {
  if (typeof process == 'undefined' || !process.release || process.release.name !== 'node') throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

  var nodeVersion = process.versions.node;
  var numericVersion = nodeVersion.split('.').slice(0, 3);
  numericVersion = (numericVersion[0] * 10000) + (numericVersion[1] * 100) + (numericVersion[2].split('-')[0] * 1);
  var minVersion = 160000;
  if (numericVersion < 160000) {
    throw new Error('This emscripten-generated code requires node v16.0.0 (detected v' + nodeVersion + ')');
  }

  // `require()` is no-op in an ESM module, use `createRequire()` to construct
  // the require()` function.  This is only necessary for multi-environment
  // builds, `-sENVIRONMENT=node` emits a static import declaration instead.
  // TODO: Swap all `require()`'s with `import()`'s?
  // These modules will usually be used on Node.js. Load them eagerly to avoid
  // the complexity of lazy-loading.
  var fs = require('fs');
  var nodePath = require('path');

  if (ENVIRONMENT_IS_WORKER) {
    scriptDirectory = nodePath.dirname(scriptDirectory) + '/';
  } else {
    scriptDirectory = __dirname + '/';
  }

// include: node_shell_read.js
read_ = (filename, binary) => {
  var ret = tryParseAsDataURI(filename);
  if (ret) {
    return binary ? ret : ret.toString();
  }
  // We need to re-wrap `file://` strings to URLs. Normalizing isn't
  // necessary in that case, the path should already be absolute.
  filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
  return fs.readFileSync(filename, binary ? undefined : 'utf8');
};

readBinary = (filename) => {
  var ret = read_(filename, true);
  if (!ret.buffer) {
    ret = new Uint8Array(ret);
  }
  assert(ret.buffer);
  return ret;
};

readAsync = (filename, onload, onerror, binary = true) => {
  var ret = tryParseAsDataURI(filename);
  if (ret) {
    onload(ret);
  }
  // See the comment in the `read_` function.
  filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
  fs.readFile(filename, binary ? undefined : 'utf8', (err, data) => {
    if (err) onerror(err);
    else onload(binary ? data.buffer : data);
  });
};
// end include: node_shell_read.js
  if (!Module['thisProgram'] && process.argv.length > 1) {
    thisProgram = process.argv[1].replace(/\\/g, '/');
  }

  arguments_ = process.argv.slice(2);

  // MODULARIZE will export the module in the proper place outside, we don't need to export here

  quit_ = (status, toThrow) => {
    process.exitCode = status;
    throw toThrow;
  };

  Module['inspect'] = () => '[Emscripten Module object]';

} else
if (ENVIRONMENT_IS_SHELL) {

  if ((typeof process == 'object' && typeof require === 'function') || typeof window == 'object' || typeof importScripts == 'function') throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

  if (typeof read != 'undefined') {
    read_ = (f) => {
      const data = tryParseAsDataURI(f);
      if (data) {
        return intArrayToString(data);
      }
      return read(f);
    };
  }

  readBinary = (f) => {
    let data;
    data = tryParseAsDataURI(f);
    if (data) {
      return data;
    }
    if (typeof readbuffer == 'function') {
      return new Uint8Array(readbuffer(f));
    }
    data = read(f, 'binary');
    assert(typeof data == 'object');
    return data;
  };

  readAsync = (f, onload, onerror) => {
    setTimeout(() => onload(readBinary(f)));
  };

  if (typeof clearTimeout == 'undefined') {
    globalThis.clearTimeout = (id) => {};
  }

  if (typeof setTimeout == 'undefined') {
    // spidermonkey lacks setTimeout but we use it above in readAsync.
    globalThis.setTimeout = (f) => (typeof f == 'function') ? f() : abort();
  }

  if (typeof scriptArgs != 'undefined') {
    arguments_ = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    arguments_ = arguments;
  }

  if (typeof quit == 'function') {
    quit_ = (status, toThrow) => {
      // Unlike node which has process.exitCode, d8 has no such mechanism. So we
      // have no way to set the exit code and then let the program exit with
      // that code when it naturally stops running (say, when all setTimeouts
      // have completed). For that reason, we must call `quit` - the only way to
      // set the exit code - but quit also halts immediately.  To increase
      // consistency with node (and the web) we schedule the actual quit call
      // using a setTimeout to give the current stack and any exception handlers
      // a chance to run.  This enables features such as addOnPostRun (which
      // expected to be able to run code after main returns).
      setTimeout(() => {
        if (!(toThrow instanceof ExitStatus)) {
          let toLog = toThrow;
          if (toThrow && typeof toThrow == 'object' && toThrow.stack) {
            toLog = [toThrow, toThrow.stack];
          }
          err(`exiting due to exception: ${toLog}`);
        }
        quit(status);
      });
      throw toThrow;
    };
  }

  if (typeof print != 'undefined') {
    // Prefer to use print/printErr where they exist, as they usually work better.
    if (typeof console == 'undefined') console = /** @type{!Console} */({});
    console.log = /** @type{!function(this:Console, ...*): undefined} */ (print);
    console.warn = console.error = /** @type{!function(this:Console, ...*): undefined} */ (typeof printErr != 'undefined' ? printErr : print);
  }

} else

// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  if (ENVIRONMENT_IS_WORKER) { // Check worker, not web, since window could be polyfilled
    scriptDirectory = self.location.href;
  } else if (typeof document != 'undefined' && document.currentScript) { // web
    scriptDirectory = document.currentScript.src;
  }
  // When MODULARIZE, this JS may be executed later, after document.currentScript
  // is gone, so we saved it, and we use it here instead of any other info.
  if (_scriptDir) {
    scriptDirectory = _scriptDir;
  }
  // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
  // otherwise, slice off the final part of the url to find the script directory.
  // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
  // and scriptDirectory will correctly be replaced with an empty string.
  // If scriptDirectory contains a query (starting with ?) or a fragment (starting with #),
  // they are removed because they could contain a slash.
  if (scriptDirectory.indexOf('blob:') !== 0) {
    scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf('/')+1);
  } else {
    scriptDirectory = '';
  }

  if (!(typeof window == 'object' || typeof importScripts == 'function')) throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

  // Differentiate the Web Worker from the Node Worker case, as reading must
  // be done differently.
  {
// include: web_or_worker_shell_read.js
read_ = (url) => {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.send(null);
      return xhr.responseText;
    } catch (err) {
      var data = tryParseAsDataURI(url);
      if (data) {
        return intArrayToString(data);
      }
      throw err;
    }
  }

  if (ENVIRONMENT_IS_WORKER) {
    readBinary = (url) => {
      try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.responseType = 'arraybuffer';
        xhr.send(null);
        return new Uint8Array(/** @type{!ArrayBuffer} */(xhr.response));
      } catch (err) {
        var data = tryParseAsDataURI(url);
        if (data) {
          return data;
        }
        throw err;
      }
    };
  }

  readAsync = (url, onload, onerror) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = () => {
      if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
        onload(xhr.response);
        return;
      }
      var data = tryParseAsDataURI(url);
      if (data) {
        onload(data.buffer);
        return;
      }
      onerror();
    };
    xhr.onerror = onerror;
    xhr.send(null);
  }

// end include: web_or_worker_shell_read.js
  }

  setWindowTitle = (title) => document.title = title;
} else
{
  throw new Error('environment detection error');
}

var out = Module['print'] || console.log.bind(console);
var err = Module['printErr'] || console.error.bind(console);

// Merge back in the overrides
Object.assign(Module, moduleOverrides);
// Free the object hierarchy contained in the overrides, this lets the GC
// reclaim data used e.g. in memoryInitializerRequest, which is a large typed array.
moduleOverrides = null;
checkIncomingModuleAPI();

// Emit code to handle expected values on the Module object. This applies Module.x
// to the proper local x. This has two benefits: first, we only emit it if it is
// expected to arrive, and second, by using a local everywhere else that can be
// minified.

if (Module['arguments']) arguments_ = Module['arguments'];legacyModuleProp('arguments', 'arguments_');

if (Module['thisProgram']) thisProgram = Module['thisProgram'];legacyModuleProp('thisProgram', 'thisProgram');

if (Module['quit']) quit_ = Module['quit'];legacyModuleProp('quit', 'quit_');

// perform assertions in shell.js after we set up out() and err(), as otherwise if an assertion fails it cannot print the message
// Assertions on removed incoming Module JS APIs.
assert(typeof Module['memoryInitializerPrefixURL'] == 'undefined', 'Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['pthreadMainPrefixURL'] == 'undefined', 'Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['cdInitializerPrefixURL'] == 'undefined', 'Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['filePackagePrefixURL'] == 'undefined', 'Module.filePackagePrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['read'] == 'undefined', 'Module.read option was removed (modify read_ in JS)');
assert(typeof Module['readAsync'] == 'undefined', 'Module.readAsync option was removed (modify readAsync in JS)');
assert(typeof Module['readBinary'] == 'undefined', 'Module.readBinary option was removed (modify readBinary in JS)');
assert(typeof Module['setWindowTitle'] == 'undefined', 'Module.setWindowTitle option was removed (modify setWindowTitle in JS)');
assert(typeof Module['TOTAL_MEMORY'] == 'undefined', 'Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY');
legacyModuleProp('read', 'read_');
legacyModuleProp('readAsync', 'readAsync');
legacyModuleProp('readBinary', 'readBinary');
legacyModuleProp('setWindowTitle', 'setWindowTitle');
var IDBFS = 'IDBFS is no longer included by default; build with -lidbfs.js';
var PROXYFS = 'PROXYFS is no longer included by default; build with -lproxyfs.js';
var WORKERFS = 'WORKERFS is no longer included by default; build with -lworkerfs.js';
var NODEFS = 'NODEFS is no longer included by default; build with -lnodefs.js';

assert(!ENVIRONMENT_IS_SHELL, "shell environment detected but not enabled at build time.  Add 'shell' to `-sENVIRONMENT` to enable.");


// end include: shell.js
// include: preamble.js
// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html

var wasmBinary;
if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];legacyModuleProp('wasmBinary', 'wasmBinary');
var noExitRuntime = Module['noExitRuntime'] || true;legacyModuleProp('noExitRuntime', 'noExitRuntime');

if (typeof WebAssembly != 'object') {
  abort('no native wasm support detected');
}

// Wasm globals

var wasmMemory;

//========================================
// Runtime essentials
//========================================

// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed' + (text ? ': ' + text : ''));
  }
}

// We used to include malloc/free by default in the past. Show a helpful error in
// builds with assertions.
function _malloc() {
  abort("malloc() called but not included in the build - add '_malloc' to EXPORTED_FUNCTIONS");
}
function _free() {
  // Show a helpful error since we used to include free by default in the past.
  abort("free() called but not included in the build - add '_free' to EXPORTED_FUNCTIONS");
}

// Memory management

var HEAP,
/** @type {!Int8Array} */
  HEAP8,
/** @type {!Uint8Array} */
  HEAPU8,
/** @type {!Int16Array} */
  HEAP16,
/** @type {!Uint16Array} */
  HEAPU16,
/** @type {!Int32Array} */
  HEAP32,
/** @type {!Uint32Array} */
  HEAPU32,
/** @type {!Float32Array} */
  HEAPF32,
/** @type {!Float64Array} */
  HEAPF64;

function updateMemoryViews() {
  var b = wasmMemory.buffer;
  Module['HEAP8'] = HEAP8 = new Int8Array(b);
  Module['HEAP16'] = HEAP16 = new Int16Array(b);
  Module['HEAP32'] = HEAP32 = new Int32Array(b);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(b);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(b);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(b);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(b);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(b);
}

assert(!Module['STACK_SIZE'], 'STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time')

assert(typeof Int32Array != 'undefined' && typeof Float64Array !== 'undefined' && Int32Array.prototype.subarray != undefined && Int32Array.prototype.set != undefined,
       'JS engine does not provide full typed array support');

// If memory is defined in wasm, the user can't provide it, or set INITIAL_MEMORY
assert(!Module['wasmMemory'], 'Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally');
assert(!Module['INITIAL_MEMORY'], 'Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically');

// include: runtime_init_table.js
// In regular non-RELOCATABLE mode the table is exported
// from the wasm module and this will be assigned once
// the exports are available.
var wasmTable;
// end include: runtime_init_table.js
// include: runtime_stack_check.js
// Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
function writeStackCookie() {
  var max = _emscripten_stack_get_end();
  assert((max & 3) == 0);
  // If the stack ends at address zero we write our cookies 4 bytes into the
  // stack.  This prevents interference with SAFE_HEAP and ASAN which also
  // monitor writes to address zero.
  if (max == 0) {
    max += 4;
  }
  // The stack grow downwards towards _emscripten_stack_get_end.
  // We write cookies to the final two words in the stack and detect if they are
  // ever overwritten.
  HEAPU32[((max)>>2)] = 0x02135467;
  HEAPU32[(((max)+(4))>>2)] = 0x89BACDFE;
  // Also test the global address 0 for integrity.
  HEAPU32[((0)>>2)] = 1668509029;
}

function checkStackCookie() {
  if (ABORT) return;
  var max = _emscripten_stack_get_end();
  // See writeStackCookie().
  if (max == 0) {
    max += 4;
  }
  var cookie1 = HEAPU32[((max)>>2)];
  var cookie2 = HEAPU32[(((max)+(4))>>2)];
  if (cookie1 != 0x02135467 || cookie2 != 0x89BACDFE) {
    abort(`Stack overflow! Stack cookie has been overwritten at ${ptrToString(max)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${ptrToString(cookie2)} ${ptrToString(cookie1)}`);
  }
  // Also test the global address 0 for integrity.
  if (HEAPU32[((0)>>2)] != 0x63736d65 /* 'emsc' */) {
    abort('Runtime error: The application has corrupted its heap memory area (address zero)!');
  }
}
// end include: runtime_stack_check.js
// include: runtime_assertions.js
// Endianness check
(function() {
  var h16 = new Int16Array(1);
  var h8 = new Int8Array(h16.buffer);
  h16[0] = 0x6373;
  if (h8[0] !== 0x73 || h8[1] !== 0x63) throw 'Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)';
})();

// end include: runtime_assertions.js
var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the main() is called

var runtimeInitialized = false;

var runtimeKeepaliveCounter = 0;

function keepRuntimeAlive() {
  return noExitRuntime || runtimeKeepaliveCounter > 0;
}

function preRun() {
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
  assert(!runtimeInitialized);
  runtimeInitialized = true;

  checkStackCookie();

  
if (!Module["noFSInit"] && !FS.init.initialized)
  FS.init();
FS.ignorePermissions = false;

TTY.init();
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  checkStackCookie();
  
  callRuntimeCallbacks(__ATMAIN__);
}

function postRun() {
  checkStackCookie();

  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}

function addOnExit(cb) {
}

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}

// include: runtime_math.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc

assert(Math.imul, 'This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.fround, 'This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.clz32, 'This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.trunc, 'This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
// end include: runtime_math.js
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// Module.preRun (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
var runDependencyTracking = {};

function getUniqueRunDependency(id) {
  var orig = id;
  while (1) {
    if (!runDependencyTracking[id]) return id;
    id = orig + Math.random();
  }
}

function addRunDependency(id) {
  runDependencies++;

  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }

  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
    if (runDependencyWatcher === null && typeof setInterval != 'undefined') {
      // Check for missing dependencies every few seconds
      runDependencyWatcher = setInterval(() => {
        if (ABORT) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
          return;
        }
        var shown = false;
        for (var dep in runDependencyTracking) {
          if (!shown) {
            shown = true;
            err('still waiting on run dependencies:');
          }
          err('dependency: ' + dep);
        }
        if (shown) {
          err('(end of list)');
        }
      }, 10000);
    }
  } else {
    err('warning: run dependency added without ID');
  }
}

function removeRunDependency(id) {
  runDependencies--;

  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }

  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    err('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}

/** @param {string|number=} what */
function abort(what) {
  if (Module['onAbort']) {
    Module['onAbort'](what);
  }

  what = 'Aborted(' + what + ')';
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);

  ABORT = true;
  EXITSTATUS = 1;

  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  // FIXME This approach does not work in Wasm EH because it currently does not assume
  // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
  // a trap or not based on a hidden field within the object. So at the moment
  // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
  // allows this in the wasm spec.

  // Suppress closure compiler warning here. Closure compiler's builtin extern
  // defintion for WebAssembly.RuntimeError claims it takes no arguments even
  // though it can.
  // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
  /** @suppress {checkTypes} */
  var e = new WebAssembly.RuntimeError(what);

  readyPromiseReject(e);
  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

// include: memoryprofiler.js
// end include: memoryprofiler.js
// include: URIUtils.js
// Prefix of data URIs emitted by SINGLE_FILE and related options.
var dataURIPrefix = 'data:application/octet-stream;base64,';

// Indicates whether filename is a base64 data URI.
function isDataURI(filename) {
  // Prefix of data URIs emitted by SINGLE_FILE and related options.
  return filename.startsWith(dataURIPrefix);
}

// Indicates whether filename is delivered via file protocol (as opposed to http/https)
function isFileURI(filename) {
  return filename.startsWith('file://');
}
// end include: URIUtils.js
/** @param {boolean=} fixedasm */
function createExportWrapper(name, fixedasm) {
  return function() {
    var displayName = name;
    var asm = fixedasm;
    if (!fixedasm) {
      asm = Module['asm'];
    }
    assert(runtimeInitialized, 'native function `' + displayName + '` called before runtime initialization');
    if (!asm[name]) {
      assert(asm[name], 'exported native function `' + displayName + '` not found');
    }
    return asm[name].apply(null, arguments);
  };
}

// include: runtime_exceptions.js
// end include: runtime_exceptions.js
var wasmBinaryFile;
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAAB/YSAgABUYAF/AX9gAn9/AX9gAn9/AGADf39/AX9gAX8AYAN/f38AYAAAYAZ/f39/f38Bf2AAAX9gBX9/f39/AX9gBH9/f38AYAZ/f39/f38AYAR/f39/AX9gCH9/f39/f39/AX9gBX9/f39/AGABfAF8YAABfmAHf39/f39/fwF/YAN/fHwBf2ACf38BfmAHf39/f39/fwBgBX9+fn5+AGACf38BfWABfwF+YAJ/fwF8YAJ/fABgAX8BfWADf35/AX5gBX9/f39+AX9gAXwAYAV/f39/fAF/YAR/f39/AX5gBn9/f39+fwF/YAp/f39/f39/f39/AGAHf39/f39+fgF/YAJ8fwF8YAF/AXxgBH9+fn8AYAV/f35/fwBgCn9/f39/f39/f38Bf2AGf39/f35+AX9gAAF8YAABfWABfAF+YAJ8fAF8YAN8fH8BfGABfgF/YAR+fn5+AX9gBH9/f34BfmAGf3x/f39/AX9gAn5/AX9gA39/fwF+YAN/f38BfWADf39/AXxgDH9/f39/f39/f39/fwF/YAZ/f39/fH8Bf2AHf39/f35+fwF/YAt/f39/f39/f39/fwF/YA9/f39/f39/f39/f39/f38AYAh/f39/f39/fwBgBH9/f3wAYAR/f399AGACfH8Bf2ACf3wBfGABfAF/YAJ+fwF8YAN8fn4BfGACf30AYAJ/fgF/YAJ/fAF/YAJ/fgBgAn5+AX9gA39+fgBgAn5+AX1gAn5+AXxgA39/fgBgA35/fwF/YAN/f3wAYAZ/f39+f38AYAR/f35/AX5gBn9/f39/fgF/YAh/f39/f39+fgF/YAl/f39/f39/f38Bf2AEf35/fwF/AriDgIAADwNlbnYYZW1zY3JpcHRlbl9zZXRfbWFpbl9sb29wAAUDZW52C19fY3hhX3Rocm93AAUDZW52E2Vtc2NyaXB0ZW5fZGF0ZV9ub3cAKQNlbnYgX2Vtc2NyaXB0ZW5fZ2V0X25vd19pc19tb25vdG9uaWMACANlbnYSZW1zY3JpcHRlbl9nZXRfbm93ACkDZW52FmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAAAANlbnYVZW1zY3JpcHRlbl9tZW1jcHlfYmlnAAUWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF93cml0ZQAMFndhc2lfc25hcHNo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dHlwZQDWDw5keW5DYWxsX3ZpaWppaQDwDwxkeW5DYWxsX2ppamkA8Q8OZHluQ2FsbF9paWlpaWoA8g8PZHluQ2FsbF9paWlpaWpqAPMPEGR5bkNhbGxfaWlpaWlpamoA9A8JiIaAgAABAEEBC4IDTmKJAWj8AtcP/QH/AYACigKMAo4CkAKSApMC/gGUArsPygL9Av4CqwOsA64DrwOwA7IDswO0A7UDvAO9A78DwAPBA8MDxQPEA8YD1wPZA9gD2gPlA+YD6APpA+oD6wPsA+0D7gPzA/UD9wP4A/kD+wP9A/wD/gORBJMEkgSUBKkDqgPjA+QDiwWMBZQDkgOQA5EFkQOSBaAFtwW5BboFuwW9Bb4FwwXEBcUFxgXHBcgFyQXLBc0FzgXRBdIF0wXVBdYF/AWYBpkGnAaIA+gIkguaC40MkAyUDJcMmgydDJ8MoQyjDKUMpwypDKsMrQyCC4YLlgutC64LrwuwC7ELsguzC7QLtQu2C4wKwQvCC8ULyAvJC8wLzQvPC/gL+Qv8C/4LgAyCDIYM+gv7C/0L/wuBDIMMhwy4BpULnAudC54LnwugC6ELowukC6YLpwuoC6kLqgu3C7gLuQu6C7sLvAu9C74L0AvRC9ML1QvWC9cL2AvaC9sL3AvdC94L3wvgC+EL4gvjC+QL5gvoC+kL6gvrC+0L7gvvC/AL8QvyC/ML9Av1C7cGuQa6BrsGvga/BsAGwQbCBscGsQzIBtUG3gbhBuQG5wbqBu0G8gb1BvgGsgz/BokHjgeQB5IHlAeWB5gHnAeeB6AHswytB7UHuwe9B78HwQfKB8wHtAzNB9YH2gfcB94H4AfmB+gHtQy3DPEH8gfzB/QH9gf4B/sHiwySDJgMpgyqDJ4Mogy4DLoMigiLCIwIkgiUCJYImQiODJUMmwyoDKwMoAykDLsMvAymCL4MvQysCL8Mswi2CLcIuAi5CLoIuwi8CL0IwAy+CL8IwAjBCMIIwwjECMUIxgjBDMcIygjLCMwIzwjQCNEI0gjTCMIM1AjVCNYI1wjYCNkI2gjbCNwIwwznCP8IxAymCbgJxQzkCfAJxgzxCf4JxwyGCocKiArIDIkKigqLCtAO0Q68D78PvQ++D8QP1Q/SD8cPwA/UD9EPyA/BD9MPzg/LD9sP3A/eD98P2A/ZDwqoi4uAAOcPEwAQ4Q8Q2AUQ/gUQ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gICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNAEF/IQQgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LQX8hBCAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL2AECAX8CfkF/IQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQAgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAtTAQF+AkACQCADQcAAcUUNACABIANBQGqthiECQgAhAQwBCyADRQ0AIAFBwAAgA2utiCACIAOtIgSGhCECIAEgBIYhAQsgACABNwMAIAAgAjcDCAvhAQIDfwJ+IwBBEGsiAiQAAkACQCABvCIDQf////8HcSIEQYCAgHxqQf////cHSw0AIAStQhmGQoCAgICAgIDAP3whBUIAIQYMAQsCQCAEQYCAgPwHSQ0AIAOtQhmGQoCAgICAgMD//wCEIQVCACEGDAELAkAgBA0AQgAhBkIAIQUMAQsgAiAErUIAIARnIgRB0QBqEO4CIAJBCGopAwBCgICAgICAwACFQYn/ACAEa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIANBgICAgHhxrUIghoQ3AwggAkEQaiQACwYAQay+BQviAQICfAF+AkBBAC0AsL4FDQBBABADOgCxvgVBsL4FQQE6AAALAkACQAJAAkAgAA4FAgABAQABC0EALQCxvgVFDQAQBCECDAILEPACQRw2AgBBfw8LEAIhAgsCQAJAIAJEAAAAAABAj0CjIgOZRAAAAAAAAOBDY0UNACADsCEEDAELQoCAgICAgICAgH8hBAsgASAENwMAAkACQCACIARC6Ad+uaFEAAAAAABAj0Ci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DQAgA0H/////BzYCDCADIAYgBWs2AgggAyACIARrNgIEIANBDGogA0EIaiADQQRqELYDELYDIQUgASAAKAIMIAUoAgAiBRC3AxogACAFELgDDAELIAAgACgCACgCKBEAACIFQX9GDQIgASAFELkDOgAAQQEhBQsgASAFaiEBIAUgBGohBAwACwALIANBEGokACAECwkAIAAgARC6AwsOACABIAIgABC7AxogAAsPACAAIAAoAgwgAWo2AgwLBQAgAMALKQECfyMAQRBrIgIkACACQQ9qIAEgABC0BCEDIAJBEGokACABIAAgAxsLDgAgACAAIAFqIAIQtQQLBAAQKwszAQF/AkAgACAAKAIAKAIkEQAAECtHDQAQKw8LIAAgACgCDCIBQQFqNgIMIAEsAAAQvgMLCAAgAEH/AXELBAAQKwu8AQEFfyMAQRBrIgMkAEEAIQQQKyEFAkADQCACIARMDQECQCAAKAIYIgYgACgCHCIHSQ0AIAAgASwAABC+AyAAKAIAKAI0EQEAIAVGDQIgBEEBaiEEIAFBAWohAQwBCyADIAcgBms2AgwgAyACIARrNgIIIANBDGogA0EIahC2AyEGIAAoAhggASAGKAIAIgYQtwMaIAAgBiAAKAIYajYCGCAGIARqIQQgASAGaiEBDAALAAsgA0EQaiQAIAQLBAAQKwsEACAACxYAIABBrNEEEMIDIgBBCGoQqQMaIAALEwAgACAAKAIAQXRqKAIAahDDAwsKACAAEMMDEOIOCxMAIAAgACgCAEF0aigCAGoQxQMLBwAgABDOAwsHACAAKAJIC3cBAX8jAEEQayIBJAACQCAAIAAoAgBBdGooAgBqECpFDQAgAUEIaiAAENsDGgJAIAFBCGoQHUUNACAAIAAoAgBBdGooAgBqECoQzwNBf0cNACAAIAAoAgBBdGooAgBqQQEQIwsgAUEIahDcAxoLIAFBEGokACAACwkAIAAgARDQAwsLACAAKAIAENEDwAsuAQF/QQAhAwJAIAJBAEgNACAAKAIIIAJB/wFxQQJ0aigCACABcUEARyEDCyADCw0AIAAoAgAQ0gMaIAALCAAgACgCEEULDwAgACAAKAIAKAIYEQAACxAAIAAQggUgARCCBXNBAXMLLAEBfwJAIAAoAgwiASAAKAIQRw0AIAAgACgCACgCJBEAAA8LIAEsAAAQ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BBDzBEEBahD0BCADKAIIIgUgAygCDBD1BCAAIAUQ9gQgACADKAIMEPcEIAAgBBD4BAsCQANAIAEgAkYNASAFIAEQ6AQgBUEBaiEFIAFBAWohAQwACwALIANBADoAByAFIANBB2oQ6AQgA0EQaiQADwsgABD5BAALHgEBf0EKIQECQCAAEDdFDQAgABCoBEF/aiEBCyABCwsAIAAgAUEAEPwOCxAAIAAQOigCCEH/////B3ELFwACQCAAECsQLEUNABArQX9zIQALIAALBgAgABAVCwsAIABBwN4FEM0GCw8AIAAgACgCACgCHBEAAAsJACAAIAEQsAQLHQAgACABIAIgAyAEIAUgBiAHIAAoAgAoAhARDQALBQAQCgALKQECfyMAQRBrIgIkACACQQ9qIAEgABCBBSEDIAJBEGokACABIAAgAxsLHQAgACABIAIgAyAEIAUgBiAHIAAoAgAoAgwRDQALDwAgACAAKAIAKAIYEQAACxcAIAAgASACIAMgBCAAKAIAKAIUEQkACw0AIAEoAgAgAigCAEgLKwEBfyMAQRBrIgMkACADQQhqIAAgASACELYEIAMoAgwhAiADQRBqJAAgAgsNACAAIAEgAiADELcECw0AIAAgASACIAMQuAQLaQEBfyMAQSBrIgQkACAEQRhqIAEgAhC5BCAEQRBqIARBDGogBCgCGCAEKAIcIAMQugQQuwQgBCABIAQoAhAQvAQ2AgwgBCADIAQoAhQQvQQ2AgggACAEQQxqIARBCGoQvgQgBEEgaiQACwsAIAAgASACEL8ECwcAIAAQwQQLDQAgACACIAMgBBDABAsJACAAIAEQwwQLCQAgACABEMQECwwAIAAgASACEMIEGgs4AQF/IwBBEGsiAyQAIAMgARDFBDYCDCADIAIQxQQ2AgggACADQQxqIANBCGoQxgQaIANBEGokAAtAAQF/IwBBEGsiBCQAIAQgAjYCDCAEIAMgASACIAFrIgIQpAMgAmo2AgggACAEQQxqIARBCGoQyAQgBEEQaiQACwYAIAAQMgsYACAAIAEoAgA2AgAgACACKAIANgIEIAALCQAgACABEMoECwwAIAAgASAAEDJragsHACAAEMcECxgAIAAgASgCADYCACAAIAIoAgA2AgQgAAsGACAAEEMLDAAgACABIAIQyQQaCxgAIAAgASgCADYCACAAIAIoAgA2AgQgAAsJACAAIAEQywQLDAAgACABIAAQQ2tqCysBAX8jAEEQayIDJAAgA0EIaiAAIAEgAhDNBCADKAIMIQIgA0EQaiQAIAILDQAgACABIAIgAxDOBAsNACAAIAEgAiADEM8EC2kBAX8jAEEgayIEJAAgBEEYaiABIAIQ0AQgBEEQaiAEQQxqIAQoAhggBCgCHCADENEEENIEIAQgASAEKAIQENMENgIMIAQgAyAEKAIUENQENgIIIAAgBEEMaiAEQQhqENUEIARBIGokAAsLACAAIAEgAhDWBAsHACAAENgECw0AIAAgAiADIAQQ1wQLCQAgACABENoECwkAIAAgARDbBAsMACAAIAEgAhDZBBoLOAEBfyMAQRBrIgMkACADIAEQ3AQ2AgwgAyACENwENgIIIAAgA0EMaiADQQhqEN0EGiADQRBqJAALQAEBfyMAQRBrIgQkACAEIAI2AgwgBCADIAEgAiABayICEKQDIAJqNgIIIAAgBEEMaiAEQQhqEOAEIARBEGokAAsHACAAEOIECxgAIAAgASgCADYCACAAIAIoAgA2AgQgAAsJACAAIAEQ4wQLDQAgACABIAAQ4gRragsHACAAEN4ECxgAIAAgASgCADYCACAAIAIoAgA2AgQgAAsHACAAEN8ECwQAIAALDAAgACABIAIQ4QQaCxgAIAAgASgCADYCACAAIAIoAgA2AgQgAAsEACAACwkAIAAgARDkBAsNACAAIAEgABDfBGtqCwsAIAAgASACEOkECwkAIAAgARDrBAsrAQF/IAAQOyICIAItAAtBgAFxIAFyOgALIAAQOyIAIAAtAAtB/wBxOgALCwwAIAAgAS0AADoAAAsLACABIAJBARCoAQsHACAAEOwECw4AIAEQoQQaIAAQoQQaCwQAIAALBwAgABDuBAsEACAACwQAIAALCQAgACABEPoECxkAIAAQowQQ+wQiACAAEPwEQQF2S3ZBcGoLBwAgAEELSQstAQF/QQohAQJAIABBC0kNACAAQQFqEP8EIgAgAEF/aiIAIABBC0YbIQELIAELGQAgASACEP4EIQEgACACNgIEIAAgATYCAAsCAAsLACAAEDsgATYCAAs4AQF/IAAQOyICIAIoAghBgICAgHhxIAFB/////wdxcjYCCCAAEDsiACAAKAIIQYCAgIB4cjYCCAsLACAA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ACABNwNwIAAgACgCLCAAKAIEIgJrrDcDeCAAKAIIIQMCQCABUA0AIAMgAmusIAFXDQAgAiABp2ohAwsgACADNgJoC90BAgN/An4gACkDeCAAKAIEIgEgACgCLCICa6x8IQQCQAJAAkAgACkDcCIFUA0AIAQgBVkNAQsgABCYBSICQX9KDQEgACgCBCEBIAAoAiwhAgsgAEJ/NwNwIAAgATYCaCAAIAQgAiABa6x8NwN4QX8PCyAEQgF8IQQgACgCBCEBIAAoAgghAwJAIAApA3AiBUIAUQ0AIAUgBH0iBSADIAFrrFkNACABIAWnaiEDCyAAIAM2AmggACAEIAAoAiwiAyABa6x8NwN4AkAgASADSw0AIAFBf2ogAjoAAAsgAgsKACAAQVBqQQpJCwcAIAAQ3AULjQECAn8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhBEIAIQUMAQsgAiABIAFBH3UiA3MgA2siA61CACADZyIDQdEAahDuAiACQQhqKQMAQoCAgICAgMAAhUGegAEgA2utQjCGfCABQYCAgIB4ca1CIIaEIQUgAikDACEECyAAIAQ3AwAgACAFNwMIIAJBEGokAAtTAQF+AkACQCADQcAAcUUNACACIANBQGqtiCEBQgAhAgwBCyADRQ0AIAJBwAAgA2uthiABIAOtIgSIhCEBIAIgBIghAgsgACABNwMAIAAgAjcDCAuaCwIFfw9+IwBB4ABrIgUkACAEQv///////z+DIQogBCAChUKAgICAgICAgIB/gyELIAJC////////P4MiDEIgiCENIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyIOQoCAgICAgMD//wBUIA5CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCELDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCELIAMhAQwCCwJAIAEgDkKAgICAgIDA//8AhYRCAFINAAJAIAMgAoRQRQ0AQoCAgICAgOD//wAhC0IAIQEMAwsgC0KAgICAgIDA//8AhCELQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINACABIA6EIQJCACEBAkAgAlBFDQBCgICAgICA4P//ACELDAMLIAtCgICAgICAwP//AIQhCwwCCwJAIAEgDoRCAFINAEIAIQEMAgsCQCADIAKEQgBSDQBCACEBDAILQQAhCAJAIA5C////////P1YNACAFQdAAaiABIAwgASAMIAxQIggbeSAIQQZ0rXynIghBcWoQ7gJBECAIayEIIAVB2ABqKQMAIgxCIIghDSAFKQNQIQELIAJC////////P1YNACAFQcAAaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQ7gIgCCAJa0EQaiEIIAVByABqKQMAIQogBSkDQCEDCyADQg+GIg5CgID+/w+DIgIgAUIgiCIEfiIPIA5CIIgiDiABQv////8PgyIBfnwiEEIghiIRIAIgAX58IhIgEVStIAIgDEL/////D4MiDH4iEyAOIAR+fCIRIANCMYggCkIPhiIUhEL/////D4MiAyABfnwiCiAQQiCIIBAgD1StQiCGhHwiDyACIA1CgIAEhCIQfiIVIA4gDH58Ig0gFEIgiEKAgICACIQiAiABfnwiFCADIAR+fCIWQiCGfCIXfCEBIAcgBmogCGpBgYB/aiEGAkACQCACIAR+IhggDiAQfnwiBCAYVK0gBCADIAx+fCIOIARUrXwgAiAQfnwgDiARIBNUrSAKIBFUrXx8IgQgDlStfCADIBB+IgMgAiAMfnwiAiADVK1CIIYgAkIgiIR8IAQgAkIghnwiAiAEVK18IAIgFkIgiCANIBVUrSAUIA1UrXwgFiAUVK18QiCGhHwiBCACVK18IAQgDyAKVK0gFyAPVK18fCICIARUrXwiBEKAgICAgIDAAINQDQAgBkEBaiEGDAELIBJCP4ghAyAEQgGGIAJCP4iEIQQgAkIBhiABQj+IhCECIBJCAYYhEiADIAFCAYaEIQELAkAgBkH//wFIDQAgC0KAgICAgIDA//8AhCELQgAhAQwBCwJAAkAgBkEASg0AAkBBASAGayIHQf8ASw0AIAVBMGogEiABIAZB/wBqIgYQ7gIgBUEgaiACIAQgBhDuAiAFQRBqIBIgASAHEN8FIAUgAiAEIAcQ3wUgBSkDICAFKQMQhCAFKQMwIAVBMGpBCGopAwCEQgBSrYQhEiAFQSBqQQhqKQMAIAVBEGpBCGopAwCEIQEgBUEIaikDACEEIAUpAwAhAgwCC0IAIQEMAgsgBq1CMIYgBEL///////8/g4QhBAsgBCALhCELAkAgElAgAUJ/VSABQoCAgICAgICAgH9RGw0AIAsgAkIBfCIBUK18IQsMAQsCQCASIAFCgICAgICAgICAf4WEQgBRDQAgAiEBDAELIAsgAiACQgGDfCIBIAJUrXwhCwsgACABNwMAIAAgCzcDCCAFQeAAaiQACwQAQQALBABBAAvoCgIEfwR+IwBB8ABrIgUkACAEQv///////////wCDIQkCQAJAAkAgAVAiBiACQv///////////wCDIgpCgICAgICAwICAf3xCgICAgICAwICAf1QgClAbDQAgA0IAUiAJQoCAgICAgMCAgH98IgtCgICAgICAwICAf1YgC0KAgICAgIDAgIB/URsNAQsCQCAGIApCgICAgICAwP//AFQgCkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQQgASEDDAILAkAgA1AgCUKAgICAgIDA//8AVCAJQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhBAwCCwJAIAEgCkKAgICAgIDA//8AhYRCAFINAEKAgICAgIDg//8AIAIgAyABhSAEIAKFQoCAgICAgICAgH+FhFAiBhshBEIAIAEgBhshAwwCCyADIAlCgICAgICAwP//AIWEUA0BAkAgASAKhEIAUg0AIAMgCYRCAFINAiADIAGDIQMgBCACgyEEDAILIAMgCYRQRQ0AIAEhAyACIQQMAQsgAyABIAMgAVYgCSAKViAJIApRGyIHGyEJIAQgAiAHGyILQv///////z+DIQogAiAEIAcbIgJCMIinQf//AXEhCAJAIAtCMIinQf//AXEiBg0AIAVB4ABqIAkgCiAJIAogClAiBht5IAZBBnStfKciBkFxahDuAkEQIAZrIQYgBUHoAGopAwAhCiAFKQNgIQkLIAEgAyAHGyEDIAJC////////P4MhBAJAIAgNACAFQdAAaiADIAQgAyAEIARQIgcbeSAHQQZ0rXynIgdBcWoQ7gJBECAHayEIIAVB2ABqKQMAIQQgBSkDUCEDCyAEQgOGIANCPYiEQoCAgICAgIAEhCEBIApCA4YgCUI9iIQhBCADQgOGIQogCyAChSEDAkAgBiAIRg0AAkAgBiAIayIHQf8ATQ0AQgAhAUIBIQoMAQsgBUHAAGogCiABQYABIAdrEO4CIAVBMGogCiABIAcQ3wUgBSkDMCAFKQNAIAVBwABqQQhqKQMAhEIAUq2EIQogBUEwakEIaikDACEBCyAEQoCAgICAgIAEhCEMIAlCA4YhCQJAAkAgA0J/VQ0AQgAhA0IAIQQgCSAKhSAMIAGFhFANAiAJIAp9IQIgDCABfSAJIApUrX0iBEL/////////A1YNASAFQSBqIAIgBCACIAQgBFAiBxt5IAdBBnStfKdBdGoiBxDuAiAGIAdrIQYgBUEoaikDACEEIAUpAyAhAgwBCyABIAx8IAogCXwiAiAKVK18IgRCgICAgICAgAiDUA0AIAJCAYggBEI/hoQgCkIBg4QhAiAGQQFqIQYgBEIBiCEECyALQoCAgICAgICAgH+DIQoCQCAGQf//AUgNACAKQoCAgICAgMD//wCEIQRCACEDDAELQQAhBwJAAkAgBkEATA0AIAYhBwwBCyAFQRBqIAIgBCAGQf8AahDuAiAFIAIgBEEBIAZrEN8FIAUpAwAgBSkDECAFQRBqQQhqKQMAhEIAUq2EIQIgBUEIaikDACEECyACQgOIIARCPYaEIQMgB61CMIYgBEIDiEL///////8/g4QgCoQhBCACp0EHcSEGAkACQAJAAkACQBDhBQ4DAAECAwsgBCADIAZBBEutfCIKIANUrXwhBAJAIAZBBEYNACAKIQMMAwsgBCAKQgGDIgEgCnwiAyABVK18IQQMAwsgBCADIApCAFIgBkEAR3GtfCIKIANUrXwhBCAKIQMMAQsgBCADIApQIAZBAEdxrXwiCiADVK18IQQgCiEDCyAGRQ0BCxDiBRoLIAAgAzcDACAAIAQ3AwggBUHwAGokAAuOAgICfwN+IwBBEGsiAiQAAkACQCABvSIEQv///////////wCDIgVCgICAgICAgHh8Qv/////////v/wBWDQAgBUI8hiEGIAVCBIhCgICAgICAgIA8fCEFDAELAkAgBUKAgICAgICA+P8AVA0AIARCPIYhBiAEQgSIQoCAgICAgMD//wCEIQUMAQsCQCAFUEUNAEIAIQZCACEFDAELIAIgBUIAIASnZ0EgaiAFQiCIp2cgBUKAgICAEFQbIgNBMWoQ7gIgAkEIaikDAEKAgICAgIDAAIVBjPgAIANrrUIwhoQhBSACKQMAIQYLIAAgBjcDACAAIAUgBEKAgICAgICAgIB/g4Q3AwggAkEQaiQACzUAIAAgATcDACAAIARCMIinQYCAAnEgAkIwiKdB//8BcXKtQjCGIAJC////////P4OENwMIC3ICAX8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhA0IAIQQMAQsgAiABrUIAIAFnIgFB0QBqEO4CIAJBCGopAwBCgICAgICAwACFQZ6AASABa61CMIZ8IQQgAikDACEDCyAAIAM3AwAgACAENwMIIAJBEGokAAtIAQF/IwBBEGsiBSQAIAUgASACIAMgBEKAgICAgICAgIB/hRDjBSAFKQMAIQQgACAFQQhqKQMANwMIIAAgBDcDACAFQRBqJAAL5wIBAX8jAEHQAGsiBCQAAkACQCADQYCAAUgNACAEQSBqIAEgAkIAQoCAgICAgID//wAQ4AUgBEEgakEIaikDACECIAQpAyAhAQJAIANB//8BTw0AIANBgYB/aiEDDAILIARBEGogASACQgBCgICAgICAgP//ABDgBSADQf3/AiADQf3/AkgbQYKAfmohAyAEQRBqQQhqKQMAIQIgBCkDECEBDAELIANBgYB/Sg0AIARBwABqIAEgAkIAQoCAgICAgIA5EOAFIARBwABqQQhqKQMAIQIgBCkDQCEBAkAgA0H0gH5NDQAgA0GN/wBqIQMMAQsgBEEwaiABIAJCAEKAgICAgICAORDgBSADQeiBfSADQeiBfUobQZr+AWohAyAEQTBqQQhqKQMAIQIgBCkDMCEBCyAEIAEgAkIAIANB//8Aaq1CMIYQ4AUgACAEQQhqKQMANwMIIAAgBCkDADcDACAEQdAAaiQAC3UBAX4gACAEIAF+IAIgA358IANCIIgiAiABQiCIIgR+fCADQv////8PgyIDIAFC/////w+DIgF+IgVCIIggAyAEfnwiA0IgiHwgA0L/////D4MgAiABfnwiAUIgiHw3AwggACABQiCGIAVC/////w+DhDcDAAvnEAIFfw9+IwBB0AJrIgUkACAEQv///////z+DIQogAkL///////8/gyELIAQgAoVCgICAgICAgICAf4MhDCAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDUKAgICAgIDA//8AVCANQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhDAwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhDCADIQEMAgsCQCABIA1CgICAgICAwP//AIWEQgBSDQACQCADIAJCgICAgICAwP//AIWEUEUNAEIAIQFCgICAgICA4P//ACEMDAMLIAxCgICAgICAwP//AIQhDEIAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQBCACEBDAILAkAgASANhEIAUg0AQoCAgICAgOD//wAgDCADIAKEUBshDEIAIQEMAgsCQCADIAKEQgBSDQAgDEKAgICAgIDA//8AhCEMQgAhAQwCC0EAIQgCQCANQv///////z9WDQAgBUHAAmogASALIAEgCyALUCIIG3kgCEEGdK18pyIIQXFqEO4CQRAgCGshCCAFQcgCaikDACELIAUpA8ACIQELIAJC////////P1YNACAFQbACaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQ7gIgCSAIakFwaiEIIAVBuAJqKQMAIQogBSkDsAIhAwsgBUGgAmogA0IxiCAKQoCAgICAgMAAhCIOQg+GhCICQgBCgICAgLDmvIL1ACACfSIEQgAQ6QUgBUGQAmpCACAFQaACakEIaikDAH1CACAEQgAQ6QUgBUGAAmogBSkDkAJCP4ggBUGQAmpBCGopAwBCAYaEIgRCACACQgAQ6QUgBUHwAWogBEIAQgAgBUGAAmpBCGopAwB9QgAQ6QUgBUHgAWogBSkD8AFCP4ggBUHwAWpBCGopAwBCAYaEIgRCACACQgAQ6QUgBUHQAWogBEIAQgAgBUHgAWpBCGopAwB9QgAQ6QUgBUHAAWogBSkD0AFCP4ggBUHQAWpBCGopAwBCAYaEIgRCACACQgAQ6QUgBUGwAWogBEIAQgAgBUHAAWpBCGopAwB9QgAQ6QUgBUGgAWogAkIAIAUpA7ABQj+IIAVBsAFqQQhqKQMAQgGGhEJ/fCIEQgAQ6QUgBUGQAWogA0IPhkIAIARCABDpBSAFQfAAaiAEQgBCACAFQaABakEIaikDACAFKQOgASIKIAVBkAFqQQhqKQMAfCICIApUrXwgAkIBVq18fUIAEOkFIAVBgAFqQgEgAn1CACAEQgAQ6QUgCCAHIAZraiEGAkACQCAFKQNwIg9CAYYiECAFKQOAAUI/iCAFQYABakEIaikDACIRQgGGhHwiDUKZk398IhJCIIgiAiALQoCAgICAgMAAhCITQgGGIhRCIIgiBH4iFSABQgGGIhZCIIgiCiAFQfAAakEIaikDAEIBhiAPQj+IhCARQj+IfCANIBBUrXwgEiANVK18Qn98Ig9CIIgiDX58IhAgFVStIBAgD0L/////D4MiDyABQj+IIhcgC0IBhoRC/////w+DIgt+fCIRIBBUrXwgDSAEfnwgDyAEfiIVIAsgDX58IhAgFVStQiCGIBBCIIiEfCARIBBCIIZ8IhAgEVStfCAQIBJC/////w+DIhIgC34iFSACIAp+fCIRIBVUrSARIA8gFkL+////D4MiFX58IhggEVStfHwiESAQVK18IBEgEiAEfiIQIBUgDX58IgQgAiALfnwiDSAPIAp+fCIPQiCIIAQgEFStIA0gBFStfCAPIA1UrXxCIIaEfCIEIBFUrXwgBCAYIAIgFX4iAiASIAp+fCIKQiCIIAogAlStQiCGhHwiAiAYVK0gAiAPQiCGfCACVK18fCICIARUrXwiBEL/////////AFYNACAUIBeEIRMgBUHQAGogAiAEIAMgDhDpBSABQjGGIAVB0ABqQQhqKQMAfSAFKQNQIgFCAFKtfSENIAZB/v8AaiEGQgAgAX0hCgwBCyAFQeAAaiACQgGIIARCP4aEIgIgBEIBiCIEIAMgDhDpBSABQjCGIAVB4ABqQQhqKQMAfSAFKQNgIgpCAFKtfSENIAZB//8AaiEGQgAgCn0hCiABIRYLAkAgBkH//wFIDQAgDEKAgICAgIDA//8AhCEMQgAhAQwBCwJAAkAgBkEBSA0AIA1CAYYgCkI/iIQhDSAGrUIwhiAEQv///////z+DhCEPIApCAYYhBAwBCwJAIAZBj39KDQBCACEBDAILIAVBwABqIAIgBEEBIAZrEN8FIAVBMGogFiATIAZB8ABqEO4CIAVBIGogAyAOIAUpA0AiAiAFQcAAakEIaikDACIPEOkFIAVBMGpBCGopAwAgBUEgakEIaikDAEIBhiAFKQMgIgFCP4iEfSAFKQMwIgQgAUIBhiIBVK19IQ0gBCABfSEECyAFQRBqIAMgDkIDQgAQ6QUgBSADIA5CBUIAEOkFIA8gAiACQgGDIgEgBHwiBCADViANIAQgAVStfCIBIA5WIAEgDlEbrXwiAyACVK18IgIgAyACQoCAgICAgMD//wBUIAQgBSkDEFYgASAFQRBqQQhqKQMAIgJWIAEgAlEbca18IgIgA1StfCIDIAIgA0KAgICAgIDA//8AVCAEIAUpAwBWIAEgBUEIaikDACIEViABIARRG3GtfCIBIAJUrXwgDIQhDAsgACABNwMAIAAgDDcDCCAFQdACaiQAC0sCAX4CfyABQv///////z+DIQICQAJAIAFCMIinQf//AXEiA0H//wFGDQBBBCEEIAMNAUECQQMgAiAAhFAbDwsgAiAAhFAhBAsgBAvVBgIEfwN+IwBBgAFrIgUkAAJAAkACQCADIARCAEIAEOwCRQ0AIAMgBBDrBSEGIAJCMIinIgdB//8BcSIIQf//AUYNACAGDQELIAVBEGogASACIAMgBBDgBSAFIAUpAxAiBCAFQRBqQQhqKQMAIgMgBCADEOoFIAVBCGopAwAhAiAFKQMAIQQMAQsCQCABIAJC////////////AIMiCSADIARC////////////AIMiChDsAkEASg0AAkAgASAJIAMgChDsAkUNACABIQQMAgsgBUHwAGogASACQgBCABDgBSAFQfgAaikDACECIAUpA3AhBAwBCyAEQjCIp0H//wFxIQYCQAJAIAhFDQAgASEEDAELIAVB4ABqIAEgCUIAQoCAgICAgMC7wAAQ4AUgBUHoAGopAwAiCUIwiKdBiH9qIQggBSkDYCEECwJAIAYNACAFQdAAaiADIApCAEKAgICAgIDAu8AAEOAFIAVB2ABqKQMAIgpCMIinQYh/aiEGIAUpA1AhAwsgCkL///////8/g0KAgICAgIDAAIQhCyAJQv///////z+DQoCAgICAgMAAhCEJAkAgCCAGTA0AA0ACQAJAIAkgC30gBCADVK19IgpCAFMNAAJAIAogBCADfSIEhEIAUg0AIAVBIGogASACQgBCABDgBSAFQShqKQMAIQIgBSkDICEEDAULIApCAYYgBEI/iIQhCQwBCyAJQgGGIARCP4iEIQkLIARCAYYhBCAIQX9qIgggBkoNAAsgBiEICwJAAkAgCSALfSAEIANUrX0iCkIAWQ0AIAkhCgwBCyAKIAQgA30iBIRCAFINACAFQTBqIAEgAkIAQgAQ4AUgBUE4aikDACECIAUpAzAhBAwBCwJAIApC////////P1YNAANAIARCP4ghAyAIQX9qIQggBEIBhiEEIAMgCkIBhoQiCkKAgICAgIDAAFQNAAsLIAdBgIACcSEGAkAgCEEASg0AIAVBwABqIAQgCkL///////8/gyAIQfgAaiAGcq1CMIaEQgBCgICAgICAwMM/EOAFIAVByABqKQMAIQIgBSkDQCEEDAELIApC////////P4MgCCAGcq1CMIaEIQILIAAgBDcDACAAIAI3AwggBUGAAWokAAscACAAIAJC////////////AIM3AwggACABNwMAC4cJAgV/A34jAEEwayIEJABCACEJAkACQCACQQJLDQAgAkECdCICQbzbBGooAgAhBSACQbDbBGooAgAhBgNAAkACQCABKAIEIgIgASgCaEYNACABIAJBAWo2AgQgAi0AACECDAELIAEQ2wUhAgsgAhDZBQ0AC0EBIQcCQAJAIAJBVWoOAwABAAELQX9BASACQS1GGyEHAkAgASgCBCICIAEoAmhGDQAgASACQQFqNgIEIAItAAAhAgwBCyABENsFIQILQQAhCAJAAkACQANAIAJBIHIgCEGAgARqLAAARw0BAkAgCEEGSw0AAkAgASgCBCICIAEoAmhGDQAgASACQQFqNgIEIAItAAAhAgwBCyABENsFIQILIAhBAWoiCEEIRw0ADAILAAsCQCAIQQNGDQAgCEEIRg0BIANFDQIgCEEESQ0CIAhBCEYNAQsCQCABKQNwIglCAFMNACABIAEoAgRBf2o2AgQLIANFDQAgCEEESQ0AIAlCAFMhAgNAAkAgAg0AIAEgASgCBEF/ajYCBAsgCEF/aiIIQQNLDQALCyAEIAeyQwAAgH+UEO8CIARBCGopAwAhCiAEKQMAIQkMAgsCQAJAAkAgCA0AQQAhCANAIAJBIHIgCEGtggRqLAAARw0BAkAgCEEBSw0AAkAgASgCBCICIAEoAmhGDQAgASACQQFqNgIEIAItAAAhAgwBCyABENsFIQILIAhBAWoiCEEDRw0ADAILAAsCQAJAIAgOBAABAQIBCwJAIAJBMEcNAAJAAkAgASgCBCIIIAEoAmhGDQAgASAIQQFqNgIEIAgtAAAhCAwBCyABENsFIQgLAkAg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CgNAIAkgCn4iCyAHrUL/AYMiDEJ/hVYNAgJAAkAgACgCBCIFIAAoAmhGDQAgACAFQQFqNgIEIAUtAAAhBQwBCyAAENsFIQULIAsgDHwhCSABIAVB0dsEai0AACIHTQ0CIAQgCkIAIAlCABDpBSAEKQMIQgBSDQIMAAsACyABQRdsQQV2QQdxQdHdBGosAAAhCEIAIQkCQCABIAVB0dsEai0AACICTQ0AQQAhBwNAAkACQCAAKAIEIgUgACgCaEYNACAAIAVBAWo2AgQgBS0AACEFDAELIAAQ2wUhBQsgAiAHIAh0ciEHAkAgASAFQdHbBGotAAAiAk0NACAHQYCAgMAASQ0BCwsgB60hCQsgASACTQ0AQn8gCK0iC4giDCAJVA0AA0AgAq1C/wGDIQoCQAJAIAAoAgQiBSAAKAJoRg0AIAAgBUEBajYCBCAFLQAAIQUMAQsgABDbBSEFCyAJIAuGIAqEIQkgASAFQdHbBGotAAAiAk0NASAJIAxYDQALCyABIAVB0dsEai0AAE0NAANAAkACQCAAKAIEIgUgACgCaEYNACAAIAVBAWo2AgQgBS0AACEFDAELIAAQ2wUhBQsgASAFQdHbBGotAABLDQALEPACQcQANgIAIAZBACADQgGDUBshBiADIQkLAkAgACkDcEIAUw0AIAAgACgCBEF/ajYCBAsCQCAJIANUDQACQCADp0EBcQ0AIAYNABDwAkHEADYCACADQn98IQMMAgsgCSADWA0AEPACQcQANgIADAELIAkgBqwiA4UgA30hAwsgBEEQaiQAIAMLxAMCA38BfiMAQSBrIgIkAAJAAkAgAUL///////////8AgyIFQoCAgICAgMC/QHwgBUKAgICAgIDAwL9/fFoNACABQhmIpyEDAkAgAFAgAUL///8PgyIFQoCAgAhUIAVCgICACFEbDQAgA0GBgICABGohBAwCCyADQYCAgIAEaiEEIAAgBUKAgIAIhYRCAFINASAEIANBAXFqIQQMAQsCQCAAUCAFQoCAgICAgMD//wBUIAVCgICAgICAwP//AFEbDQAgAUIZiKdB////AXFBgICA/gdyIQQMAQtBgICA/AchBCAFQv///////7+/wABWDQBBACEEIAVCMIinIgNBkf4ASQ0AIAJBEGogACABQv///////z+DQoCAgICAgMAAhCIFIANB/4F/ahDuAiACIAAgBUGB/wAgA2sQ3wUgAkEIaikDACIFQhmIpyEEAkAgAikDACACKQMQIAJBEGpBCGopAwCEQgBSrYQiAFAgBUL///8PgyIFQoCAgAhUIAVCgICACFEbDQAgBEEBaiEEDAELIAAgBUKAgIAIhYRCAFINACAEQQFxIARqIQQLIAJBIGokACAEIAFCIIinQYCAgIB4cXK+C+QDAgJ/An4jAEEgayICJAACQAJAIAFC////////////AIMiBEKAgICAgIDA/0N8IARCgICAgICAwIC8f3xaDQAgAEI8iCABQgSGhCEEAkAgAEL//////////w+DIgBCgYCAgICAgIAIVA0AIARCgYCAgICAgIDAAHwhBQwCCyAEQoCAgICAgICAwAB8IQUgAEKAgICAgICAgAhSDQEgBSAEQgGDfCEFDAELAkAgAFAgBEKAgICAgIDA//8AVCAEQoCAgICAgMD//wBRGw0AIABCPIggAUIEhoRC/////////wODQoCAgICAgID8/wCEIQUMAQtCgICAgICAgPj/ACEFIARC////////v//DAFYNAEIAIQUgBEIwiKciA0GR9wBJDQAgAkEQaiAAIAFC////////P4NCgICAgICAwACEIgQgA0H/iH9qEO4CIAIgACAEQYH4ACADaxDfBSACKQMAIgRCPIggAkEIaikDAEIEhoQhBQJAIARC//////////8PgyACKQMQIAJBEGpBCGopAwCEQgBSrYQiBEKBgICAgICAgAhUDQAgBUIBfCEFDAELIARCgICAgICAgIAIUg0AIAVCAYMgBXwhBQsgAkEgaiQAIAUgAUKAgICAgICAgIB/g4S/C9wCAQR/IANBpNwFIAMbIgQoAgAhAwJAAkACQAJAIAENACADDQFBAA8LQX4hBSACRQ0BAkACQCADRQ0AIAIhBQwBCwJAIAEtAAAiBcAiA0EASA0AAkAgAEUNACAAIAU2AgALIANBAEcPCwJAEJYFKAJgKAIADQBBASEFIABFDQMgACABLAAAQf+/A3E2AgBBAQ8LIAEtAABBvn5qIgNBMksNASADQQJ0QeDdBGooAgAhAyACQX9qIgVFDQMgAUEBaiEBCyABLQAAIgZBA3YiB0FwaiADQRp1IAdqckEHSw0AA0AgBUF/aiEFAkAgBkH/AXFBgH9qIANBBnRyIgNBAEgN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IBMgD0obIgwgDkoNAyAAQSAgDCAPIBEQlgYgACAYIBAQkAYgAEEwIAwgDyARQYCABHMQlgYgAEEwIBQgEkEAEJYGIAAgDSASEJAGIABBICAMIA8gEUGAwABzEJYGDAELC0EAIQsMAwtBPSEWCxDwAiAWNgIAC0F/IQsLIAdB0ABqJAAgCwsZAAJAIAAtAABBIHENACABIAIgABCnAxoLC3QBA39BACEBAkAgACgCACwAABDcBQ0AQQAPCwNAIAAoAgAhAkF/IQMCQCABQcyZs+YASw0AQX8gAiwAAEFQaiIDIAFBCmwiAWogAyABQf////8Hc0obIQMLIAAgAkEBajYCACADIQEgAiwAARDcBQ0ACyADC7YEAAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAFBd2oOEgABAgUDBAYHCAkKCwwNDg8QERILIAIgAigCACIBQQRqNgIAIAAgASgCADYCAA8LIAIgAigCACIBQQRqNgIAIAAgATQCADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATUCADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATQCADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATUCADcDAA8LIAIgAigCAEEHakF4cSIBQQhqNgIAIAAgASkDADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATIBADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATMBADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATAAADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATEAADcDAA8LIAIgAigCAEEHakF4cSIBQQhqNgIAIAAgASkDADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATUCADcDAA8LIAIgAigCAEEHakF4cSIBQQhqNgIAIAAgASkDADcDAA8LIAIgAigCAEEHakF4cSIBQQhqNgIAIAAgASkDADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATQCADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATUCADcDAA8LIAIgAigCAEEHakF4cSIBQQhqNgIAIAAgASsDADkDAA8LIAAgAiADEQIACws+AQF/AkAgAFANAANAIAFBf2oiASAAp0EPcUHA5ARqLQAAIAJyOgAAIABCD1YhAyAAQgSIIQAg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IAAQpgQhBQJAIAEgAhDwBCIGRQ0AAkAgACABEIIJDQACQCAFIARrIAZPDQAgACAFIAYgBGogBWsgBCAEQQBBABDuDgsgABAxIARqIQUCQANAIAEgAkYNASAFIAEQ6AQgAUEBaiEBIAVBAWohBQwACwALIANBADoADyAFIANBD2oQ6AQgACAGIARqEIMJDAELIAAgAyABIAIgABChBBCiBCIBEBUgARAWEPYOGiABEOwOGgsgA0EQaiQAIAALJAEBf0EAIQICQCAAEBUgAUsNACAAEBUgABAWaiABTyECCyACCxsAAkAgABA3RQ0AIAAgARD4BA8LIAAgARDnBAsWACAAIAEQyA4iAUEEaiACEI8FGiABCwcAIAAQzA4LCwAgAEHE3QUQzQYLEQAgACABIAEoAgAoAiwRAgALEQAgACABIAEoAgAoAiARAgALEQAgACABIAEoAgAoAhwRAgALDwAgACAAKAIAKAIMEQAACw8AIAAgACgCACgCEBEAAAsRACAAIAEgASgCACgCFBECAAsRACAAIAEgASgCACgCGBECAAsPACAAIAAoAgAoAiQRAAALCwAgAEG83QUQzQYLEQAgACABIAEoAgAoAiwRAgALEQAgACABIAEoAgAoAiARAgALEQAgACABIAEoAgAoAhwRAgALDwAgACAAKAIAKAIMEQAACw8AIAAgACgCACgCEBEAAAsRACAAIAEgASgCACgCFBECAAsRACAAIAEgASgCACgCGBECAAsPACAAIAAoAgAoAiQRAAALEgAgACACNgIEIAAgAToAACAACwcAIAAoAgALDQAgABCbCSABEJkJRgsHACAAKAIAC3YBAX8jAEEQayIDJAAgAyABNgIIIAMgADYCDCADIAI2AgQCQANAIANBDGogA0EIahCwByIBRQ0BIANBA2ogA0EMahCxByADQQRqELEHEJMNRQ0BIANBDGoQsgcaIANBBGoQsgcaDAALAAsgA0EQaiQAIAFBAXMLMgEBfyMAQRBrIgIkACACIAAoAgA2AgwgAkEMaiABEJQNGiACKAIMIQAgAkEQaiQAIAALBwAgABD+CAsaAQF/IAAQ/QgoAgAhASAAEP0IQQA2AgAgAQsiACAAIAEQnwkQxwcgARCeCSgCACEBIAAQ/gggATYCACAACwcAIAAQyg4LGgEBfyAAEMkOKAIAIQEgABDJ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ARDTCSAIIApBBGoQygkaIApBBGoQgA8aIApBBGogARDUCSAHIApBBGoQygkaIApBBGoQgA8aIAMgARDVCTYCACAEIAEQ1gk2AgAgCkEEaiABENcJIAUgCkEEahCcBBogCkEEahDsDhogCkEEaiABENgJIAYgCkEEahDKCRogCkEEahCADxogARDZCSEBCyAJIAE2AgAgCkEQaiQACxUAIAAgASgCABCNBCABKAIAENoJGgsHACAAKAIACw0AIAAQ0wcgAUECdGoLDgAgACABENsJNgIAIAALDAAgACABENwJQQFzCwcAIAAoAgALEQAgACAAKAIAQQRqNgIAIAALEAAgABDdCSABENsJa0ECdQsMACAAQQAgAWsQ3wkLCwAgACABIAIQ3gkL5AEBBn8jAEEQayIDJAAgABDgCSgCACEEAkACQCACKAIAIAAQqAlrIgUQ/ARBAXZPDQAgBUEBdCEFDAELEPwEIQULIAVBBCAFGyEFIAEoAgAhBiAAEKgJIQcCQAJAIARB6QBHDQBBACEIDAELIAAQqAkhCAsCQCAIIAUQiQMiCEUNAAJAIARB6QBGDQAgABDhCRoLIANB6AA2AgQgACADQQhqIAggA0EEahDiByIEEOIJGiAEEOUHGiABIAAQqAkgBiAHa2o2AgAgAiAAEKgJIAVBfHFqNgIAIANBEGokAA8LEOAOAAsHACAAEM4OC60CAQJ/IwBBwANrIgckACAHIAI2ArgDIAcgATYCvAMgB0HpADYCFCAHQRhqIAdBIGogB0EUahDiByEIIAdBEGogBBCHBSAHQRBqEIIEIQEgB0EAOgAPAkAgB0G8A2ogAiADIAdBEGogBBAfIAUgB0EPaiABIAggB0EUaiAHQbADahCnCUUNACAGELkJAkAgBy0AD0UNACAGIAFBLRCEBRCLDwsgAUEwEIQFIQEgCBCoCSECIAcoAhQiA0F8aiEEAkADQCACIARPDQEgAigCACABRw0BIAJBBGohAgwACwALIAYgAiADELoJGgsCQCAHQbwDaiAHQbgDahCDBEUNACAFIAUoAgBBAnI2AgALIAcoArwDIQIgB0EQahCRCxogCBDlBxogB0HAA2okACACC2cBAn8jAEEQayIBJAAgABC7CQJAAkAgABCPCEUNACAAELwJIQIgAUEANgIMIAIgAUEMahC9CSAAQQAQvgkMAQsgABC/CSECIAFBADYCCCACIAFBCGoQvQkgAEEAEMAJCyABQRBqJAAL2QEBBH8jAEEQayIDJAAgABCGByEEIAAQwQkhBQJAIAEgAhDCCSIGRQ0AAkAgACABEMMJDQACQCAFIARrIAZPDQAgACAFIAYgBGogBWsgBCAEQQBBABCCDwsgABDTByAEQQJ0aiEFAkADQCABIAJGDQEgBSABEL0JIAFBBGohASAFQQRqIQUMAAsACyADQQA2AgQgBSADQQRqEL0JIAAgBiAEahDECQwBCyAAIANBBGogASACIAAQxQkQxgkiARCNCCABEIYHEIkPGiABEIAPGgsgA0EQaiQAIAALAgALCgAgABDlCCgCAAsMACAAIAEoAgA2AgALDAAgABDlCCABNgIECwoAIAAQ5QgQ2gwLLQEBfyAAEOUIIgIgAi0AC0GAAXEgAXI6AAsgABDlCCIAIAAtAAtB/wBxOgALCx8BAX9BASEBAkAgABCPCEUNACAAEOgMQX9qIQELIAELCQAgACABEJUNCyoBAX9BACECAkAgABCNCCABSw0AIAAQjQggABCGB0ECdGogAU8hAgsgAgscAAJAIAAQjwhFDQAgACABEL4JDwsgACABEMAJCwcAIAAQ3AwLMAEBfyMAQRBrIgQkACAAIARBD2ogAxCWDSIDIAEgAhCXDSADEMYGIARBEGokACADCwsAIABB1N0FEM0GCxEAIAAgASABKAIAKAIsEQIACxEAIAAgASABKAIAKAIgEQIACwsAIAAgARDjCSAACxEAIAAgASABKAIAKAIcEQIACw8AIAAgACgCACgCDBEAAAsPACAAIAAoAgAoAhARAAALEQAgACABIAEoAgAoAhQRAgALEQAgACABIAEoAgAoAhgRAgALDwAgACAAKAIAKAIkEQAACwsAIABBzN0FEM0GCxEAIAAgASABKAIAKAIsEQIACxEAIAAgASABKAIAKAIgEQIACxEAIAAgASABKAIAKAIcEQIACw8AIAAgACgCACgCDBEAAAsPACAAIAAoAgAoAhARAAALEQAgACABIAEoAgAoAhQRAgALEQAgACABIAEoAgAoAhgRAgALDwAgACAAKAIAKAIkEQAACxIAIAAgAjYCBCAAIAE2AgAgAAsHACAAKAIACw0AIAAQ3QkgARDbCUYLBwAgACgCAAt2AQF/IwBBEGsiAyQAIAMgATYCCCADIAA2AgwgAyACNgIEAkADQCADQQxqIANBCGoQ0AciAUUNASADQQNqIANBDGoQ0QcgA0EEahDRBxCZDUUNASADQQxqENIHGiADQQRqENIHGgwACwALIANBEGokACABQQFzCzIBAX8jAEEQayICJAAgAiAAKAIANgIMIAJBDGogARCaDRogAigCDCEAIAJBEGokACAACwcAIAAQ9gkLGgEBfyAAEPUJKAIAIQEgABD1CUEANgIAIAELIgAgACABEOEJEOMHIAEQ4AkoAgAhASAAEPYJIAE2AgAgAAt9AQJ/IwBBEGsiAiQAAkAgABCPCEUNACAAEMUJIAAQvAkgABDoDBDmDAsgACABEJsNIAEQ5QghAyAAEOUIIgBBCGogA0EIaigCADYCACAAIAMpAgA3AgAgAUEAEMAJIAEQvwkhACACQQA2AgwgACACQQxqEL0JIAJBEGokAAv9BAEMfyMAQcADayIHJAAgByAFNwMQIAcgBjcDGCAHIAdB0AJqNgLMAiAHQdACakHkAEGKgwQgB0EQahCgBiEIIAdB6AA2AuABQQAhCSAHQdgBakEAIAdB4AFqEMUHIQogB0HoADYC4AEgB0HQAWpBACAHQeABahDFByELIAdB4AFqIQwCQAJAIAhB5ABJDQAQ+gYhCCAHIAU3AwAgByAGNwMIIAdBzAJqIAhBioMEIAcQxgciCEF/Rg0BIAogBygCzAIQxwcgCyAIEIcDEMcHIAtBABDlCQ0BIAsQ6gghDAsgB0HMAWogAxCHBSAHQcwBahBAIg0gBygCzAIiDiAOIAhqIAwQ+QYaAkAgCEEBSA0AIAcoAswCLQAAQS1GIQkLIAIgCSAHQcwBaiAHQcgBaiAHQccBaiAHQcYBaiAHQbgBahCbBCIPIAdBrAFqEJsEIg4gB0GgAWoQmwQiECAHQZwBahDmCSAHQegANgIwIAdBKGpBACAHQTBqEMUHIRECQAJAIAggBygCnAEiAkwNACAQEBYgCCACa0EBdGogDhAWaiAHKAKcAWpBAWohEgwBCyAQEBYgDhAWaiAHKAKcAWpBAmohEgsgB0EwaiECAkAgEkHlAEkNACARIBIQhwMQxwcgERDqCCICRQ0BCyACIAdBJGogB0EgaiADEB8gDCAMIAhqIA0gCSAHQcgBaiAHLADHASAHLADGASAPIA4gECAHKAKcARDnCSABIAIgBygCJCAHKAIgIAMgBBAhIQggERDJBxogEBDsDhogDhDsDhogDxDsDhogB0HMAWoQkQsaIAsQyQcaIAoQyQcaIAdBwANqJAAgCA8LEOAOAAsKACAAEOgJQQFzC8YDAQF/IwBBEGsiCiQAAkACQCAARQ0AIAIQhgkhAgJAAkAgAUUNACAKQQRqIAIQhwkgAyAKKAIENgAAIApBBGogAhCICSAIIApBBGoQnAQaIApBBGoQ7A4aDAELIApBBGogAhDpCSADIAooAgQ2AAAgCkEEaiACEIkJIAggCkEEahCcBBogCkEEahDsDhoLIAQgAhCKCToAACAFIAIQiwk6AAAgCkEEaiACEIwJIAYgCkEEahCcBBogCkEEahDsDhogCkEEaiACEI0JIAcgCkEEahCcBBogCkEEahDsDhogAhCOCSECDAELIAIQjwkhAgJAAkAgAUUNACAKQQRqIAIQkAkgAyAKKAIENgAAIApBBGogAhCRCSAIIApBBGoQnAQaIApBBGoQ7A4aDAELIApBBGogAhDqCSADIAooAgQ2AAAgCkEEaiACEJIJIAggCkEEahCcBBogCkEEahDsDhoLIAQgAhCTCToAACAFIAIQlAk6AAAgCkEEaiACEJUJIAYgCkEEahCcBBogCkEEahDsDhogCkEEaiACEJYJIAcgCkEEahCcBBogCkEEahDsDhogAhCXCSECCyAJIAI2AgAgCkEQaiQAC5oGAQp/IwBBEGsiDyQAIAIgADYCACADQYAEcSEQQQAhEQNAAkAgEUEERw0AAkAgDRAWQQFNDQAgDyANEOsJNgIMIAIgD0EMakEBEOwJIA0Q7QkgAigCABDuCTYCAAsCQCADQbABcSISQRBGDQACQCASQSBHDQAgAigCACEACyABIAA2AgALIA9BEGokAA8LAkACQAJAAkACQAJAIAggEWosAAAOBQABAwIEBQsgASACKAIANgIADAQLIAEgAigCADYCACAGQSAQQSESIAIgAigCACITQQFqNgIAIBMgEjoAAAwDCyANENMGDQIgDUEAENIGLQAAIRIgAiACKAIAIhNBAWo2AgAgEyASOgAADAILIAwQ0wYhEiAQRQ0BIBINASACIAwQ6wkgDBDtCSACKAIAEO4JNgIADAELIAIoAgAhFCAEIAdqIgQhEgJAA0AgEiAF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IAQQ2QchBSAMEOUHGiALEIAPGiAKEIAPGiAJEOwOGiAGQdwDahCRCxogBkHgA2okACAFCw0AIAAgASACIAMQnQ0LJwEBfyMAQRBrIgIkACACQQxqIAAgARCsDSgCACEBIAJBEGokACABCwQAQX8LEQAgACAAKAIAIAFqNgIAIAALDQAgACABIAIgAxCtDQsnAQF/IwBBEGsiAiQAIAJBDGogACABELwNKAIAIQEgAkEQaiQAIAELFAAgACAAKAIAIAFBAnRqNgIAIAALBABBfwsKACAAIAUQ3QgaCwIACwQAQX8LCgAgACAFEOAIGgsCAAspACAAQbCHBUEIajYCAAJAIAAoAggQ+gZGDQAgACgCCBCiBgsgABC4BgueAwAgACABEI4KIgFB4P4EQQhqNgIAIAFBCGpBHhCPCiEAIAFBmAFqQaqEBBCFBRogABCQChCRCiABQbDoBRCSChCTCiABQbjoBRCUChCVCiABQcDoBRCWChCXCiABQdDoBRCYChCZCiABQdjoBRCaChCbCiABQeDoBRCcChCdCiABQfDoBRCeChCfCiABQfjoBRCgChChCiABQYDpBRCiChCjCiABQYjpBRCkChClCiABQZDpBRCmChCnCiABQajpBRCoChCpCiABQcjpBRCqChCrCiABQdDpBRCsChCtCiABQdjpBRCuChCvCiABQeDpBRCwChCxCiABQejpBRCyChCzCiABQfDpBRC0ChC1CiABQfjpBRC2ChC3CiABQYDqBRC4ChC5CiABQYjqBRC6ChC7CiABQZDqBRC8ChC9CiABQZjqBRC+ChC/CiABQaDqBRDAChDBCiABQajqBRDCChDDCiABQbjqBRDEChDFCiABQcjqBRDGChDHCiABQdjqBRDIChDJCiABQejqBRDKChDLCiABQfDqBRDMCiABCxoAIAAgAUF/ahDNCiIBQaiKBUEIajYCACABC28BAX8jAEEQayICJAAgAEIANwMAIAJBADYCDCAAQQhqIAJBDGogAkELahDOChogAkEKaiACQQRqIAAQzwooAgAQ0AogABDRCgJAIAFFDQAgACABENIKIAAgARDTCgsgAkEKahDUCiACQRBqJAAgAAscAQF/IAAQ1QohASAAENYKIAAgARDXCiAAENgKCwwAQbDoBUEBENsKGgsQACAAIAFB7NwFENkKENoKCwwAQbjoBUEBENwKGgsQACAAIAFB9NwFENkKENoKCxAAQcDoBUEAQQBBARCrCxoLEAAgACABQbjeBRDZChDaCgsMAEHQ6AVBARDdChoLEAAgACABQbDeBRDZChDaCgsMAEHY6AVBARDeChoLEAAgACABQcDeBRDZChDaCgsMAEHg6AVBARC/CxoLEAAgACABQcjeBRDZChDaCgsMAEHw6AVBARDfChoLEAAgACABQdDeBRDZChDaCgsMAEH46AVBARDgChoLEAAgACABQeDeBRDZChDaCgsMAEGA6QVBARDhChoLEAAgACABQdjeBRDZChDaCgsMAEGI6QVBARDiChoLEAAgACABQejeBRDZChDaCgsMAEGQ6QVBARD2CxoLEAAgACABQfDeBRDZChDaCgsMAEGo6QVBARD3CxoLEAAgACABQfjeBRDZChDaCgsMAEHI6QVBARDjChoLEAAgACABQfzcBRDZChDaCgsMAEHQ6QVBARDkChoLEAAgACABQYTdBRDZChDaCgsMAEHY6QVBARDlChoLEAAgACABQYzdBRDZChDaCgsMAEHg6QVBARDmChoLEAAgACABQZTdBRDZChDaCgsMAEHo6QVBARDnChoLEAAgACABQbzdBRDZChDaCgsMAEHw6QVBARDoChoLEAAgACABQcTdBRDZChDaCgsMAEH46QVBARDpChoLEAAgACABQczdBRDZChDaCgsMAEGA6gVBARDqChoLEAAgACABQdTdBRDZChDaCgsMAEGI6gVBARDrChoLEAAgACABQdzdBRDZChDaCgsMAEGQ6gVBARDsChoLEAAgACABQeTdBRDZChDaCgsMAEGY6gVBARDtChoLEAAgACABQezdBRDZChDaCgsMAEGg6gVBARDuChoLEAAgACABQfTdBRDZChDaCgsMAEGo6gVBARDvChoLEAAgACABQZzdBRDZChDaCgsMAEG46gVBARDwChoLEAAgACABQaTdBRDZChDaCgsMAEHI6gVBARDxChoLEAAgACABQazdBRDZChDaCgsMAEHY6gVBARDyChoLEAAgACABQbTdBRDZChDaCgsMAEHo6gVBARDzChoLEAAgACABQfzdBRDZChDaCgsMAEHw6gVBARD0ChoLEAAgACABQYTeBRDZChDaCgsXACAAIAE2AgQgAEHQsgVBCGo2AgAgAAsUACAA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IQMLIAMLHQACQCABQf8ASw0AEKILIAFBAnRqKAIAIQELIAELCAAQpAYoAgALRQEBfwJAA0AgASACRg0BAkAgASgCACIDQf8ASw0AEKILIAEoAgBBAnRqKAIAIQMLIAEgAzYCACABQQRqIQEMAAsACyACCx0AAkAgAUH/AEsNABClCyABQQJ0aigCACEBCyABCwgAEKUGKAIAC0UBAX8CQANAIAEgAkYNAQJAIAEoAgAiA0H/AEsNABClCyABKAIAQQJ0aigCACEDCyABIAM2AgAgAUEEaiEBDAALAAsgAgsEACABCywAAkADQCABIAJGDQEgAyABLAAANgIAIANBBGohAyABQQFqIQEMAAsACyACCw4AIAEgAiABQYABSRvACzkBAX8CQANAIAEgAkYNASAEIAEoAgAiBSADIAVBgAFJGzoAACAEQQFqIQQgAUEEaiEBDAALAAsgAgs4ACAAIAMQjgoQrAsiAyACOgAMIAMgATYCCCADQfT+BEEIajYCAAJAIAENACADQbD/BDYCCAsgAwsEACAACzMBAX8gAEH0/gRBCGo2AgACQCAAKAIIIgFFDQAgAC0ADEH/AXFFDQAgARDjDgsgABC4BgsNACAAEK0LGiAAEOIOCyEAAkAgAUEASA0AEKILIAFB/wFxQQJ0aigCACEBCyABwAtEAQF/AkADQCABIAJGDQECQCABLAAAIgNBAEgNABCiCyABLAAAQQJ0aigCACEDCyABIAM6AAAgAUEBaiEBDAALAAsgAgshAAJAIAFBAEgNABClCyABQf8BcUECdGooAgAhAQsgAcALRAEBfwJAA0AgASACRg0BAkAgASwAACIDQQBIDQAQpQsgASwAAEECdGooAgAhAwsgASADOgAAIAFBAWohAQwACwALIAILBAAgAQssAAJAA0AgASACRg0BIAMgAS0AADoAACADQQFqIQMgAUEBaiEBDAALAAsgAgsMACACIAEgAUEASBsLOAEBfwJAA0AgASACRg0BIAQgAyABLAAAIgUgBUEASBs6AAAgBEEBaiEEIAFBAWohAQwACwALIAILDQAgABC4BhogABDiDgsSACAEIAI2AgAgByAFNgIAQQMLEgAgBCACNgIAIAcgBTYCAEEDCwsAIAQgAjYCAEEDCwQAQQELBABBAQs5AQF/IwBBEGsiBSQAIAUgBDYCDCAFIAMg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CwIACwkAIAAgARCUDgsKACAAQQxqEJUOCzcBAn8CQANAIAAoAgggAUYNASAAEPANIQIgACAAKAIIQXxqIgM2AgggAiADEMgNEOENDAALAAsLBwAgABDeDQsKAEH5ggQQlw4ACwUAEAoACwcAIAAQowYLYQEBfyMAQRBrIgIkACACIAA2AgwCQCAAIAFGDQADQCACIAFBfGoiATYCCCAAIAFPDQEgAkEMaiACQQhqEJoOIAIgAigCDEEEaiIANgIMIAIoAgghAQwACwALIAJBEGokAAsPACAAKAIAIAEoAgAQmw4LCQAgACABEJ8ECzsBAX8jAEEQayIDJAAgACACEMQJIAAgAhCuDCADQQA2AgwgASACQQJ0aiADQQxqEL0JIANBEGokACAACwQAIAALBAAgAAsEACAACwQAIAALBAAgAAsQACAAQYiyBUEIajYCACAACxAAIABBrLIFQQhqNgIAIAALDAAgABD6BjYCACAACwQAIAALDgAgACABKAIANgIAIAALCAAgABD/ChoLBAAgAAsJACAAIAEQqw4LBwAgABCsDgsLACAAIAE2AgAgAAsNACAAKAIAEK0OEK4OCwcAIAAQsA4LBwAgABCvDgs/AQJ/IAAoAgAgAEEIaigCACIBQQF1aiECIAAoAgQhAAJAIAFBAXFFDQAgAigCACAAaigCACEACyACIAARBAALBwAgACgCAAsWACAAIAEQtA4iAUEEaiACEI8FGiABCwcAIAAQtQ4LCgAgAEEEahCQBQsOACAAIAEoAgA2AgAgAAsEACAACwoAIAEgAGtBDG0LCwAgACABIAIQrwYLBQAQuQ4LCABBgICAgHgLBQAQuw4LDQBCgICAgICAgICAfwsLACAAIAEgAhCtBgsFABC+DgsGAEH//wMLBQAQwA4LBABCfwsMACAAIAEQ+gYQtAYLDAAgACABEPoGELUGCz0CAX8BfiMAQRBrIgMkACADIAEgAhD6BhC2BiADKQMAIQQgACADQQhqKQMANwMIIAAgBDcDACADQRBqJAALCgAgASAAa0EMbQsOACAAIAEoAgA2AgAgAAsEACAACwQAIAALDgAgACABKAIANgIAIAALBwAgABDLDgsKACAAQQRqEJAFCwQAIAALBAAgAAsOACAAIAEoAgA2AgAgAAsEACAACwQAIAALBAAgAAsDAAALBwAgABCY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MjliYXNpY19pb3NJd05TXzExY2hhcl90cmFpdHNJd0VFRUUAAAB4WwEAqCoBANArAQBOU3QzX18yMTViYXNpY19zdHJlYW1idWZJd05TXzExY2hhcl90cmFpdHNJd0VFRUUAAAAAUFsBAOAqAQBOU3QzX18yMTNiYXNpY19pc3RyZWFtSXdOU18xMWNoYXJfdHJhaXRzSXdFRUVFAADUWwEAHCsBAAAAAAABAAAA1CoBAAP0//9OU3QzX18yMTNiYXNpY19vc3RyZWFtSXdOU18xMWNoYXJfdHJhaXRzSXdFRUVFAADUWwEAZCsBAAAAAAABAAAA1CoBAAP0//8AAAAA0CsBAEYAAABHAAAATlN0M19fMjhpb3NfYmFzZUUAAABQWwEAvCsBAOhcAQB4XQEAEF4BAAAAAAA8LAEAFgAAAFAAAABRAAAAGQAAABoAAAAbAAAAHAAAAB0AAAAeAAAAUgAAAFMAAABUAAAAIgAAACMAAABOU3QzX18yMTBfX3N0ZGluYnVmSWNFRQB4WwEAJCwBAAAqAQAAAAAApCwBABYAAABVAAAAVgAAABkAAAAaAAAAGwAAAFcAAAAdAAAAHgAAAB8AAAAgAAAAIQAAAFgAAABZAAAATlN0M19fMjExX19zdGRvdXRidWZJY0VFAAAAAHhbAQCILAEAACoBAAAAAAAILQEALAAAAFoAAABbAAAALwAAADAAAAAxAAAAMgAAADMAAAA0AAAAXAAAAF0AAABeAAAAOAAAADkAAABOU3QzX18yMTBfX3N0ZGluYnVmSXdFRQB4WwEA8CwBABQrAQAAAAAAcC0BACwAAABfAAAAYAAAAC8AAAAwAAAAMQAAAGEAAAAzAAAANAAAADUAAAA2AAAANwAAAGIAAABjAAAATlN0M19fMjExX19zdGRvdXRidWZJd0VFAAAAAHhbAQBULQEAFCsBAAAAAADRdJ4AV529KoBwUg///z4nCgAAAGQAAADoAwAAECcAAKCGAQBAQg8AgJaYAADh9QUYAAAANQAAAHEAAABr////zvv//5K///8AAAAAAAAAAP////////////////////////////////////////////////////////////////8AAQIDBAUGBwgJ/////////woLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIj////////CgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAECBAcDBgUAAAAAAAAAAgAAwAMAAMAEAADABQAAwAYAAMAHAADACAAAwAkAAMAKAADACwAAwAwAAMANAADADgAAwA8AAMAQAADAEQAAwBIAAMATAADAFAAAwBUAAMAWAADAFwAAwBgAAMAZAADAGgAAwBsAAMAcAADAHQAAwB4AAMAfAADAAAAAswEAAMMCAADDAwAAwwQAAMMFAADDBgAAwwcAAMMIAADDCQAAwwoAAMMLAADDDAAAww0AANMOAADDDwAAwwAADLsBAAzDAgAMwwMADMMEAAzbAAAAAN4SBJUAAAAA////////////////sC8BABQAAABDLlVURi04AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxC8BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABMQ19DVFlQRQAAAABMQ19OVU1FUklDAABMQ19USU1FAAAAAABMQ19DT0xMQVRFAABMQ19NT05FVEFSWQBMQ19NRVNTQUdFUwAAAAAAAAAAABkACgAZGRkAAAAABQAAAAAAAAkAAAAACwAAAAAAAAAAGQARChkZGQMKBwABAAkLGAAACQYLAAALAAYZAAAAGRkZAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAABkACg0ZGRkADQAAAgAJDgAAAAkADgAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAATAAAAABMAAAAACQwAAAAAAAwAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAADwAAAAQPAAAAAAkQAAAAAAAQAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIAAAAAAAAAAAAAABEAAAAAEQAAAAAJEgAAAAAAEgAAEgAAGgAAABoaGgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaAAAA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AAAEAAAABAAAAAQAAAAFAgAABQAAAAUAAAAFAAAABQAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAMCAACCAAAAggAAAIIAAACCAAAAggAAAIIAAACCAAAAggAAAIIAAACCAAAAggAAAIIAAACCAAAAggAAAIIAAABCAQAAQgEAAEIBAABCAQAAQgEAAEIBAABCAQAAQgEAAEIBAABCAQAAggAAAIIAAACCAAAAggAAAIIAAACCAAAAggAAACoBAAAqAQAAKgEAACoBAAAqAQAAKgEAACoAAAAqAAAAKgAAACoAAAAqAAAAKgAAACoAAAAqAAAAKgAAACoAAAAqAAAAKgAAACoAAAAqAAAAKgAAACoAAAAqAAAAKgAAACoAAAAqAAAAggAAAIIAAACCAAAAggAAAIIAAACCAAAAMgEAADIBAAAyAQAAMgEAADIBAAAyAQAAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAADIAAACCAAAAggAAAIIAAACCAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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';
  if (!isDataURI(wasmBinaryFile)) {
    wasmBinaryFile = locateFile(wasmBinaryFile);
  }

function getBinary(file) {
  try {
    if (file == wasmBinaryFile && wasmBinary) {
      return new Uint8Array(wasmBinary);
    }
    var binary = tryParseAsDataURI(file);
    if (binary) {
      return binary;
    }
    if (readBinary) {
      return readBinary(file);
    }
    throw "both async and sync fetching of the wasm failed";
  }
  catch (err) {
    abort(err);
  }
}

function getBinaryPromise(binaryFile) {
  // If we don't have the binary yet, try to load it asynchronously.
  // Fetch has some additional restrictions over XHR, like it can't be used on a file:// url.
  // See https://github.com/github/fetch/pull/92#issuecomment-140665932
  // Cordova or Electron apps are typically loaded from a file:// url.
  // So use fetch if it is available and the url is not a file, otherwise fall back to XHR.
  if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
    if (typeof fetch == 'function'
      && !isFileURI(binaryFile)
    ) {
      return fetch(binaryFile, { credentials: 'same-origin' }).then((response) => {
        if (!response['ok']) {
          throw "failed to load wasm binary file at '" + binaryFile + "'";
        }
        return response['arrayBuffer']();
      }).catch(() => getBinary(binaryFile));
    }
    else {
      if (readAsync) {
        // fetch is not available or url is file => try XHR (readAsync uses XHR internally)
        return new Promise((resolve, reject) => {
          readAsync(binaryFile, (response) => resolve(new Uint8Array(/** @type{!ArrayBuffer} */(response))), reject)
        });
      }
    }
  }

  // Otherwise, getBinary should be able to get it synchronously
  return Promise.resolve().then(() => getBinary(binaryFile));
}

function instantiateArrayBuffer(binaryFile, imports, receiver) {
  return getBinaryPromise(binaryFile).then((binary) => {
    return WebAssembly.instantiate(binary, imports);
  }).then((instance) => {
    return instance;
  }).then(receiver, (reason) => {
    err('failed to asynchronously prepare wasm: ' + reason);

    // Warn on some common problems.
    if (isFileURI(wasmBinaryFile)) {
      err('warning: Loading from a file URI (' + wasmBinaryFile + ') is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing');
    }
    abort(reason);
  });
}

function instantiateAsync(binary, binaryFile, imports, callback) {
  if (!binary &&
      typeof WebAssembly.instantiateStreaming == 'function' &&
      !isDataURI(binaryFile) &&
      // Don't use streaming for file:// delivered objects in a webview, fetch them synchronously.
      !isFileURI(binaryFile) &&
      // Avoid instantiateStreaming() on Node.js environment for now, as while
      // Node.js v18.1.0 implements it, it does not have a full fetch()
      // implementation yet.
      //
      // Reference:
      //   https://github.com/emscripten-core/emscripten/pull/16917
      !ENVIRONMENT_IS_NODE &&
      typeof fetch == 'function') {
    return fetch(binaryFile, { credentials: 'same-origin' }).then((response) => {
      // Suppress closure warning here since the upstream definition for
      // instantiateStreaming only allows Promise<Repsponse> rather than
      // an actual Response.
      // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure is fixed.
      /** @suppress {checkTypes} */
      var result = WebAssembly.instantiateStreaming(response, imports);

      return result.then(
        callback,
        function(reason) {
          // We expect the most common failure cause to be a bad MIME type for the binary,
          // in which case falling back to ArrayBuffer instantiation should work.
          err('wasm streaming compile failed: ' + reason);
          err('falling back to ArrayBuffer instantiation');
          return instantiateArrayBuffer(binaryFile, imports, callback);
        });
    });
  } else {
    return instantiateArrayBuffer(binaryFile, imports, callback);
  }
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
function createWasm() {
  // prepare imports
  var info = {
    'env': wasmImports,
    'wasi_snapshot_preview1': wasmImports,
  };
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  /** @param {WebAssembly.Module=} module*/
  function receiveInstance(instance, module) {
    var exports = instance.exports;

    Module['asm'] = exports;

    wasmMemory = Module['asm']['memory'];
    assert(wasmMemory, "memory not found in wasm exports");
    // This assertion doesn't hold when emscripten is run in --post-link
    // mode.
    // TODO(sbc): Read INITIAL_MEMORY out of the wasm file in post-link mode.
    //assert(wasmMemory.buffer.byteLength === 16777216);
    updateMemoryViews();

    wasmTable = Module['asm']['__indirect_function_table'];
    assert(wasmTable, "table not found in wasm exports");

    addOnInit(Module['asm']['__wasm_call_ctors']);

    removeRunDependency('wasm-instantiate');
    return exports;
  }
  // wait for the pthread pool (if any)
  addRunDependency('wasm-instantiate');

  // Prefer streaming instantiation if available.
  // Async compilation can be confusing when an error on the page overwrites Module
  // (for example, if the order of elements is wrong, and the one defining Module is
  // later), so we save Module and check it later.
  var trueModule = Module;
  function receiveInstantiationResult(result) {
    // 'result' is a ResultObject object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    assert(Module === trueModule, 'the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?');
    trueModule = null;
    // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
    // When the regression is fixed, can restore the above PTHREADS-enabled path.
    receiveInstance(result['instance']);
  }

  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to
  // run the instantiation parallel to any other async startup actions they are
  // performing.
  // Also pthreads and wasm workers initialize the wasm instance through this
  // path.
  if (Module['instantiateWasm']) {

    try {
      return Module['instantiateWasm'](info, receiveInstance);
    } catch(e) {
      err('Module.instantiateWasm callback failed with error: ' + e);
        // If instantiation fails, reject the module ready promise.
        readyPromiseReject(e);
    }
  }

  // If instantiation fails, reject the module ready promise.
  instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);
  return {}; // no exports yet; we'll fill them in later
}

// Globals used by JS i64 conversions (see makeSetValue)
var tempDouble;
var tempI64;

// include: runtime_debug.js
function legacyModuleProp(prop, newName) {
  if (!Object.getOwnPropertyDescriptor(Module, prop)) {
    Object.defineProperty(Module, prop, {
      configurable: true,
      get: function() {
        abort('Module.' + prop + ' has been replaced with plain ' + newName + ' (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)');
      }
    });
  }
}

function ignoredModuleProp(prop) {
  if (Object.getOwnPropertyDescriptor(Module, prop)) {
    abort('`Module.' + prop + '` was supplied but `' + prop + '` not included in INCOMING_MODULE_JS_API');
  }
}

// forcing the filesystem exports a few things by default
function isExportedByForceFilesystem(name) {
  return name === 'FS_createPath' ||
         name === 'FS_createDataFile' ||
         name === 'FS_createPreloadedFile' ||
         name === 'FS_unlink' ||
         name === 'addRunDependency' ||
         // The old FS has some functionality that WasmFS lacks.
         name === 'FS_createLazyFile' ||
         name === 'FS_createDevice' ||
         name === 'removeRunDependency';
}

function missingGlobal(sym, msg) {
  if (typeof globalThis !== 'undefined') {
    Object.defineProperty(globalThis, sym, {
      configurable: true,
      get: function() {
        warnOnce('`' + sym + '` is not longer defined by emscripten. ' + msg);
        return undefined;
      }
    });
  }
}

missingGlobal('buffer', 'Please use HEAP8.buffer or wasmMemory.buffer');

function missingLibrarySymbol(sym) {
  if (typeof globalThis !== 'undefined' && !Object.getOwnPropertyDescriptor(globalThis, sym)) {
    Object.defineProperty(globalThis, sym, {
      configurable: true,
      get: function() {
        // Can't `abort()` here because it would break code that does runtime
        // checks.  e.g. `if (typeof SDL === 'undefined')`.
        var msg = '`' + sym + '` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line';
        // DEFAULT_LIBRARY_FUNCS_TO_INCLUDE requires the name as it appears in
        // library.js, which means $name for a JS name with no prefix, or name
        // for a JS name like _name.
        var librarySymbol = sym;
        if (!librarySymbol.startsWith('_')) {
          librarySymbol = '$' + sym;
        }
        msg += " (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE='" + librarySymbol + "')";
        if (isExportedByForceFilesystem(sym)) {
          msg += '. Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you';
        }
        warnOnce(msg);
        return undefined;
      }
    });
  }
  // Any symbol that is not included from the JS libary is also (by definition)
  // not exported on the Module object.
  unexportedRuntimeSymbol(sym);
}

function unexportedRuntimeSymbol(sym) {
  if (!Object.getOwnPropertyDescriptor(Module, sym)) {
    Object.defineProperty(Module, sym, {
      configurable: true,
      get: function() {
        var msg = "'" + sym + "' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)";
        if (isExportedByForceFilesystem(sym)) {
          msg += '. Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you';
        }
        abort(msg);
      }
    });
  }
}

// Used by XXXXX_DEBUG settings to output debug messages.
function dbg(text) {
  // TODO(sbc): Make this configurable somehow.  Its not always convenient for
  // logging to show up as warnings.
  console.warn.apply(console, arguments);
}
// end include: runtime_debug.js
// === Body ===

// end include: preamble.js

  /** @constructor */
  function ExitStatus(status) {
      this.name = 'ExitStatus';
      this.message = `Program terminated with exit(${status})`;
      this.status = status;
    }

  var callRuntimeCallbacks = (callbacks) => {
      while (callbacks.length > 0) {
        // Pass the module as the first argument.
        callbacks.shift()(Module);
      }
    };

  
    /**
     * @param {number} ptr
     * @param {string} type
     */
  function getValue(ptr, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': return HEAP8[((ptr)>>0)];
      case 'i8': return HEAP8[((ptr)>>0)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': abort('to do getValue(i64) use WASM_BIGINT');
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      case '*': return HEAPU32[((ptr)>>2)];
      default: abort(`invalid type for getValue: ${type}`);
    }
  }

  function intArrayToString(array) {
    var ret = [];
    for (var i = 0; i < array.length; i++) {
      var chr = array[i];
      if (chr > 0xFF) {
        assert(false, `Character code ${chr} (${String.fromCharCode(chr)}) at offset ${i} not in 0x00-0xFF.`);
        chr &= 0xFF;
      }
      ret.push(String.fromCharCode(chr));
    }
    return ret.join('');
  }

  var ptrToString = (ptr) => {
      assert(typeof ptr === 'number');
      return '0x' + ptr.toString(16).padStart(8, '0');
    };

  
    /**
     * @param {number} ptr
     * @param {number} value
     * @param {string} type
     */
  function setValue(ptr, value, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': HEAP8[((ptr)>>0)] = value; break;
      case 'i8': HEAP8[((ptr)>>0)] = value; break;
      case 'i16': HEAP16[((ptr)>>1)] = value; break;
      case 'i32': HEAP32[((ptr)>>2)] = value; break;
      case 'i64': abort('to do setValue(i64) use WASM_BIGINT');
      case 'float': HEAPF32[((ptr)>>2)] = value; break;
      case 'double': HEAPF64[((ptr)>>3)] = value; break;
      case '*': HEAPU32[((ptr)>>2)] = value; break;
      default: abort(`invalid type for setValue: ${type}`);
    }
  }

  var warnOnce = (text) => {
      if (!warnOnce.shown) warnOnce.shown = {};
      if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        if (ENVIRONMENT_IS_NODE) text = 'warning: ' + text;
        err(text);
      }
    };

  /** @constructor */
  function ExceptionInfo(excPtr) {
      this.excPtr = excPtr;
      this.ptr = excPtr - 24;
  
      this.set_type = function(type) {
        HEAPU32[(((this.ptr)+(4))>>2)] = type;
      };
  
      this.get_type = function() {
        return HEAPU32[(((this.ptr)+(4))>>2)];
      };
  
      this.set_destructor = function(destructor) {
        HEAPU32[(((this.ptr)+(8))>>2)] = destructor;
      };
  
      this.get_destructor = function() {
        return HEAPU32[(((this.ptr)+(8))>>2)];
      };
  
      this.set_caught = function (caught) {
        caught = caught ? 1 : 0;
        HEAP8[(((this.ptr)+(12))>>0)] = caught;
      };
  
      this.get_caught = function () {
        return HEAP8[(((this.ptr)+(12))>>0)] != 0;
      };
  
      this.set_rethrown = function (rethrown) {
        rethrown = rethrown ? 1 : 0;
        HEAP8[(((this.ptr)+(13))>>0)] = rethrown;
      };
  
      this.get_rethrown = function () {
        return HEAP8[(((this.ptr)+(13))>>0)] != 0;
      };
  
      // Initialize native structure fields. Should be called once after allocated.
      this.init = function(type, destructor) {
        this.set_adjusted_ptr(0);
        this.set_type(type);
        this.set_destructor(destructor);
      }
  
      this.set_adjusted_ptr = function(adjustedPtr) {
        HEAPU32[(((this.ptr)+(16))>>2)] = adjustedPtr;
      };
  
      this.get_adjusted_ptr = function() {
        return HEAPU32[(((this.ptr)+(16))>>2)];
      };
  
      // Get pointer which is expected to be received by catch clause in C++ code. It may be adjusted
      // when the pointer is casted to some of the exception object base classes (e.g. when virtual
      // inheritance is used). When a pointer is thrown this method should return the thrown pointer
      // itself.
      this.get_exception_ptr = function() {
        // Work around a fastcomp bug, this code is still included for some reason in a build without
        // exceptions support.
        var isPointer = ___cxa_is_pointer_type(this.get_type());
        if (isPointer) {
          return HEAPU32[((this.excPtr)>>2)];
        }
        var adjusted = this.get_adjusted_ptr();
        if (adjusted !== 0) return adjusted;
        return this.excPtr;
      };
    }
  
  var exceptionLast = 0;
  
  var uncaughtExceptionCount = 0;
  function ___cxa_throw(ptr, type, destructor) {
      var info = new ExceptionInfo(ptr);
      // Initialize ExceptionInfo content after it was allocated in __cxa_allocate_exception.
      info.init(type, destructor);
      exceptionLast = ptr;
      uncaughtExceptionCount++;
      assert(false, 'Exception thrown, but exception catching is not enabled. Compile with -sNO_DISABLE_EXCEPTION_CATCHING or -sEXCEPTION_CATCHING_ALLOWED=[..] to catch.');
    }

  var nowIsMonotonic = true;;
  var __emscripten_get_now_is_monotonic = () => nowIsMonotonic;

  var _abort = () => {
      abort('native code called abort()');
    };

  function _emscripten_date_now() {
      return Date.now();
    }

  var _emscripten_get_now;
      // Modern environment where performance.now() is supported:
      // N.B. a shorter form "_emscripten_get_now = performance.now;" is
      // unfortunately not allowed even in current browsers (e.g. FF Nightly 75).
      _emscripten_get_now = () => performance.now();
  ;

  var _emscripten_memcpy_big = (dest, src, num) => HEAPU8.copyWithin(dest, src, src + num);

  var getHeapMax = () =>
      HEAPU8.length;
  
  var abortOnCannotGrowMemory = (requestedSize) => {
      abort(`Cannot enlarge memory arrays to size ${requestedSize} bytes (OOM). Either (1) compile with -sINITIAL_MEMORY=X with X higher than the current value ${HEAP8.length}, (2) compile with -sALLOW_MEMORY_GROWTH which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with -sABORTING_MALLOC=0`);
    };
  var _emscripten_resize_heap = (requestedSize) => {
      var oldSize = HEAPU8.length;
      requestedSize = requestedSize >>> 0;
      abortOnCannotGrowMemory(requestedSize);
    };

  
  var handleException = (e) => {
      // Certain exception types we do not treat as errors since they are used for
      // internal control flow.
      // 1. ExitStatus, which is thrown by exit()
      // 2. "unwind", which is thrown by emscripten_unwind_to_js_event_loop() and others
      //    that wish to return to JS event loop.
      if (e instanceof ExitStatus || e == 'unwind') {
        return EXITSTATUS;
      }
      checkStackCookie();
      if (e instanceof WebAssembly.RuntimeError) {
        if (_emscripten_stack_get_current() <= 0) {
          err('Stack overflow detected.  You can try increasing -sSTACK_SIZE (currently set to 65536)');
        }
      }
      quit_(1, e);
    };
  
  
  var PATH = {isAbs:(path) => path.charAt(0) === '/',splitPath:(filename) => {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:(parts, allowAboveRoot) => {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up; up--) {
            parts.unshift('..');
          }
        }
        return parts;
      },normalize:(path) => {
        var isAbsolute = PATH.isAbs(path),
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter((p) => !!p), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:(path) => {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:(path) => {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        path = PATH.normalize(path);
        path = path.replace(/\/$/, "");
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },join:function() {
        var paths = Array.prototype.slice.call(arguments);
        return PATH.normalize(paths.join('/'));
      },join2:(l, r) => {
        return PATH.normalize(l + '/' + r);
      }};
  
  var initRandomFill = () => {
      if (typeof crypto == 'object' && typeof crypto['getRandomValues'] == 'function') {
        // for modern web browsers
        return (view) => crypto.getRandomValues(view);
      } else
      if (ENVIRONMENT_IS_NODE) {
        // for nodejs with or without crypto support included
        try {
          var crypto_module = require('crypto');
          var randomFillSync = crypto_module['randomFillSync'];
          if (randomFillSync) {
            // nodejs with LTS crypto support
            return (view) => crypto_module['randomFillSync'](view);
          }
          // very old nodejs with the original crypto API
          var randomBytes = crypto_module['randomBytes'];
          return (view) => (
            view.set(randomBytes(view.byteLength)),
            // Return the original view to match modern native implementations.
            view
          );
        } catch (e) {
          // nodejs doesn't have crypto support
        }
      }
      // we couldn't find a proper implementation, as Math.random() is not suitable for /dev/random, see emscripten-core/emscripten/pull/7096
      abort("no cryptographic support found for randomDevice. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: (array) => { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };");
    };
  var randomFill = (view) => {
      // Lazily init on the first invocation.
      return (randomFill = initRandomFill())(view);
    };
  
  
  
  var PATH_FS = {resolve:function() {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();
          // Skip empty and invalid entries
          if (typeof path != 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            return ''; // an invalid portion invalidates the whole thing
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = PATH.isAbs(path);
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter((p) => !!p), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },relative:(from, to) => {
        from = PATH_FS.resolve(from).substr(1);
        to = PATH_FS.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      }};
  
  
  var lengthBytesUTF8 = (str) => {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
        // unit, not a Unicode code point of the character! So decode
        // UTF16->UTF32->UTF8.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        var c = str.charCodeAt(i); // possibly a lead surrogate
        if (c <= 0x7F) {
          len++;
        } else if (c <= 0x7FF) {
          len += 2;
        } else if (c >= 0xD800 && c <= 0xDFFF) {
          len += 4; ++i;
        } else {
          len += 3;
        }
      }
      return len;
    };
  
  var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
      assert(typeof str === 'string');
      // Parameter maxBytesToWrite is not optional. Negative values, 0, null,
      // undefined and false each don't write out any bytes.
      if (!(maxBytesToWrite > 0))
        return 0;
  
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
      for (var i = 0; i < str.length; ++i) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
        // unit, not a Unicode code point of the character! So decode
        // UTF16->UTF32->UTF8.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
        // and https://www.ietf.org/rfc/rfc2279.txt
        // and https://tools.ietf.org/html/rfc3629
        var u = str.charCodeAt(i); // possibly a lead surrogate
        if (u >= 0xD800 && u <= 0xDFFF) {
          var u1 = str.charCodeAt(++i);
          u = 0x10000 + ((u & 0x3FF) << 10) | (u1 & 0x3FF);
        }
        if (u <= 0x7F) {
          if (outIdx >= endIdx) break;
          heap[outIdx++] = u;
        } else if (u <= 0x7FF) {
          if (outIdx + 1 >= endIdx) break;
          heap[outIdx++] = 0xC0 | (u >> 6);
          heap[outIdx++] = 0x80 | (u & 63);
        } else if (u <= 0xFFFF) {
          if (outIdx + 2 >= endIdx) break;
          heap[outIdx++] = 0xE0 | (u >> 12);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
        } else {
          if (outIdx + 3 >= endIdx) break;
          if (u > 0x10FFFF) warnOnce('Invalid Unicode code point ' + ptrToString(u) + ' encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).');
          heap[outIdx++] = 0xF0 | (u >> 18);
          heap[outIdx++] = 0x80 | ((u >> 12) & 63);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
        }
      }
      // Null-terminate the pointer to the buffer.
      heap[outIdx] = 0;
      return outIdx - startIdx;
    };
  /** @type {function(string, boolean=, number=)} */
  function intArrayFromString(stringy, dontAddNull, length) {
    var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
    var u8array = new Array(len);
    var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
    if (dontAddNull) u8array.length = numBytesWritten;
    return u8array;
  }
  
  var UTF8Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf8') : undefined;
  
    /**
     * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
     * array that contains uint8 values, returns a copy of that string as a
     * Javascript String object.
     * heapOrArray is either a regular array, or a JavaScript typed array view.
     * @param {number} idx
     * @param {number=} maxBytesToRead
     * @return {string}
     */
  var UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead) => {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;
      // TextDecoder needs to know the byte length in advance, it doesn't stop on
      // null terminator by itself.  Also, use the length info to avoid running tiny
      // strings through TextDecoder, since .subarray() allocates garbage.
      // (As a tiny code save trick, compare endPtr against endIdx using a negation,
      // so that undefined means Infinity)
      while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
  
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
      }
      var str = '';
      // If building with TextDecoder, we have already computed the string length
      // above, so test loop end condition against that
      while (idx < endPtr) {
        // For UTF8 byte structure, see:
        // http://en.wikipedia.org/wiki/UTF-8#Description
        // https://www.ietf.org/rfc/rfc2279.txt
        // https://tools.ietf.org/html/rfc3629
        var u0 = heapOrArray[idx++];
        if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 0xF0) == 0xE0) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
        } else {
          if ((u0 & 0xF8) != 0xF0) warnOnce('Invalid UTF-8 leading byte ' + ptrToString(u0) + ' encountered when deserializing a UTF-8 string in wasm memory to a JS string!');
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
        }
  
        if (u0 < 0x10000) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 0x10000;
          str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
        }
      }
      return str;
    };
  var TTY = {ttys:[],init:function () {
        // https://github.com/emscripten-core/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process.stdin.setEncoding('utf8');
        // }
      },shutdown:function() {
        // https://github.com/emscripten-core/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process.stdin.pause();
        // }
      },register:function(dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },stream_ops:{open:function(stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(43);
          }
          stream.tty = tty;
          stream.seekable = false;
        },close:function(stream) {
          // flush any pending line data
          stream.tty.ops.fsync(stream.tty);
        },fsync:function(stream) {
          stream.tty.ops.fsync(stream.tty);
        },read:function(stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(60);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(6);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },write:function(stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(60);
          }
          try {
            for (var i = 0; i < length; i++) {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            }
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        }},default_tty_ops:{get_char:function(tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              // we will read data by chunks of BUFSIZE
              var BUFSIZE = 256;
              var buf = Buffer.alloc(BUFSIZE);
              var bytesRead = 0;
  
              try {
                bytesRead = fs.readSync(process.stdin.fd, buf, 0, BUFSIZE, -1);
              } catch(e) {
                // Cross-platform differences: on Windows, reading EOF throws an exception, but on other OSes,
                // reading EOF returns 0. Uniformize behavior by treating the EOF exception to return 0.
                if (e.toString().includes('EOF')) bytesRead = 0;
                else throw e;
              }
  
              if (bytesRead > 0) {
                result = buf.slice(0, bytesRead).toString('utf-8');
              } else {
                result = null;
              }
            } else
            if (typeof window != 'undefined' &&
              typeof window.prompt == 'function') {
              // Browser.
              result = window.prompt('Input: ');  // returns null on cancel
              if (result !== null) {
                result += '\n';
              }
            } else if (typeof readline == 'function') {
              // Command line.
              result = readline();
              if (result !== null) {
                result += '\n';
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },put_char:function(tty, val) {
          if (val === null || val === 10) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val); // val == 0 would cut text output off in the middle.
          }
        },fsync:function(tty) {
          if (tty.output && tty.output.length > 0) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        },ioctl_tcgets:function(tty) {
          // typical setting
          return {
            c_iflag: 25856,
            c_oflag: 5,
            c_cflag: 191,
            c_lflag: 35387,
            c_cc: [
              0x03, 0x1c, 0x7f, 0x15, 0x04, 0x00, 0x01, 0x00, 0x11, 0x13, 0x1a, 0x00,
              0x12, 0x0f, 0x17, 0x16, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
              0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            ]
          };
        },ioctl_tcsets:function(tty, optional_actions, data) {
          // currently just ignore
          return 0;
        },ioctl_tiocgwinsz:function(tty) {
          return [24, 80];
        }},default_tty1_ops:{put_char:function(tty, val) {
          if (val === null || val === 10) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        },fsync:function(tty) {
          if (tty.output && tty.output.length > 0) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        }}};
  
  
  var zeroMemory = (address, size) => {
      HEAPU8.fill(0, address, address + size);
      return address;
    };
  
  var alignMemory = (size, alignment) => {
      assert(alignment, "alignment argument is required");
      return Math.ceil(size / alignment) * alignment;
    };
  var mmapAlloc = (size) => {
      abort('internal error: mmapAlloc called but `emscripten_builtin_memalign` native symbol not exported');
    };
  var MEMFS = {ops_table:null,mount:function(mount) {
        return MEMFS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },createNode:function(parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(63);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap,
                msync: MEMFS.stream_ops.msync
              }
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
            }
          };
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.usedBytes = 0; // The actual number of bytes used in the typed array, as opposed to contents.length which gives the whole capacity.
          // When the byte data of the file is populated, this will point to either a typed array, or a normal JS array. Typed arrays are preferred
          // for performance, and used by default. However, typed arrays are not resizable like normal JS arrays are, so there is a small disk size
          // penalty involved for appending file writes that continuously grow a file similar to std::vector capacity vs used -scheme.
          node.contents = null; 
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
          parent.timestamp = node.timestamp;
        }
        return node;
      },getFileDataAsTypedArray:function(node) {
        if (!node.contents) return new Uint8Array(0);
        if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes); // Make sure to not return excess unused bytes.
        return new Uint8Array(node.contents);
      },expandFileStorage:function(node, newCapacity) {
        var prevCapacity = node.contents ? node.contents.length : 0;
        if (prevCapacity >= newCapacity) return; // No need to expand, the storage was already large enough.
        // Don't expand strictly to the given requested limit if it's only a very small increase, but instead geometrically grow capacity.
        // For small filesizes (<1MB), perform size*2 geometric increase, but for large sizes, do a much more conservative size*1.125 increase to
        // avoid overshooting the allocation cap by a very large margin.
        var CAPACITY_DOUBLING_MAX = 1024 * 1024;
        newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2.0 : 1.125)) >>> 0);
        if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256); // At minimum allocate 256b for each file when expanding.
        var oldContents = node.contents;
        node.contents = new Uint8Array(newCapacity); // Allocate new storage.
        if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0); // Copy old data over to the new storage.
      },resizeFileStorage:function(node, newSize) {
        if (node.usedBytes == newSize) return;
        if (newSize == 0) {
          node.contents = null; // Fully decommit when requesting a resize to zero.
          node.usedBytes = 0;
        } else {
          var oldContents = node.contents;
          node.contents = new Uint8Array(newSize); // Allocate new storage.
          if (oldContents) {
            node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes))); // Copy old data over to the new storage.
          }
          node.usedBytes = newSize;
        }
      },node_ops:{getattr:function(node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.usedBytes;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },setattr:function(node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.resizeFileStorage(node, attr.size);
          }
        },lookup:function(parent, name) {
          throw FS.genericErrors[44];
        },mknod:function(parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },rename:function(old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(55);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.parent.timestamp = Date.now()
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          new_dir.timestamp = old_node.parent.timestamp;
          old_node.parent = new_dir;
        },unlink:function(parent, name) {
          delete parent.contents[name];
          parent.timestamp = Date.now();
        },rmdir:function(parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(55);
          }
          delete parent.contents[name];
          parent.timestamp = Date.now();
        },readdir:function(node) {
          var entries = ['.', '..'];
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function(parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511 /* 0777 */ | 40960, 0);
          node.link = oldpath;
          return node;
        },readlink:function(node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(28);
          }
          return node.link;
        }},stream_ops:{read:function(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= stream.node.usedBytes) return 0;
          var size = Math.min(stream.node.usedBytes - position, length);
          assert(size >= 0);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else {
            for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
          }
          return size;
        },write:function(stream, buffer, offset, length, position, canOwn) {
          // The data buffer should be a typed array view
          assert(!(buffer instanceof ArrayBuffer));
  
          if (!length) return 0;
          var node = stream.node;
          node.timestamp = Date.now();
  
          if (buffer.subarray && (!node.contents || node.contents.subarray)) { // This write is from a typed array to a typed array?
            if (canOwn) {
              assert(position === 0, 'canOwn must imply no weird position inside the file');
              node.contents = buffer.subarray(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (node.usedBytes === 0 && position === 0) { // If this is a simple first write to an empty file, do a fast set since we don't need to care about old data.
              node.contents = buffer.slice(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (position + length <= node.usedBytes) { // Writing to an already allocated and used subrange of the file?
              node.contents.set(buffer.subarray(offset, offset + length), position);
              return length;
            }
          }
  
          // Appending to an existing file and we need to reallocate, or source data did not come as a typed array.
          MEMFS.expandFileStorage(node, position+length);
          if (node.contents.subarray && buffer.subarray) {
            // Use typed array write which is available.
            node.contents.set(buffer.subarray(offset, offset + length), position);
          } else {
            for (var i = 0; i < length; i++) {
             node.contents[position + i] = buffer[offset + i]; // Or fall back to manual write if not.
            }
          }
          node.usedBytes = Math.max(node.usedBytes, position + length);
          return length;
        },llseek:function(stream, offset, whence) {
          var position = offset;
          if (whence === 1) {
            position += stream.position;
          } else if (whence === 2) {
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.usedBytes;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(28);
          }
          return position;
        },allocate:function(stream, offset, length) {
          MEMFS.expandFileStorage(stream.node, offset + length);
          stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
        },mmap:function(stream, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if (!(flags & 2) && contents.buffer === HEAP8.buffer) {
            // We can't emulate MAP_SHARED when the file is not backed by the
            // buffer we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            // Try to avoid unnecessary slices.
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = mmapAlloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(48);
            }
            HEAP8.set(contents, ptr);
          }
          return { ptr, allocated };
        },msync:function(stream, buffer, offset, length, mmapFlags) {
          MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
          // should we check if bytesWritten and length are the same?
          return 0;
        }}};
  
  /** @param {boolean=} noRunDep */
  var asyncLoad = (url, onload, onerror, noRunDep) => {
      var dep = !noRunDep ? getUniqueRunDependency(`al ${url}`) : '';
      readAsync(url, (arrayBuffer) => {
        assert(arrayBuffer, `Loading data file "${url}" failed (no arrayBuffer).`);
        onload(new Uint8Array(arrayBuffer));
        if (dep) removeRunDependency(dep);
      }, (event) => {
        if (onerror) {
          onerror();
        } else {
          throw `Loading data file "${url}" failed.`;
        }
      });
      if (dep) addRunDependency(dep);
    };
  
  
  var preloadPlugins = Module['preloadPlugins'] || [];
  function FS_handledByPreloadPlugin(byteArray, fullname, finish, onerror) {
      // Ensure plugins are ready.
      if (typeof Browser != 'undefined') Browser.init();
  
      var handled = false;
      preloadPlugins.forEach(function(plugin) {
        if (handled) return;
        if (plugin['canHandle'](fullname)) {
          plugin['handle'](byteArray, fullname, finish, onerror);
          handled = true;
        }
      });
      return handled;
    }
  function FS_createPreloadedFile(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
      // TODO we should allow people to just pass in a complete filename instead
      // of parent and name being that we just join them anyways
      var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
      var dep = getUniqueRunDependency(`cp ${fullname}`); // might have several active requests for the same fullname
      function processData(byteArray) {
        function finish(byteArray) {
          if (preFinish) preFinish();
          if (!dontCreateFile) {
            FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
          }
          if (onload) onload();
          removeRunDependency(dep);
        }
        if (FS_handledByPreloadPlugin(byteArray, fullname, finish, () => {
          if (onerror) onerror();
          removeRunDependency(dep);
        })) {
          return;
        }
        finish(byteArray);
      }
      addRunDependency(dep);
      if (typeof url == 'string') {
        asyncLoad(url, (byteArray) => processData(byteArray), onerror);
      } else {
        processData(url);
      }
    }
  
  function FS_modeStringToFlags(str) {
      var flagModes = {
        'r': 0,
        'r+': 2,
        'w': 512 | 64 | 1,
        'w+': 512 | 64 | 2,
        'a': 1024 | 64 | 1,
        'a+': 1024 | 64 | 2,
      };
      var flags = flagModes[str];
      if (typeof flags == 'undefined') {
        throw new Error(`Unknown file open mode: ${str}`);
      }
      return flags;
    }
  
  function FS_getMode(canRead, canWrite) {
      var mode = 0;
      if (canRead) mode |= 292 | 73;
      if (canWrite) mode |= 146;
      return mode;
    }
  
  
  
  
  var ERRNO_MESSAGES = {0:"Success",1:"Arg list too long",2:"Permission denied",3:"Address already in use",4:"Address not available",5:"Address family not supported by protocol family",6:"No more processes",7:"Socket already connected",8:"Bad file number",9:"Trying to read unreadable message",10:"Mount device busy",11:"Operation canceled",12:"No children",13:"Connection aborted",14:"Connection refused",15:"Connection reset by peer",16:"File locking deadlock error",17:"Destination address required",18:"Math arg out of domain of func",19:"Quota exceeded",20:"File exists",21:"Bad address",22:"File too large",23:"Host is unreachable",24:"Identifier removed",25:"Illegal byte sequence",26:"Connection already in progress",27:"Interrupted system call",28:"Invalid argument",29:"I/O error",30:"Socket is already connected",31:"Is a directory",32:"Too many symbolic links",33:"Too many open files",34:"Too many links",35:"Message too long",36:"Multihop attempted",37:"File or path name too long",38:"Network interface is not configured",39:"Connection reset by network",40:"Network is unreachable",41:"Too many open files in system",42:"No buffer space available",43:"No such device",44:"No such file or directory",45:"Exec format error",46:"No record locks available",47:"The link has been severed",48:"Not enough core",49:"No message of desired type",50:"Protocol not available",51:"No space left on device",52:"Function not implemented",53:"Socket is not connected",54:"Not a directory",55:"Directory not empty",56:"State not recoverable",57:"Socket operation on non-socket",59:"Not a typewriter",60:"No such device or address",61:"Value too large for defined data type",62:"Previous owner died",63:"Not super-user",64:"Broken pipe",65:"Protocol error",66:"Unknown protocol",67:"Protocol wrong type for socket",68:"Math result not representable",69:"Read only file system",70:"Illegal seek",71:"No such process",72:"Stale file handle",73:"Connection timed out",74:"Text file busy",75:"Cross-device link",100:"Device not a stream",101:"Bad font file fmt",102:"Invalid slot",103:"Invalid request code",104:"No anode",105:"Block device required",106:"Channel number out of range",107:"Level 3 halted",108:"Level 3 reset",109:"Link number out of range",110:"Protocol driver not attached",111:"No CSI structure available",112:"Level 2 halted",113:"Invalid exchange",114:"Invalid request descriptor",115:"Exchange full",116:"No data (for no delay io)",117:"Timer expired",118:"Out of streams resources",119:"Machine is not on the network",120:"Package not installed",121:"The object is remote",122:"Advertise error",123:"Srmount error",124:"Communication error on send",125:"Cross mount point (not really error)",126:"Given log. name not unique",127:"f.d. invalid for this operation",128:"Remote address changed",129:"Can   access a needed shared lib",130:"Accessing a corrupted shared lib",131:".lib section in a.out corrupted",132:"Attempting to link in too many libs",133:"Attempting to exec a shared library",135:"Streams pipe error",136:"Too many users",137:"Socket type not supported",138:"Not supported",139:"Protocol family not supported",140:"Can't send after socket shutdown",141:"Too many references",142:"Host is down",148:"No medium (in tape drive)",156:"Level 2 not synchronized"};
  
  var ERRNO_CODES = {};
  
  function demangle(func) {
      warnOnce('warning: build with -sDEMANGLE_SUPPORT to link in libcxxabi demangling');
      return func;
    }
  function demangleAll(text) {
      var regex =
        /\b_Z[\w\d_]+/g;
      return text.replace(regex,
        function(x) {
          var y = demangle(x);
          return x === y ? x : (y + ' [' + x + ']');
        });
    }
  var FS = {root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,ErrnoError:null,genericErrors:{},filesystems:null,syncFSRequests:0,lookupPath:(path, opts = {}) => {
        path = PATH_FS.resolve(path);
  
        if (!path) return { path: '', node: null };
  
        var defaults = {
          follow_mount: true,
          recurse_count: 0
        };
        opts = Object.assign(defaults, opts)
  
        if (opts.recurse_count > 8) {  // max recursive lookup of 8
          throw new FS.ErrnoError(32);
        }
  
        // split the absolute path
        var parts = path.split('/').filter((p) => !!p);
  
        // start at the root
        var current = FS.root;
        var current_path = '/';
  
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
  
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
  
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            if (!islast || (islast && opts.follow_mount)) {
              current = current.mounted.root;
            }
          }
  
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
  
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count + 1 });
              current = lookup.node;
  
              if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(32);
              }
            }
          }
        }
  
        return { path: current_path, node: current };
      },getPath:(node) => {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? `${mount}/${path}` : mount + path;
          }
          path = path ? `${node.name}/${path}` : node.name;
          node = node.parent;
        }
      },hashName:(parentid, name) => {
        var hash = 0;
  
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },hashAddNode:(node) => {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },hashRemoveNode:(node) => {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },lookupNode:(parent, name) => {
        var errCode = FS.mayLookup(parent);
        if (errCode) {
          throw new FS.ErrnoError(errCode, parent);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },createNode:(parent, name, mode, rdev) => {
        assert(typeof parent == 'object')
        var node = new FS.FSNode(parent, name, mode, rdev);
  
        FS.hashAddNode(node);
  
        return node;
      },destroyNode:(node) => {
        FS.hashRemoveNode(node);
      },isRoot:(node) => {
        return node === node.parent;
      },isMountpoint:(node) => {
        return !!node.mounted;
      },isFile:(mode) => {
        return (mode & 61440) === 32768;
      },isDir:(mode) => {
        return (mode & 61440) === 16384;
      },isLink:(mode) => {
        return (mode & 61440) === 40960;
      },isChrdev:(mode) => {
        return (mode & 61440) === 8192;
      },isBlkdev:(mode) => {
        return (mode & 61440) === 24576;
      },isFIFO:(mode) => {
        return (mode & 61440) === 4096;
      },isSocket:(mode) => {
        return (mode & 49152) === 49152;
      },flagsToPermissionString:(flag) => {
        var perms = ['r', 'w', 'rw'][flag & 3];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },nodePermissions:(node, perms) => {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.includes('r') && !(node.mode & 292)) {
          return 2;
        } else if (perms.includes('w') && !(node.mode & 146)) {
          return 2;
        } else if (perms.includes('x') && !(node.mode & 73)) {
          return 2;
        }
        return 0;
      },mayLookup:(dir) => {
        var errCode = FS.nodePermissions(dir, 'x');
        if (errCode) return errCode;
        if (!dir.node_ops.lookup) return 2;
        return 0;
      },mayCreate:(dir, name) => {
        try {
          var node = FS.lookupNode(dir, name);
          return 20;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },mayDelete:(dir, name, isdir) => {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var errCode = FS.nodePermissions(dir, 'wx');
        if (errCode) {
          return errCode;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return 54;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return 10;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return 31;
          }
        }
        return 0;
      },mayOpen:(node, flags) => {
        if (!node) {
          return 44;
        }
        if (FS.isLink(node.mode)) {
          return 32;
        } else if (FS.isDir(node.mode)) {
          if (FS.flagsToPermissionString(flags) !== 'r' || // opening for write
              (flags & 512)) { // TODO: check for O_SEARCH? (== search for dir only)
            return 31;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },MAX_OPEN_FDS:4096,nextfd:() => {
        for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(33);
      },getStreamChecked:(fd) => {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        return stream;
      },getStream:(fd) => FS.streams[fd],createStream:(stream, fd = -1) => {
        if (!FS.FSStream) {
          FS.FSStream = /** @constructor */ function() {
            this.shared = { };
          };
          FS.FSStream.prototype = {};
          Object.defineProperties(FS.FSStream.prototype, {
            object: {
              /** @this {FS.FSStream} */
              get: function() { return this.node; },
              /** @this {FS.FSStream} */
              set: function(val) { this.node = val; }
            },
            isRead: {
              /** @this {FS.FSStream} */
              get: function() { return (this.flags & 2097155) !== 1; }
            },
            isWrite: {
              /** @this {FS.FSStream} */
              get: function() { return (this.flags & 2097155) !== 0; }
            },
            isAppend: {
              /** @this {FS.FSStream} */
              get: function() { return (this.flags & 1024); }
            },
            flags: {
              /** @this {FS.FSStream} */
              get: function() { return this.shared.flags; },
              /** @this {FS.FSStream} */
              set: function(val) { this.shared.flags = val; },
            },
            position : {
              /** @this {FS.FSStream} */
              get: function() { return this.shared.position; },
              /** @this {FS.FSStream} */
              set: function(val) { this.shared.position = val; },
            },
          });
        }
        // clone it, so we can return an instance of FSStream
        stream = Object.assign(new FS.FSStream(), stream);
        if (fd == -1) {
          fd = FS.nextfd();
        }
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },closeStream:(fd) => {
        FS.streams[fd] = null;
      },chrdev_stream_ops:{open:(stream) => {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },llseek:() => {
          throw new FS.ErrnoError(70);
        }},major:(dev) => ((dev) >> 8),minor:(dev) => ((dev) & 0xff),makedev:(ma, mi) => ((ma) << 8 | (mi)),registerDevice:(dev, ops) => {
        FS.devices[dev] = { stream_ops: ops };
      },getDevice:(dev) => FS.devices[dev],getMounts:(mount) => {
        var mounts = [];
        var check = [mount];
  
        while (check.length) {
          var m = check.pop();
  
          mounts.push(m);
  
          check.push.apply(check, m.mounts);
        }
  
        return mounts;
      },syncfs:(populate, callback) => {
        if (typeof populate == 'function') {
          callback = populate;
          populate = false;
        }
  
        FS.syncFSRequests++;
  
        if (FS.syncFSRequests > 1) {
          err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
        }
  
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
  
        function doCallback(errCode) {
          assert(FS.syncFSRequests > 0);
          FS.syncFSRequests--;
          return callback(errCode);
        }
  
        function done(errCode) {
          if (errCode) {
            if (!done.errored) {
              done.errored = true;
              return doCallback(errCode);
            }
            return;
          }
          if (++completed >= mounts.length) {
            doCallback(null);
          }
        };
  
        // sync all mounts
        mounts.forEach((mount) => {
          if (!mount.type.syncfs) {
            return done(null);
          }
          mount.type.syncfs(mount, populate, done);
        });
      },mount:(type, opts, mountpoint) => {
        if (typeof type == 'string') {
          // The filesystem was not included, and instead we have an error
          // message stored in the variable.
          throw type;
        }
        var root = mountpoint === '/';
        var pseudo = !mountpoint;
        var node;
  
        if (root && FS.root) {
          throw new FS.ErrnoError(10);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
          mountpoint = lookup.path;  // use the absolute path
          node = lookup.node;
  
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }
  
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54);
          }
        }
  
        var mount = {
          type,
          opts,
          mountpoint,
          mounts: []
        };
  
        // create a root node for the fs
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
  
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          // set as a mountpoint
          node.mounted = mount;
  
          // add the new mount to the current mount's children
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
  
        return mountRoot;
      },unmount:(mountpoint) => {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(28);
        }
  
        // destroy the nodes for this mount, and all its child mounts
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
  
        Object.keys(FS.nameTable).forEach((hash) => {
          var current = FS.nameTable[hash];
  
          while (current) {
            var next = current.name_next;
  
            if (mounts.includes(current.mount)) {
              FS.destroyNode(current);
            }
  
            current = next;
          }
        });
  
        // no longer a mountpoint
        node.mounted = null;
  
        // remove this mount from the child mounts
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1);
      },lookup:(parent, name) => {
        return parent.node_ops.lookup(parent, name);
      },mknod:(path, mode, dev) => {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name || name === '.' || name === '..') {
          throw new FS.ErrnoError(28);
        }
        var errCode = FS.mayCreate(parent, name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },create:(path, mode) => {
        mode = mode !== undefined ? mode : 438 /* 0666 */;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },mkdir:(path, mode) => {
        mode = mode !== undefined ? mode : 511 /* 0777 */;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },mkdirTree:(path, mode) => {
        var dirs = path.split('/');
        var d = '';
        for (var i = 0; i < dirs.length; ++i) {
          if (!dirs[i]) continue;
          d += '/' + dirs[i];
          try {
            FS.mkdir(d, mode);
          } catch(e) {
            if (e.errno != 20) throw e;
          }
        }
      },mkdev:(path, mode, dev) => {
        if (typeof dev == 'undefined') {
          dev = mode;
          mode = 438 /* 0666 */;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },symlink:(oldpath, newpath) => {
        if (!PATH_FS.resolve(oldpath)) {
          throw new FS.ErrnoError(44);
        }
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var newname = PATH.basename(newpath);
        var errCode = FS.mayCreate(parent, newname);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },rename:(old_path, new_path) => {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
  
        // let the errors from non existant directories percolate up
        lookup = FS.lookupPath(old_path, { parent: true });
        old_dir = lookup.node;
        lookup = FS.lookupPath(new_path, { parent: true });
        new_dir = lookup.node;
  
        if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(75);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH_FS.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(28);
        }
        // new path should not be an ancestor of the old path
        relative = PATH_FS.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(55);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var errCode = FS.mayDelete(old_dir, old_name, isdir);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        errCode = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(10);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          errCode = FS.nodePermissions(old_dir, 'w');
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
      },rmdir:(path) => {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, true);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },readdir:(path) => {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(54);
        }
        return node.node_ops.readdir(node);
      },unlink:(path) => {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, false);
        if (errCode) {
          // According to POSIX, we should map EISDIR to EPERM, but
          // we instead do what Linux does (and we must, as we use
          // the musl linux libc).
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },readlink:(path) => {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
          throw new FS.ErrnoError(44);
        }
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(28);
        }
        return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
      },stat:(path, dontFollow) => {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node) {
          throw new FS.ErrnoError(44);
        }
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(63);
        }
        return node.node_ops.getattr(node);
      },lstat:(path) => {
        return FS.stat(path, true);
      },chmod:(path, mode, dontFollow) => {
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },lchmod:(path, mode) => {
        FS.chmod(path, mode, true);
      },fchmod:(fd, mode) => {
        var stream = FS.getStreamChecked(fd);
        FS.chmod(stream.node, mode);
      },chown:(path, uid, gid, dontFollow) => {
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },lchown:(path, uid, gid) => {
        FS.chown(path, uid, gid, true);
      },fchown:(fd, uid, gid) => {
        var stream = FS.getStreamChecked(fd);
        FS.chown(stream.node, uid, gid);
      },truncate:(path, len) => {
        if (len < 0) {
          throw new FS.ErrnoError(28);
        }
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(28);
        }
        var errCode = FS.nodePermissions(node, 'w');
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },ftruncate:(fd, len) => {
        var stream = FS.getStreamChecked(fd);
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(28);
        }
        FS.truncate(stream.node, len);
      },utime:(path, atime, mtime) => {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },open:(path, flags, mode) => {
        if (path === "") {
          throw new FS.ErrnoError(44);
        }
        flags = typeof flags == 'string' ? FS_modeStringToFlags(flags) : flags;
        mode = typeof mode == 'undefined' ? 438 /* 0666 */ : mode;
        if ((flags & 64)) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path == 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {
            // ignore
          }
        }
        // perhaps we need to create the node
        var created = false;
        if ((flags & 64)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 128)) {
              throw new FS.ErrnoError(20);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
            created = true;
          }
        }
        if (!node) {
          throw new FS.ErrnoError(44);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        // if asked only for a directory, then this must be one
        if ((flags & 65536) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(54);
        }
        // check permissions, if this is not a file we just created now (it is ok to
        // create and write to a file with read-only permissions; it is read-only
        // for later use)
        if (!created) {
          var errCode = FS.mayOpen(node, flags);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }
        // do truncation if necessary
        if ((flags & 512) && !created) {
          FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        flags &= ~(128 | 512 | 131072);
  
        // register the stream with the filesystem
        var stream = FS.createStream({
          node,
          path: FS.getPath(node),  // we want the absolute path to the node
          flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        });
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
          }
        }
        return stream;
      },close:(stream) => {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (stream.getdents) stream.getdents = null; // free readdir state
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
        stream.fd = null;
      },isClosed:(stream) => {
        return stream.fd === null;
      },llseek:(stream, offset, whence) => {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(70);
        }
        if (whence != 0 && whence != 1 && whence != 2) {
          throw new FS.ErrnoError(28);
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position;
      },read:(stream, buffer, offset, length, position) => {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(28);
        }
        var seeking = typeof position != 'undefined';
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },write:(stream, buffer, offset, length, position, canOwn) => {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(28);
        }
        if (stream.seekable && stream.flags & 1024) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var seeking = typeof position != 'undefined';
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },allocate:(stream, offset, length) => {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(28);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(43);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(138);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },mmap:(stream, length, position, prot, flags) => {
        // User requests writing to file (prot & PROT_WRITE != 0).
        // Checking if we have permissions to write to the file unless
        // MAP_PRIVATE flag is set. According to POSIX spec it is possible
        // to write to file opened in read-only mode with MAP_PRIVATE flag,
        // as all modifications will be visible only in the memory of
        // the current process.
        if ((prot & 2) !== 0
            && (flags & 2) === 0
            && (stream.flags & 2097155) !== 2) {
          throw new FS.ErrnoError(2);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(2);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(43);
        }
        return stream.stream_ops.mmap(stream, length, position, prot, flags);
      },msync:(stream, buffer, offset, length, mmapFlags) => {
        if (!stream.stream_ops.msync) {
          return 0;
        }
        return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
      },munmap:(stream) => 0,ioctl:(stream, cmd, arg) => {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(59);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },readFile:(path, opts = {}) => {
        opts.flags = opts.flags || 0;
        opts.encoding = opts.encoding || 'binary';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error(`Invalid encoding type "${opts.encoding}"`);
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = UTF8ArrayToString(buf, 0);
        } else if (opts.encoding === 'binary') {
          ret = buf;
        }
        FS.close(stream);
        return ret;
      },writeFile:(path, data, opts = {}) => {
        opts.flags = opts.flags || 577;
        var stream = FS.open(path, opts.flags, opts.mode);
        if (typeof data == 'string') {
          var buf = new Uint8Array(lengthBytesUTF8(data)+1);
          var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
          FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
        } else if (ArrayBuffer.isView(data)) {
          FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
        } else {
          throw new Error('Unsupported data type');
        }
        FS.close(stream);
      },cwd:() => FS.currentPath,chdir:(path) => {
        var lookup = FS.lookupPath(path, { follow: true });
        if (lookup.node === null) {
          throw new FS.ErrnoError(44);
        }
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(54);
        }
        var errCode = FS.nodePermissions(lookup.node, 'x');
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        FS.currentPath = lookup.path;
      },createDefaultDirectories:() => {
        FS.mkdir('/tmp');
        FS.mkdir('/home');
        FS.mkdir('/home/web_user');
      },createDefaultDevices:() => {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: () => 0,
          write: (stream, buffer, offset, length, pos) => length,
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using err() rather than out()
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // setup /dev/[u]random
        // use a buffer to avoid overhead of individual crypto calls per byte
        var randomBuffer = new Uint8Array(1024), randomLeft = 0;
        var randomByte = () => {
          if (randomLeft === 0) {
            randomLeft = randomFill(randomBuffer).byteLength;
          }
          return randomBuffer[--randomLeft];
        };
        FS.createDevice('/dev', 'random', randomByte);
        FS.createDevice('/dev', 'urandom', randomByte);
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },createSpecialDirectories:() => {
        // create /proc/self/fd which allows /proc/self/fd/6 => readlink gives the
        // name of the stream for fd 6 (see test_unistd_ttyname)
        FS.mkdir('/proc');
        var proc_self = FS.mkdir('/proc/self');
        FS.mkdir('/proc/self/fd');
        FS.mount({
          mount: () => {
            var node = FS.createNode(proc_self, 'fd', 16384 | 511 /* 0777 */, 73);
            node.node_ops = {
              lookup: (parent, name) => {
                var fd = +name;
                var stream = FS.getStreamChecked(fd);
                var ret = {
                  parent: null,
                  mount: { mountpoint: 'fake' },
                  node_ops: { readlink: () => stream.path },
                };
                ret.parent = ret; // make it look like a simple root node
                return ret;
              }
            };
            return node;
          }
        }, {}, '/proc/self/fd');
      },createStandardStreams:() => {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
  
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
  
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 0);
        var stdout = FS.open('/dev/stdout', 1);
        var stderr = FS.open('/dev/stderr', 1);
        assert(stdin.fd === 0, `invalid handle for stdin (${stdin.fd})`);
        assert(stdout.fd === 1, `invalid handle for stdout (${stdout.fd})`);
        assert(stderr.fd === 2, `invalid handle for stderr (${stderr.fd})`);
      },ensureErrnoError:() => {
        if (FS.ErrnoError) return;
        FS.ErrnoError = /** @this{Object} */ function ErrnoError(errno, node) {
          // We set the `name` property to be able to identify `FS.ErrnoError`
          // - the `name` is a standard ECMA-262 property of error objects. Kind of good to have it anyway.
          // - when using PROXYFS, an error can come from an underlying FS
          // as different FS objects have their own FS.ErrnoError each,
          // the test `err instanceof FS.ErrnoError` won't detect an error coming from another filesystem, causing bugs.
          // we'll use the reliable test `err.name == "ErrnoError"` instead
          this.name = 'ErrnoError';
          this.node = node;
          this.setErrno = /** @this{Object} */ function(errno) {
            this.errno = errno;
            for (var key in ERRNO_CODES) {
              if (ERRNO_CODES[key] === errno) {
                this.code = key;
                break;
              }
            }
          };
          this.setErrno(errno);
          this.message = ERRNO_MESSAGES[errno];
  
          // Try to get a maximally helpful stack trace. On Node.js, getting Error.stack
          // now ensures it shows what we want.
          if (this.stack) {
            // Define the stack property for Node.js 4, which otherwise errors on the next line.
            Object.defineProperty(this, "stack", { value: (new Error).stack, writable: true });
            this.stack = demangleAll(this.stack);
          }
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
        [44].forEach((code) => {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
      },staticInit:() => {
        FS.ensureErrnoError();
  
        FS.nameTable = new Array(4096);
  
        FS.mount(MEMFS, {}, '/');
  
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
  
        FS.filesystems = {
          'MEMFS': MEMFS,
        };
      },init:(input, output, error) => {
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
  
        FS.ensureErrnoError();
  
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
  
        FS.createStandardStreams();
      },quit:() => {
        FS.init.initialized = false;
        // force-flush all streams, so we get musl std streams printed out
        _fflush(0);
        // close all of our streams
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },findObject:(path, dontResolveLastLink) => {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (!ret.exists) {
          return null;
        }
        return ret.object;
      },analyzePath:(path, dontResolveLastLink) => {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },createPath:(parent, path, canRead, canWrite) => {
        parent = typeof parent == 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },createFile:(parent, name, properties, canRead, canWrite) => {
        var path = PATH.join2(typeof parent == 'string' ? parent : FS.getPath(parent), name);
        var mode = FS_getMode(canRead, canWrite);
        return FS.create(path, mode);
      },createDataFile:(parent, name, data, canRead, canWrite, canOwn) => {
        var path = name;
        if (parent) {
          parent = typeof parent == 'string' ? parent : FS.getPath(parent);
          path = name ? PATH.join2(parent, name) : parent;
        }
        var mode = FS_getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data == 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 577);
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
        return node;
      },createDevice:(parent, name, input, output) => {
        var path = PATH.join2(typeof parent == 'string' ? parent : FS.getPath(parent), name);
        var mode = FS_getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open: (stream) => {
            stream.seekable = false;
          },
          close: (stream) => {
            // flush any pending line data
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: (stream, buffer, offset, length, pos /* ignored */) => {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(6);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: (stream, buffer, offset, length, pos) => {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },forceLoadFile:(obj) => {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        if (typeof XMLHttpRequest != 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (read_) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(read_(obj.url), true);
            obj.usedBytes = obj.contents.length;
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
      },createLazyFile:(parent, name, url, canRead, canWrite) => {
        // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
        /** @constructor */
        function LazyUint8Array() {
          this.lengthKnown = false;
          this.chunks = []; // Loaded chunks. Index is the chunk number
        }
        LazyUint8Array.prototype.get = /** @this{Object} */ function LazyUint8Array_get(idx) {
          if (idx > this.length-1 || idx < 0) {
            return undefined;
          }
          var chunkOffset = idx % this.chunkSize;
          var chunkNum = (idx / this.chunkSize)|0;
          return this.getter(chunkNum)[chunkOffset];
        };
        LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
          this.getter = getter;
        };
        LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
          // Find length
          var xhr = new XMLHttpRequest();
          xhr.open('HEAD', url, false);
          xhr.send(null);
          if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
          var datalength = Number(xhr.getResponseHeader("Content-length"));
          var header;
          var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
          var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
  
          var chunkSize = 1024*1024; // Chunk size in bytes
  
          if (!hasByteServing) chunkSize = datalength;
  
          // Function to get a range from the remote URL.
          var doXHR = (from, to) => {
            if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
            if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
  
            // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
  
            // Some hints to the browser that we want binary data.
            xhr.responseType = 'arraybuffer';
            if (xhr.overrideMimeType) {
              xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
  
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            if (xhr.response !== undefined) {
              return new Uint8Array(/** @type{Array<number>} */(xhr.response || []));
            }
            return intArrayFromString(xhr.responseText || '', true);
          };
          var lazyArray = this;
          lazyArray.setDataGetter((chunkNum) => {
            var start = chunkNum * chunkSize;
            var end = (chunkNum+1) * chunkSize - 1; // including this byte
            end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
            if (typeof lazyArray.chunks[chunkNum] == 'undefined') {
              lazyArray.chunks[chunkNum] = doXHR(start, end);
            }
            if (typeof lazyArray.chunks[chunkNum] == 'undefined') throw new Error('doXHR failed!');
            return lazyArray.chunks[chunkNum];
          });
  
          if (usesGzip || !datalength) {
            // if the server uses gzip or doesn't supply the length, we have to download the whole file to get the (uncompressed) length
            chunkSize = datalength = 1; // this will force getter(0)/doXHR do download the whole file
            datalength = this.getter(0).length;
            chunkSize = datalength;
            out("LazyFiles on gzip forces download of the whole file when length is accessed");
          }
  
          this._length = datalength;
          this._chunkSize = chunkSize;
          this.lengthKnown = true;
        };
        if (typeof XMLHttpRequest != 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          var lazyArray = new LazyUint8Array();
          Object.defineProperties(lazyArray, {
            length: {
              get: /** @this{Object} */ function() {
                if (!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._length;
              }
            },
            chunkSize: {
              get: /** @this{Object} */ function() {
                if (!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._chunkSize;
              }
            }
          });
  
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
  
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // Add a function that defers querying the file size until it is asked the first time.
        Object.defineProperties(node, {
          usedBytes: {
            get: /** @this {FSNode} */ function() { return this.contents.length; }
          }
        });
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach((key) => {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            FS.forceLoadFile(node);
            return fn.apply(null, arguments);
          };
        });
        function writeChunks(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        }
        // use a custom read function
        stream_ops.read = (stream, buffer, offset, length, position) => {
          FS.forceLoadFile(node);
          return writeChunks(stream, buffer, offset, length, position)
        };
        // use a custom mmap function
        stream_ops.mmap = (stream, length, position, prot, flags) => {
          FS.forceLoadFile(node);
          var ptr = mmapAlloc(length);
          if (!ptr) {
            throw new FS.ErrnoError(48);
          }
          writeChunks(stream, HEAP8, ptr, length, position);
          return { ptr, allocated: true };
        };
        node.stream_ops = stream_ops;
        return node;
      },absolutePath:() => {
        abort('FS.absolutePath has been removed; use PATH_FS.resolve instead');
      },createFolder:() => {
        abort('FS.createFolder has been removed; use FS.mkdir instead');
      },createLink:() => {
        abort('FS.createLink has been removed; use FS.symlink instead');
      },joinPath:() => {
        abort('FS.joinPath has been removed; use PATH.join instead');
      },mmapAlloc:() => {
        abort('FS.mmapAlloc has been replaced by the top level function mmapAlloc');
      },standardizePath:() => {
        abort('FS.standardizePath has been removed; use PATH.normalize instead');
      }};
  
  
    /**
     * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
     * emscripten HEAP, returns a copy of that string as a Javascript String object.
     *
     * @param {number} ptr
     * @param {number=} maxBytesToRead - An optional length that specifies the
     *   maximum number of bytes to read. You can omit this parameter to scan the
     *   string until the first 0 byte. If maxBytesToRead is passed, and the string
     *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
     *   string will cut short at that byte index (i.e. maxBytesToRead will not
     *   produce a string of exact length [ptr, ptr+maxBytesToRead[) N.B. mixing
     *   frequent uses of UTF8ToString() with and without maxBytesToRead may throw
     *   JS JIT optimizations off, so it is worth to consider consistently using one
     * @return {string}
     */
  var UTF8ToString = (ptr, maxBytesToRead) => {
      assert(typeof ptr == 'number');
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
    };
  var SYSCALLS = {DEFAULT_POLLMASK:5,calculateAt:function(dirfd, path, allowEmpty) {
        if (PATH.isAbs(path)) {
          return path;
        }
        // relative path
        var dir;
        if (dirfd === -100) {
          dir = FS.cwd();
        } else {
          var dirstream = SYSCALLS.getStreamFromFD(dirfd);
          dir = dirstream.path;
        }
        if (path.length == 0) {
          if (!allowEmpty) {
            throw new FS.ErrnoError(44);;
          }
          return dir;
        }
        return PATH.join2(dir, path);
      },doStat:function(func, path, buf) {
        try {
          var stat = func(path);
        } catch (e) {
          if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
            // an error occurred while trying to look up the path; we should just report ENOTDIR
            return -54;
          }
          throw e;
        }
        HEAP32[((buf)>>2)] = stat.dev;
        HEAP32[(((buf)+(4))>>2)] = stat.mode;
        HEAPU32[(((buf)+(8))>>2)] = stat.nlink;
        HEAP32[(((buf)+(12))>>2)] = stat.uid;
        HEAP32[(((buf)+(16))>>2)] = stat.gid;
        HEAP32[(((buf)+(20))>>2)] = stat.rdev;
        (tempI64 = [stat.size>>>0,(tempDouble=stat.size,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((buf)+(24))>>2)] = tempI64[0],HEAP32[(((buf)+(28))>>2)] = tempI64[1]);
        HEAP32[(((buf)+(32))>>2)] = 4096;
        HEAP32[(((buf)+(36))>>2)] = stat.blocks;
        var atime = stat.atime.getTime();
        var mtime = stat.mtime.getTime();
        var ctime = stat.ctime.getTime();
        (tempI64 = [Math.floor(atime / 1000)>>>0,(tempDouble=Math.floor(atime / 1000),(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((buf)+(40))>>2)] = tempI64[0],HEAP32[(((buf)+(44))>>2)] = tempI64[1]);
        HEAPU32[(((buf)+(48))>>2)] = (atime % 1000) * 1000;
        (tempI64 = [Math.floor(mtime / 1000)>>>0,(tempDouble=Math.floor(mtime / 1000),(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((buf)+(56))>>2)] = tempI64[0],HEAP32[(((buf)+(60))>>2)] = tempI64[1]);
        HEAPU32[(((buf)+(64))>>2)] = (mtime % 1000) * 1000;
        (tempI64 = [Math.floor(ctime / 1000)>>>0,(tempDouble=Math.floor(ctime / 1000),(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((buf)+(72))>>2)] = tempI64[0],HEAP32[(((buf)+(76))>>2)] = tempI64[1]);
        HEAPU32[(((buf)+(80))>>2)] = (ctime % 1000) * 1000;
        (tempI64 = [stat.ino>>>0,(tempDouble=stat.ino,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((buf)+(88))>>2)] = tempI64[0],HEAP32[(((buf)+(92))>>2)] = tempI64[1]);
        return 0;
      },doMsync:function(addr, stream, len, flags, offset) {
        if (!FS.isFile(stream.node.mode)) {
          throw new FS.ErrnoError(43);
        }
        if (flags & 2) {
          // MAP_PRIVATE calls need not to be synced back to underlying fs
          return 0;
        }
        var buffer = HEAPU8.slice(addr, addr + len);
        FS.msync(stream, buffer, offset, len, flags);
      },varargs:undefined,get:function() {
        assert(SYSCALLS.varargs != undefined);
        SYSCALLS.varargs += 4;
        var ret = HEAP32[(((SYSCALLS.varargs)-(4))>>2)];
        return ret;
      },getStr:function(ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },getStreamFromFD:function(fd) {
        var stream = FS.getStreamChecked(fd);
        return stream;
      }};
  var _proc_exit = (code) => {
      EXITSTATUS = code;
      if (!keepRuntimeAlive()) {
        if (Module['onExit']) Module['onExit'](code);
        ABORT = true;
      }
      quit_(code, new ExitStatus(code));
    };
  /** @suppress {duplicate } */
  /** @param {boolean|number=} implicit */
  var exitJS = (status, implicit) => {
      EXITSTATUS = status;
  
      checkUnflushedContent();
  
      // if exit() was called explicitly, warn the user if the runtime isn't actually being shut down
      if (keepRuntimeAlive() && !implicit) {
        var msg = `program exited (with status: ${status}), but keepRuntimeAlive() is set (counter=${runtimeKeepaliveCounter}) due to an async operation, so halting execution but not exiting the runtime or preventing further async execution (you can use emscripten_force_exit, if you want to force a true shutdown)`;
        readyPromiseReject(msg);
        err(msg);
      }
  
      _proc_exit(status);
    };
  var _exit = exitJS;
  
  var maybeExit = () => {
      if (!keepRuntimeAlive()) {
        try {
          _exit(EXITSTATUS);
        } catch (e) {
          handleException(e);
        }
      }
    };
  var callUserCallback = (func) => {
      if (ABORT) {
        err('user callback triggered after runtime exited or application aborted.  Ignoring.');
        return;
      }
      try {
        func();
        maybeExit();
      } catch (e) {
        handleException(e);
      }
    };
  
  /** @param {number=} timeout */
  var safeSetTimeout = (func, timeout) => {
      
      return setTimeout(() => {
        
        callUserCallback(func);
      }, timeout);
    };
  
  
  
  
  var Browser = {mainLoop:{running:false,scheduler:null,method:"",currentlyRunningMainloop:0,func:null,arg:0,timingMode:0,timingValue:0,currentFrameNumber:0,queue:[],pause:function() {
          Browser.mainLoop.scheduler = null;
          // Incrementing this signals the previous main loop that it's now become old, and it must return.
          Browser.mainLoop.currentlyRunningMainloop++;
        },resume:function() {
          Browser.mainLoop.currentlyRunningMainloop++;
          var timingMode = Browser.mainLoop.timingMode;
          var timingValue = Browser.mainLoop.timingValue;
          var func = Browser.mainLoop.func;
          Browser.mainLoop.func = null;
          // do not set timing and call scheduler, we will do it on the next lines
          setMainLoop(func, 0, false, Browser.mainLoop.arg, true);
          _emscripten_set_main_loop_timing(timingMode, timingValue);
          Browser.mainLoop.scheduler();
        },updateStatus:function() {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        },runIter:function(func) {
          if (ABORT) return;
          if (Module['preMainLoop']) {
            var preRet = Module['preMainLoop']();
            if (preRet === false) {
              return; // |return false| skips a frame
            }
          }
          callUserCallback(func);
          if (Module['postMainLoop']) Module['postMainLoop']();
        }},isFullscreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function() {
        if (Browser.initted) return;
        Browser.initted = true;
  
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
  
        var imagePlugin = {};
        imagePlugin['canHandle'] = function imagePlugin_canHandle(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = function imagePlugin_handle(byteArray, name, onload, onerror) {
          var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
          if (b.size !== byteArray.length) { // Safari bug #118630
            // Safari's Blob can only take an ArrayBuffer
            b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
          }
          var url = URL.createObjectURL(b);
          assert(typeof url == 'string', 'createObjectURL must return a url as a string');
          var img = new Image();
          img.onload = () => {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = /** @type {!HTMLCanvasElement} */ (document.createElement('canvas'));
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            preloadedImages[name] = canvas;
            URL.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = (event) => {
            out('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        preloadPlugins.push(imagePlugin);
  
        var audioPlugin = {};
        audioPlugin['canHandle'] = function audioPlugin_canHandle(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function audioPlugin_handle(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            preloadedAudios[name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            preloadedAudios[name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
          var url = URL.createObjectURL(b); // XXX we never revoke this!
          assert(typeof url == 'string', 'createObjectURL must return a url as a string');
          var audio = new Audio();
          audio.addEventListener('canplaythrough', () => finish(audio), false); // use addEventListener due to chromium bug 124926
          audio.onerror = function audio_onerror(event) {
            if (done) return;
            err('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
            function encode64(data) {
              var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
              var PAD = '=';
              var ret = '';
              var leftchar = 0;
              var leftbits = 0;
              for (var i = 0; i < data.length; i++) {
                leftchar = (leftchar << 8) | data[i];
                leftbits += 8;
                while (leftbits >= 6) {
                  var curr = (leftchar >> (leftbits-6)) & 0x3f;
                  leftbits -= 6;
                  ret += BASE[curr];
                }
              }
              if (leftbits == 2) {
                ret += BASE[(leftchar&3) << 4];
                ret += PAD + PAD;
              } else if (leftbits == 4) {
                ret += BASE[(leftchar&0xf) << 2];
                ret += PAD;
              }
              return ret;
            }
            audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
            finish(audio); // we don't wait for confirmation this worked - but it's worth trying
          };
          audio.src = url;
          // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
          safeSetTimeout(() => {
            finish(audio); // try to use it even though it is not necessarily ready to play
          }, 10000);
        };
        preloadPlugins.push(audioPlugin);
  
        // Canvas event setup
  
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === Module['canvas'] ||
                                document['mozPointerLockElement'] === Module['canvas'] ||
                                document['webkitPointerLockElement'] === Module['canvas'] ||
                                document['msPointerLockElement'] === Module['canvas'];
        }
        var canvas = Module['canvas'];
        if (canvas) {
          // forced aspect ratio can be enabled by defining 'forcedAspectRatio' on Module
          // Module['forcedAspectRatio'] = 4 / 3;
  
          canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                      canvas['mozRequestPointerLock'] ||
                                      canvas['webkitRequestPointerLock'] ||
                                      canvas['msRequestPointerLock'] ||
                                      (() => {});
          canvas.exitPointerLock = document['exitPointerLock'] ||
                                   document['mozExitPointerLock'] ||
                                   document['webkitExitPointerLock'] ||
                                   document['msExitPointerLock'] ||
                                   (() => {}); // no-op if function does not exist
          canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
  
          document.addEventListener('pointerlockchange', pointerLockChange, false);
          document.addEventListener('mozpointerlockchange', pointerLockChange, false);
          document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
          document.addEventListener('mspointerlockchange', pointerLockChange, false);
  
          if (Module['elementPointerLock']) {
            canvas.addEventListener("click", (ev) => {
              if (!Browser.pointerLock && Module['canvas'].requestPointerLock) {
                Module['canvas'].requestPointerLock();
                ev.preventDefault();
              }
            }, false);
          }
        }
      },createContext:function(/** @type {HTMLCanvasElement} */ canvas, useWebGL, setInModule, webGLContextAttributes) {
        if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx; // no need to recreate GL context if it's already been created for this canvas.
  
        var ctx;
        var contextHandle;
        if (useWebGL) {
          // For GLES2/desktop GL compatibility, adjust a few defaults to be different to WebGL defaults, so that they align better with the desktop defaults.
          var contextAttributes = {
            antialias: false,
            alpha: false,
            majorVersion: 1,
          };
  
          if (webGLContextAttributes) {
            for (var attribute in webGLContextAttributes) {
              contextAttributes[attribute] = webGLContextAttributes[attribute];
            }
          }
  
          // This check of existence of GL is here to satisfy Closure compiler, which yells if variable GL is referenced below but GL object is not
          // actually compiled in because application is not doing any GL operations. TODO: Ideally if GL is not being used, this function
          // Browser.createContext() should not even be emitted.
          if (typeof GL != 'undefined') {
            contextHandle = GL.createContext(canvas, contextAttributes);
            if (contextHandle) {
              ctx = GL.getContext(contextHandle).GLctx;
            }
          }
        } else {
          ctx = canvas.getContext('2d');
        }
  
        if (!ctx) return null;
  
        if (setInModule) {
          if (!useWebGL) assert(typeof GLctx == 'undefined', 'cannot set in module if GLctx is used, but we are a non-GL context that would replace it');
  
          Module.ctx = ctx;
          if (useWebGL) GL.makeContextCurrent(contextHandle);
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach((callback) => callback());
          Browser.init();
        }
        return ctx;
      },destroyContext:function(canvas, useWebGL, setInModule) {},fullscreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullscreen:function(lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer == 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas == 'undefined') Browser.resizeCanvas = false;
  
        var canvas = Module['canvas'];
        function fullscreenChange() {
          Browser.isFullscreen = false;
          var canvasContainer = canvas.parentNode;
          if ((document['fullscreenElement'] || document['mozFullScreenElement'] ||
               document['msFullscreenElement'] || document['webkitFullscreenElement'] ||
               document['webkitCurrentFullScreenElement']) === canvasContainer) {
            canvas.exitFullscreen = Browser.exitFullscreen;
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullscreen = true;
            if (Browser.resizeCanvas) {
              Browser.setFullscreenCanvasSize();
            } else {
              Browser.updateCanvasDimensions(canvas);
            }
          } else {
            // remove the full screen specific parent of the canvas again to restore the HTML structure from before going full screen
            canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
            canvasContainer.parentNode.removeChild(canvasContainer);
  
            if (Browser.resizeCanvas) {
              Browser.setWindowedCanvasSize();
            } else {
              Browser.updateCanvasDimensions(canvas);
            }
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullscreen);
          if (Module['onFullscreen']) Module['onFullscreen'](Browser.isFullscreen);
        }
  
        if (!Browser.fullscreenHandlersInstalled) {
          Browser.fullscreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullscreenChange, false);
          document.addEventListener('mozfullscreenchange', fullscreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullscreenChange, false);
          document.addEventListener('MSFullscreenChange', fullscreenChange, false);
        }
  
        // create a new parent to ensure the canvas has no siblings. this allows browsers to optimize full screen performance when its parent is the full screen root
        var canvasContainer = document.createElement("div");
        canvas.parentNode.insertBefore(canvasContainer, canvas);
        canvasContainer.appendChild(canvas);
  
        // use parent of canvas as full screen root to allow aspect ratio correction (Firefox stretches the root to screen size)
        canvasContainer.requestFullscreen = canvasContainer['requestFullscreen'] ||
                                            canvasContainer['mozRequestFullScreen'] ||
                                            canvasContainer['msRequestFullscreen'] ||
                                           (canvasContainer['webkitRequestFullscreen'] ? () => canvasContainer['webkitRequestFullscreen'](Element['ALLOW_KEYBOARD_INPUT']) : null) ||
                                           (canvasContainer['webkitRequestFullScreen'] ? () => canvasContainer['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) : null);
  
        canvasContainer.requestFullscreen();
      },requestFullScreen:function() {
        abort('Module.requestFullScreen has been replaced by Module.requestFullscreen (without a capital S)');
      },exitFullscreen:function() {
        // This is workaround for chrome. Trying to exit from fullscreen
        // not in fullscreen state will cause "TypeError: Document not active"
        // in chrome. See https://github.com/emscripten-core/emscripten/pull/8236
        if (!Browser.isFullscreen) {
          return false;
        }
  
        var CFS = document['exitFullscreen'] ||
                  document['cancelFullScreen'] ||
                  document['mozCancelFullScreen'] ||
                  document['msExitFullscreen'] ||
                  document['webkitCancelFullScreen'] ||
            (() => {});
        CFS.apply(document, []);
        return true;
      },nextRAF:0,fakeRequestAnimationFrame:function(func) {
        // try to keep 60fps between calls to here
        var now = Date.now();
        if (Browser.nextRAF === 0) {
          Browser.nextRAF = now + 1000/60;
        } else {
          while (now + 2 >= Browser.nextRAF) { // fudge a little, to avoid timer jitter causing us to do lots of delay:0
            Browser.nextRAF += 1000/60;
          }
        }
        var delay = Math.max(Browser.nextRAF - now, 0);
        setTimeout(func, delay);
      },requestAnimationFrame:function(func) {
        if (typeof requestAnimationFrame == 'function') {
          requestAnimationFrame(func);
          return;
        }
        var RAF = Browser.fakeRequestAnimationFrame;
        RAF(func);
      },safeSetTimeout:function(func, timeout) {
        // Legacy function, this is used by the SDL2 port so we need to keep it
        // around at least until that is updated.
        // See https://github.com/libsdl-org/SDL/pull/6304
        return safeSetTimeout(func, timeout);
      },safeRequestAnimationFrame:function(func) {
        
        return Browser.requestAnimationFrame(() => {
          
          callUserCallback(func);
        });
      },getMimetype:function(name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.')+1)];
      },getUserMedia:function(func) {
        if (!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
      },getMovementX:function(event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function(event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },getMouseWheelDelta:function(event) {
        var delta = 0;
        switch (event.type) {
          case 'DOMMouseScroll':
            // 3 lines make up a step
            delta = event.detail / 3;
            break;
          case 'mousewheel':
            // 120 units make up a step
            delta = event.wheelDelta / 120;
            break;
          case 'wheel':
            delta = event.deltaY
            switch (event.deltaMode) {
              case 0:
                // DOM_DELTA_PIXEL: 100 pixels make up a step
                delta /= 100;
                break;
              case 1:
                // DOM_DELTA_LINE: 3 lines make up a step
                delta /= 3;
                break;
              case 2:
                // DOM_DELTA_PAGE: A page makes up 80 steps
                delta *= 80;
                break;
              default:
                throw 'unrecognized mouse wheel delta mode: ' + event.deltaMode;
            }
            break;
          default:
            throw 'unrecognized mouse wheel event: ' + event.type;
        }
        return delta;
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,touches:{},lastTouches:{},calculateMouseEvent:function(event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
  
          // check if SDL is available
          if (typeof SDL != "undefined") {
            Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
            Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
            // just add the mouse delta to the current absolut mouse position
            // FIXME: ideally this should be clamped against the canvas size and zero
            Browser.mouseX += Browser.mouseMovementX;
            Browser.mouseY += Browser.mouseMovementY;
          }
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
  
          // Neither .scrollX or .pageXOffset are defined in a spec, but
          // we prefer .scrollX because it is currently in a spec draft.
          // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
          var scrollX = ((typeof window.scrollX != 'undefined') ? window.scrollX : window.pageXOffset);
          var scrollY = ((typeof window.scrollY != 'undefined') ? window.scrollY : window.pageYOffset);
          // If this assert lands, it's likely because the browser doesn't support scrollX or pageXOffset
          // and we have no viable fallback.
          assert((typeof scrollX != 'undefined') && (typeof scrollY != 'undefined'), 'Unable to retrieve scroll position, mouse positions likely broken.');
  
          if (event.type === 'touchstart' || event.type === 'touchend' || event.type === 'touchmove') {
            var touch = event.touch;
            if (touch === undefined) {
              return; // the "touch" property is only defined in SDL
  
            }
            var adjustedX = touch.pageX - (scrollX + rect.left);
            var adjustedY = touch.pageY - (scrollY + rect.top);
  
            adjustedX = adjustedX * (cw / rect.width);
            adjustedY = adjustedY * (ch / rect.height);
  
            var coords = { x: adjustedX, y: adjustedY };
  
            if (event.type === 'touchstart') {
              Browser.lastTouches[touch.identifier] = coords;
              Browser.touches[touch.identifier] = coords;
            } else if (event.type === 'touchend' || event.type === 'touchmove') {
              var last = Browser.touches[touch.identifier];
              if (!last) last = coords;
              Browser.lastTouches[touch.identifier] = last;
              Browser.touches[touch.identifier] = coords;
            }
            return;
          }
  
          var x = event.pageX - (scrollX + rect.left);
          var y = event.pageY - (scrollY + rect.top);
  
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
  
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },resizeListeners:[],updateResizeListeners:function() {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach((listener) => listener(canvas.width, canvas.height));
      },setCanvasSize:function(width, height, noUpdates) {
        var canvas = Module['canvas'];
        Browser.updateCanvasDimensions(canvas, width, height);
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullscreenCanvasSize:function() {
        // check if SDL is available
        if (typeof SDL != "undefined") {
          var flags = HEAPU32[((SDL.screen)>>2)];
          flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
          HEAP32[((SDL.screen)>>2)] = flags;
        }
        Browser.updateCanvasDimensions(Module['canvas']);
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function() {
        // check if SDL is available
        if (typeof SDL != "undefined") {
          var flags = HEAPU32[((SDL.screen)>>2)];
          flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
          HEAP32[((SDL.screen)>>2)] = flags;
        }
        Browser.updateCanvasDimensions(Module['canvas']);
        Browser.updateResizeListeners();
      },updateCanvasDimensions:function(canvas, wNative, hNative) {
        if (wNative && hNative) {
          canvas.widthNative = wNative;
          canvas.heightNative = hNative;
        } else {
          wNative = canvas.widthNative;
          hNative = canvas.heightNative;
        }
        var w = wNative;
        var h = hNative;
        if (Module['forcedAspectRatio'] && Module['forcedAspectRatio'] > 0) {
          if (w/h < Module['forcedAspectRatio']) {
            w = Math.round(h * Module['forcedAspectRatio']);
          } else {
            h = Math.round(w / Module['forcedAspectRatio']);
          }
        }
        if (((document['fullscreenElement'] || document['mozFullScreenElement'] ||
             document['msFullscreenElement'] || document['webkitFullscreenElement'] ||
             document['webkitCurrentFullScreenElement']) === canvas.parentNode) && (typeof screen != 'undefined')) {
           var factor = Math.min(screen.width / w, screen.height / h);
           w = Math.round(w * factor);
           h = Math.round(h * factor);
        }
        if (Browser.resizeCanvas) {
          if (canvas.width  != w) canvas.width  = w;
          if (canvas.height != h) canvas.height = h;
          if (typeof canvas.style != 'undefined') {
            canvas.style.removeProperty( "width");
            canvas.style.removeProperty("height");
          }
        } else {
          if (canvas.width  != wNative) canvas.width  = wNative;
          if (canvas.height != hNative) canvas.height = hNative;
          if (typeof canvas.style != 'undefined') {
            if (w != wNative || h != hNative) {
              canvas.style.setProperty( "width", w + "px", "important");
              canvas.style.setProperty("height", h + "px", "important");
            } else {
              canvas.style.removeProperty( "width");
              canvas.style.removeProperty("height");
            }
          }
        }
      }};
  function _emscripten_set_main_loop_timing(mode, value) {
      Browser.mainLoop.timingMode = mode;
      Browser.mainLoop.timingValue = value;
  
      if (!Browser.mainLoop.func) {
        err('emscripten_set_main_loop_timing: Cannot set timing mode for main loop since a main loop does not exist! Call emscripten_set_main_loop first to set one up.');
        return 1; // Return non-zero on failure, can't set timing mode when there is no main loop.
      }
  
      if (!Browser.mainLoop.running) {
        
        Browser.mainLoop.running = true;
      }
      if (mode == 0) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setTimeout() {
          var timeUntilNextTick = Math.max(0, Browser.mainLoop.tickStartTime + value - _emscripten_get_now())|0;
          setTimeout(Browser.mainLoop.runner, timeUntilNextTick); // doing this each time means that on exception, we stop
        };
        Browser.mainLoop.method = 'timeout';
      } else if (mode == 1) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
          Browser.requestAnimationFrame(Browser.mainLoop.runner);
        };
        Browser.mainLoop.method = 'rAF';
      } else if (mode == 2) {
        if (typeof setImmediate == 'undefined') {
          // Emulate setImmediate. (note: not a complete polyfill, we don't emulate clearImmediate() to keep code size to minimum, since not needed)
          var setImmediates = [];
          var emscriptenMainLoopMessageId = 'setimmediate';
          /** @param {Event} event */
          var Browser_setImmediate_messageHandler = (event) => {
            // When called in current thread or Worker, the main loop ID is structured slightly different to accommodate for --proxy-to-worker runtime listening to Worker events,
            // so check for both cases.
            if (event.data === emscriptenMainLoopMessageId || event.data.target === emscriptenMainLoopMessageId) {
              event.stopPropagation();
              setImmediates.shift()();
            }
          };
          addEventListener("message", Browser_setImmediate_messageHandler, true);
          setImmediate = /** @type{function(function(): ?, ...?): number} */(function Browser_emulated_setImmediate(func) {
            setImmediates.push(func);
            if (ENVIRONMENT_IS_WORKER) {
              if (Module['setImmediates'] === undefined) Module['setImmediates'] = [];
              Module['setImmediates'].push(func);
              postMessage({target: emscriptenMainLoopMessageId}); // In --proxy-to-worker, route the message via proxyClient.js
            } else postMessage(emscriptenMainLoopMessageId, "*"); // On the main thread, can just send the message to itself.
          })
        }
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setImmediate() {
          setImmediate(Browser.mainLoop.runner);
        };
        Browser.mainLoop.method = 'immediate';
      }
      return 0;
    }
  
  
  
    /**
     * @param {number=} arg
     * @param {boolean=} noSetTiming
     */
  function setMainLoop(browserIterationFunc, fps, simulateInfiniteLoop, arg, noSetTiming) {
      assert(!Browser.mainLoop.func, 'emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.');
  
      Browser.mainLoop.func = browserIterationFunc;
      Browser.mainLoop.arg = arg;
  
      var thisMainLoopId = Browser.mainLoop.currentlyRunningMainloop;
      function checkIsRunning() {
        if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) {
          
          return false;
        }
        return true;
      }
  
      // We create the loop runner here but it is not actually running until
      // _emscripten_set_main_loop_timing is called (which might happen a
      // later time).  This member signifies that the current runner has not
      // yet been started so that we can call runtimeKeepalivePush when it
      // gets it timing set for the first time.
      Browser.mainLoop.running = false;
      Browser.mainLoop.runner = function Browser_mainLoop_runner() {
        if (ABORT) return;
        if (Browser.mainLoop.queue.length > 0) {
          var start = Date.now();
          var blocker = Browser.mainLoop.queue.shift();
          blocker.func(blocker.arg);
          if (Browser.mainLoop.remainingBlockers) {
            var remaining = Browser.mainLoop.remainingBlockers;
            var next = remaining%1 == 0 ? remaining-1 : Math.floor(remaining);
            if (blocker.counted) {
              Browser.mainLoop.remainingBlockers = next;
            } else {
              // not counted, but move the progress along a tiny bit
              next = next + 0.5; // do not steal all the next one's progress
              Browser.mainLoop.remainingBlockers = (8*remaining + next)/9;
            }
          }
          out('main loop blocker "' + blocker.name + '" took ' + (Date.now() - start) + ' ms'); //, left: ' + Browser.mainLoop.remainingBlockers);
          Browser.mainLoop.updateStatus();
  
          // catches pause/resume main loop from blocker execution
          if (!checkIsRunning()) return;
  
          setTimeout(Browser.mainLoop.runner, 0);
          return;
        }
  
        // catch pauses from non-main loop sources
        if (!checkIsRunning()) return;
  
        // Implement very basic swap interval control
        Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0;
        if (Browser.mainLoop.timingMode == 1 && Browser.mainLoop.timingValue > 1 && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0) {
          // Not the scheduled time to render this frame - skip.
          Browser.mainLoop.scheduler();
          return;
        } else if (Browser.mainLoop.timingMode == 0) {
          Browser.mainLoop.tickStartTime = _emscripten_get_now();
        }
  
        // Signal GL rendering layer that processing of a new frame is about to start. This helps it optimize
        // VBO double-buffering and reduce GPU stalls.
  
        if (Browser.mainLoop.method === 'timeout' && Module.ctx) {
          warnOnce('Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!');
          Browser.mainLoop.method = ''; // just warn once per call to set main loop
        }
  
        Browser.mainLoop.runIter(browserIterationFunc);
  
        checkStackCookie();
  
        // catch pauses from the main loop itself
        if (!checkIsRunning()) return;
  
        // Queue new audio data. This is important to be right after the main loop invocation, so that we will immediately be able
        // to queue the newest produced audio samples.
        // TODO: Consider adding pre- and post- rAF callbacks so that GL.newRenderingFrameStarted() and SDL.audio.queueNewAudioData()
        //       do not need to be hardcoded into this function, but can be more generic.
        if (typeof SDL == 'object' && SDL.audio && SDL.audio.queueNewAudioData) SDL.audio.queueNewAudioData();
  
        Browser.mainLoop.scheduler();
      }
  
      if (!noSetTiming) {
        if (fps && fps > 0) {
          _emscripten_set_main_loop_timing(0, 1000.0 / fps);
        } else {
          // Do rAF by rendering each frame (no decimating)
          _emscripten_set_main_loop_timing(1, 1);
        }
  
        Browser.mainLoop.scheduler();
      }
  
      if (simulateInfiniteLoop) {
        throw 'unwind';
      }
    }
  
  
  var wasmTableMirror = [];
  var getWasmTableEntry = (funcPtr) => {
      var func = wasmTableMirror[funcPtr];
      if (!func) {
        if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
        wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
      }
      assert(wasmTable.get(funcPtr) == func, "JavaScript-side Wasm function table mirror is out of date!");
      return func;
    };
  function _emscripten_set_main_loop(func, fps, simulateInfiniteLoop) {
      var browserIterationFunc = getWasmTableEntry(func);
      setMainLoop(browserIterationFunc, fps, simulateInfiniteLoop);
    }

  var ENV = {};
  
  var getExecutableName = () => {
      return thisProgram || './this.program';
    };
  var getEnvStrings = () => {
      if (!getEnvStrings.strings) {
        // Default values.
        // Browser language detection #8751
        var lang = ((typeof navigator == 'object' && navigator.languages && navigator.languages[0]) || 'C').replace('-', '_') + '.UTF-8';
        var env = {
          'USER': 'web_user',
          'LOGNAME': 'web_user',
          'PATH': '/',
          'PWD': '/',
          'HOME': '/home/web_user',
          'LANG': lang,
          '_': getExecutableName()
        };
        // Apply the user-provided values, if any.
        for (var x in ENV) {
          // x is a key in ENV; if ENV[x] is undefined, that means it was
          // explicitly set to be so. We allow user code to do that to
          // force variables with default values to remain unset.
          if (ENV[x] === undefined) delete env[x];
          else env[x] = ENV[x];
        }
        var strings = [];
        for (var x in env) {
          strings.push(`${x}=${env[x]}`);
        }
        getEnvStrings.strings = strings;
      }
      return getEnvStrings.strings;
    };
  
  var stringToAscii = (str, buffer) => {
      for (var i = 0; i < str.length; ++i) {
        assert(str.charCodeAt(i) === (str.charCodeAt(i) & 0xff));
        HEAP8[((buffer++)>>0)] = str.charCodeAt(i);
      }
      // Null-terminate the string
      HEAP8[((buffer)>>0)] = 0;
    };
  
  var _environ_get = (__environ, environ_buf) => {
      var bufSize = 0;
      getEnvStrings().forEach(function(string, i) {
        var ptr = environ_buf + bufSize;
        HEAPU32[(((__environ)+(i*4))>>2)] = ptr;
        stringToAscii(string, ptr);
        bufSize += string.length + 1;
      });
      return 0;
    };

  
  var _environ_sizes_get = (penviron_count, penviron_buf_size) => {
      var strings = getEnvStrings();
      HEAPU32[((penviron_count)>>2)] = strings.length;
      var bufSize = 0;
      strings.forEach(function(string) {
        bufSize += string.length + 1;
      });
      HEAPU32[((penviron_buf_size)>>2)] = bufSize;
      return 0;
    };

  function _fd_close(fd) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.close(stream);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  }

  /** @param {number=} offset */
  var doReadv = (stream, iov, iovcnt, offset) => {
      var ret = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[((iov)>>2)];
        var len = HEAPU32[(((iov)+(4))>>2)];
        iov += 8;
        var curr = FS.read(stream, HEAP8,ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
        if (curr < len) break; // nothing more to read
        if (typeof offset !== 'undefined') {
          offset += curr;
        }
      }
      return ret;
    };
  
  function _fd_read(fd, iov, iovcnt, pnum) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = doReadv(stream, iov, iovcnt);
      HEAPU32[((pnum)>>2)] = num;
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  }

  function convertI32PairToI53Checked(lo, hi) {
      assert(lo == (lo >>> 0) || lo == (lo|0)); // lo should either be a i32 or a u32
      assert(hi === (hi|0));                    // hi should be a i32
      return ((hi + 0x200000) >>> 0 < 0x400001 - !!lo) ? (lo >>> 0) + hi * 4294967296 : NaN;
    }
  
  
  
  
  
  function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
  try {
  
      var offset = convertI32PairToI53Checked(offset_low, offset_high); if (isNaN(offset)) return 61;
      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.llseek(stream, offset, whence);
      (tempI64 = [stream.position>>>0,(tempDouble=stream.position,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[((newOffset)>>2)] = tempI64[0],HEAP32[(((newOffset)+(4))>>2)] = tempI64[1]);
      if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null; // reset readdir state
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  }

  /** @param {number=} offset */
  var doWritev = (stream, iov, iovcnt, offset) => {
      var ret = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[((iov)>>2)];
        var len = HEAPU32[(((iov)+(4))>>2)];
        iov += 8;
        var curr = FS.write(stream, HEAP8,ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
        if (typeof offset !== 'undefined') {
          offset += curr;
        }
      }
      return ret;
    };
  
  function _fd_write(fd, iov, iovcnt, pnum) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = doWritev(stream, iov, iovcnt);
      HEAPU32[((pnum)>>2)] = num;
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  }

  var isLeapYear = (year) => {
        return year%4 === 0 && (year%100 !== 0 || year%400 === 0);
    };
  
  var arraySum = (array, index) => {
      var sum = 0;
      for (var i = 0; i <= index; sum += array[i++]) {
        // no-op
      }
      return sum;
    };
  
  
  var MONTH_DAYS_LEAP = [31,29,31,30,31,30,31,31,30,31,30,31];
  
  var MONTH_DAYS_REGULAR = [31,28,31,30,31,30,31,31,30,31,30,31];
  var addDays = (date, days) => {
      var newDate = new Date(date.getTime());
      while (days > 0) {
        var leap = isLeapYear(newDate.getFullYear());
        var currentMonth = newDate.getMonth();
        var daysInCurrentMonth = (leap ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR)[currentMonth];
  
        if (days > daysInCurrentMonth-newDate.getDate()) {
          // we spill over to next month
          days -= (daysInCurrentMonth-newDate.getDate()+1);
          newDate.setDate(1);
          if (currentMonth < 11) {
            newDate.setMonth(currentMonth+1)
          } else {
            newDate.setMonth(0);
            newDate.setFullYear(newDate.getFullYear()+1);
          }
        } else {
          // we stay in current month
          newDate.setDate(newDate.getDate()+days);
          return newDate;
        }
      }
  
      return newDate;
    };
  
  
  
  
  var writeArrayToMemory = (array, buffer) => {
      assert(array.length >= 0, 'writeArrayToMemory array must have a length (should be an array or typed array)')
      HEAP8.set(array, buffer);
    };
  
  var _strftime = (s, maxsize, format, tm) => {
      // size_t strftime(char *restrict s, size_t maxsize, const char *restrict format, const struct tm *restrict timeptr);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/strftime.html
  
      var tm_zone = HEAP32[(((tm)+(40))>>2)];
  
      var date = {
        tm_sec: HEAP32[((tm)>>2)],
        tm_min: HEAP32[(((tm)+(4))>>2)],
        tm_hour: HEAP32[(((tm)+(8))>>2)],
        tm_mday: HEAP32[(((tm)+(12))>>2)],
        tm_mon: HEAP32[(((tm)+(16))>>2)],
        tm_year: HEAP32[(((tm)+(20))>>2)],
        tm_wday: HEAP32[(((tm)+(24))>>2)],
        tm_yday: HEAP32[(((tm)+(28))>>2)],
        tm_isdst: HEAP32[(((tm)+(32))>>2)],
        tm_gmtoff: HEAP32[(((tm)+(36))>>2)],
        tm_zone: tm_zone ? UTF8ToString(tm_zone) : ''
      };
  
      var pattern = UTF8ToString(format);
  
      // expand format
      var EXPANSION_RULES_1 = {
        '%c': '%a %b %d %H:%M:%S %Y',     // Replaced by the locale's appropriate date and time representation - e.g., Mon Aug  3 14:02:01 2013
        '%D': '%m/%d/%y',                 // Equivalent to %m / %d / %y
        '%F': '%Y-%m-%d',                 // Equivalent to %Y - %m - %d
        '%h': '%b',                       // Equivalent to %b
        '%r': '%I:%M:%S %p',              // Replaced by the time in a.m. and p.m. notation
        '%R': '%H:%M',                    // Replaced by the time in 24-hour notation
        '%T': '%H:%M:%S',                 // Replaced by the time
        '%x': '%m/%d/%y',                 // Replaced by the locale's appropriate date representation
        '%X': '%H:%M:%S',                 // Replaced by the locale's appropriate time representation
        // Modified Conversion Specifiers
        '%Ec': '%c',                      // Replaced by the locale's alternative appropriate date and time representation.
        '%EC': '%C',                      // Replaced by the name of the base year (period) in the locale's alternative representation.
        '%Ex': '%m/%d/%y',                // Replaced by the locale's alternative date representation.
        '%EX': '%H:%M:%S',                // Replaced by the locale's alternative time representation.
        '%Ey': '%y',                      // Replaced by the offset from %EC (year only) in the locale's alternative representation.
        '%EY': '%Y',                      // Replaced by the full alternative year representation.
        '%Od': '%d',                      // Replaced by the day of the month, using the locale's alternative numeric symbols, filled as needed with leading zeros if there is any alternative symbol for zero; otherwise, with leading <space> characters.
        '%Oe': '%e',                      // Replaced by the day of the month, using the locale's alternative numeric symbols, filled as needed with leading <space> characters.
        '%OH': '%H',                      // Replaced by the hour (24-hour clock) using the locale's alternative numeric symbols.
        '%OI': '%I',                      // Replaced by the hour (12-hour clock) using the locale's alternative numeric symbols.
        '%Om': '%m',                      // Replaced by the month using the locale's alternative numeric symbols.
        '%OM': '%M',                      // Replaced by the minutes using the locale's alternative numeric symbols.
        '%OS': '%S',                      // Replaced by the seconds using the locale's alternative numeric symbols.
        '%Ou': '%u',                      // Replaced by the weekday as a number in the locale's alternative representation (Monday=1).
        '%OU': '%U',                      // Replaced by the week number of the year (Sunday as the first day of the week, rules corresponding to %U ) using the locale's alternative numeric symbols.
        '%OV': '%V',                      // Replaced by the week number of the year (Monday as the first day of the week, rules corresponding to %V ) using the locale's alternative numeric symbols.
        '%Ow': '%w',                      // Replaced by the number of the weekday (Sunday=0) using the locale's alternative numeric symbols.
        '%OW': '%W',                      // Replaced by the week number of the year (Monday as the first day of the week) using the locale's alternative numeric symbols.
        '%Oy': '%y',                      // Replaced by the year (offset from %C ) using the locale's alternative numeric symbols.
      };
      for (var rule in EXPANSION_RULES_1) {
        pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_1[rule]);
      }
  
      var WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
      function leadingSomething(value, digits, character) {
        var str = typeof value == 'number' ? value.toString() : (value || '');
        while (str.length < digits) {
          str = character[0]+str;
        }
        return str;
      }
  
      function leadingNulls(value, digits) {
        return leadingSomething(value, digits, '0');
      }
  
      function compareByDay(date1, date2) {
        function sgn(value) {
          return value < 0 ? -1 : (value > 0 ? 1 : 0);
        }
  
        var compare;
        if ((compare = sgn(date1.getFullYear()-date2.getFullYear())) === 0) {
          if ((compare = sgn(date1.getMonth()-date2.getMonth())) === 0) {
            compare = sgn(date1.getDate()-date2.getDate());
          }
        }
        return compare;
      }
  
      function getFirstWeekStartDate(janFourth) {
          switch (janFourth.getDay()) {
            case 0: // Sunday
              return new Date(janFourth.getFullYear()-1, 11, 29);
            case 1: // Monday
              return janFourth;
            case 2: // Tuesday
              return new Date(janFourth.getFullYear(), 0, 3);
            case 3: // Wednesday
              return new Date(janFourth.getFullYear(), 0, 2);
            case 4: // Thursday
              return new Date(janFourth.getFullYear(), 0, 1);
            case 5: // Friday
              return new Date(janFourth.getFullYear()-1, 11, 31);
            case 6: // Saturday
              return new Date(janFourth.getFullYear()-1, 11, 30);
          }
      }
  
      function getWeekBasedYear(date) {
          var thisDate = addDays(new Date(date.tm_year+1900, 0, 1), date.tm_yday);
  
          var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
          var janFourthNextYear = new Date(thisDate.getFullYear()+1, 0, 4);
  
          var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
          var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
  
          if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
            // this date is after the start of the first week of this year
            if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
              return thisDate.getFullYear()+1;
            }
            return thisDate.getFullYear();
          }
          return thisDate.getFullYear()-1;
      }
  
      var EXPANSION_RULES_2 = {
        '%a': (date) => WEEKDAYS[date.tm_wday].substring(0,3) ,
        '%A': (date) => WEEKDAYS[date.tm_wday],
        '%b': (date) => MONTHS[date.tm_mon].substring(0,3),
        '%B': (date) => MONTHS[date.tm_mon],
        '%C': (date) => {
          var year = date.tm_year+1900;
          return leadingNulls((year/100)|0,2);
        },
        '%d': (date) => leadingNulls(date.tm_mday, 2),
        '%e': (date) => leadingSomething(date.tm_mday, 2, ' '),
        '%g': (date) => {
          // %g, %G, and %V give values according to the ISO 8601:2000 standard week-based year.
          // In this system, weeks begin on a Monday and week 1 of the year is the week that includes
          // January 4th, which is also the week that includes the first Thursday of the year, and
          // is also the first week that contains at least four days in the year.
          // If the first Monday of January is the 2nd, 3rd, or 4th, the preceding days are part of
          // the last week of the preceding year; thus, for Saturday 2nd January 1999,
          // %G is replaced by 1998 and %V is replaced by 53. If December 29th, 30th,
          // or 31st is a Monday, it and any following days are part of week 1 of the following year.
          // Thus, for Tuesday 30th December 1997, %G is replaced by 1998 and %V is replaced by 01.
  
          return getWeekBasedYear(date).toString().substring(2);
        },
        '%G': (date) => getWeekBasedYear(date),
        '%H': (date) => leadingNulls(date.tm_hour, 2),
        '%I': (date) => {
          var twelveHour = date.tm_hour;
          if (twelveHour == 0) twelveHour = 12;
          else if (twelveHour > 12) twelveHour -= 12;
          return leadingNulls(twelveHour, 2);
        },
        '%j': (date) => {
          // Day of the year (001-366)
          return leadingNulls(date.tm_mday + arraySum(isLeapYear(date.tm_year+1900) ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR, date.tm_mon-1), 3);
        },
        '%m': (date) => leadingNulls(date.tm_mon+1, 2),
        '%M': (date) => leadingNulls(date.tm_min, 2),
        '%n': () => '\n',
        '%p': (date) => {
          if (date.tm_hour >= 0 && date.tm_hour < 12) {
            return 'AM';
          }
          return 'PM';
        },
        '%S': (date) => leadingNulls(date.tm_sec, 2),
        '%t': () => '\t',
        '%u': (date) => date.tm_wday || 7,
        '%U': (date) => {
          var days = date.tm_yday + 7 - date.tm_wday;
          return leadingNulls(Math.floor(days / 7), 2);
        },
        '%V': (date) => {
          // Replaced by the week number of the year (Monday as the first day of the week)
          // as a decimal number [01,53]. If the week containing 1 January has four
          // or more days in the new year, then it is considered week 1.
          // Otherwise, it is the last week of the previous year, and the next week is week 1.
          // Both January 4th and the first Thursday of January are always in week 1. [ tm_year, tm_wday, tm_yday]
          var val = Math.floor((date.tm_yday + 7 - (date.tm_wday + 6) % 7 ) / 7);
          // If 1 Jan is just 1-3 days past Monday, the previous week
          // is also in this year.
          if ((date.tm_wday + 371 - date.tm_yday - 2) % 7 <= 2) {
            val++;
          }
          if (!val) {
            val = 52;
            // If 31 December of prev year a Thursday, or Friday of a
            // leap year, then the prev year has 53 weeks.
            var dec31 = (date.tm_wday + 7 - date.tm_yday - 1) % 7;
            if (dec31 == 4 || (dec31 == 5 && isLeapYear(date.tm_year%400-1))) {
              val++;
            }
          } else if (val == 53) {
            // If 1 January is not a Thursday, and not a Wednesday of a
            // leap year, then this year has only 52 weeks.
            var jan1 = (date.tm_wday + 371 - date.tm_yday) % 7;
            if (jan1 != 4 && (jan1 != 3 || !isLeapYear(date.tm_year)))
              val = 1;
          }
          return leadingNulls(val, 2);
        },
        '%w': (date) => date.tm_wday,
        '%W': (date) => {
          var days = date.tm_yday + 7 - ((date.tm_wday + 6) % 7);
          return leadingNulls(Math.floor(days / 7), 2);
        },
        '%y': (date) => {
          // Replaced by the last two digits of the year as a decimal number [00,99]. [ tm_year]
          return (date.tm_year+1900).toString().substring(2);
        },
        // Replaced by the year as a decimal number (for example, 1997). [ tm_year]
        '%Y': (date) => date.tm_year+1900,
        '%z': (date) => {
          // Replaced by the offset from UTC in the ISO 8601:2000 standard format ( +hhmm or -hhmm ).
          // For example, "-0430" means 4 hours 30 minutes behind UTC (west of Greenwich).
          var off = date.tm_gmtoff;
          var ahead = off >= 0;
          off = Math.abs(off) / 60;
          // convert from minutes into hhmm format (which means 60 minutes = 100 units)
          off = (off / 60)*100 + (off % 60);
          return (ahead ? '+' : '-') + String("0000" + off).slice(-4);
        },
        '%Z': (date) => date.tm_zone,
        '%%': () => '%'
      };
  
      // Replace %% with a pair of NULLs (which cannot occur in a C string), then
      // re-inject them after processing.
      pattern = pattern.replace(/%%/g, '\0\0')
      for (var rule in EXPANSION_RULES_2) {
        if (pattern.includes(rule)) {
          pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_2[rule](date));
        }
      }
      pattern = pattern.replace(/\0\0/g, '%')
  
      var bytes = intArrayFromString(pattern, false);
      if (bytes.length > maxsize) {
        return 0;
      }
  
      writeArrayToMemory(bytes, s);
      return bytes.length-1;
    };
  var _strftime_l = (s, maxsize, format, tm, loc) => {
      return _strftime(s, maxsize, format, tm); // no locale support yet
    };



  
  var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
      assert(typeof maxBytesToWrite == 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
      return stringToUTF8Array(str, HEAPU8,outPtr, maxBytesToWrite);
    };
  var stringToUTF8OnStack = (str) => {
      var size = lengthBytesUTF8(str) + 1;
      var ret = stackAlloc(size);
      stringToUTF8(str, ret, size);
      return ret;
    };

  function getCFunc(ident) {
      var func = Module['_' + ident]; // closure exported function
      assert(func, 'Cannot call unknown function ' + ident + ', make sure it is exported');
      return func;
    }
  
  
  
  
    /**
     * @param {string|null=} returnType
     * @param {Array=} argTypes
     * @param {Arguments|Array=} args
     * @param {Object=} opts
     */
  var ccall = function(ident, returnType, argTypes, args, opts) {
      // For fast lookup of conversion functions
      var toC = {
        'string': (str) => {
          var ret = 0;
          if (str !== null && str !== undefined && str !== 0) { // null string
            // at most 4 bytes per UTF-8 code point, +1 for the trailing '\0'
            ret = stringToUTF8OnStack(str);
          }
          return ret;
        },
        'array': (arr) => {
          var ret = stackAlloc(arr.length);
          writeArrayToMemory(arr, ret);
          return ret;
        }
      };
  
      function convertReturnValue(ret) {
        if (returnType === 'string') {
          
          return UTF8ToString(ret);
        }
        if (returnType === 'boolean') return Boolean(ret);
        return ret;
      }
  
      var func = getCFunc(ident);
      var cArgs = [];
      var stack = 0;
      assert(returnType !== 'array', 'Return type should not be "array".');
      if (args) {
        for (var i = 0; i < args.length; i++) {
          var converter = toC[argTypes[i]];
          if (converter) {
            if (stack === 0) stack = stackSave();
            cArgs[i] = converter(args[i]);
          } else {
            cArgs[i] = args[i];
          }
        }
      }
      var ret = func.apply(null, cArgs);
      function onDone(ret) {
        if (stack !== 0) stackRestore(stack);
        return convertReturnValue(ret);
      }
  
      ret = onDone(ret);
      return ret;
    };

      // exports
      Module["requestFullscreen"] = function Module_requestFullscreen(lockPointer, resizeCanvas) { Browser.requestFullscreen(lockPointer, resizeCanvas) };
      Module["requestFullScreen"] = function Module_requestFullScreen() { Browser.requestFullScreen() };
      Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) { Browser.requestAnimationFrame(func) };
      Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) { Browser.setCanvasSize(width, height, noUpdates) };
      Module["pauseMainLoop"] = function Module_pauseMainLoop() { Browser.mainLoop.pause() };
      Module["resumeMainLoop"] = function Module_resumeMainLoop() { Browser.mainLoop.resume() };
      Module["getUserMedia"] = function Module_getUserMedia() { Browser.getUserMedia() };
      Module["createContext"] = function Module_createContext(canvas, useWebGL, setInModule, webGLContextAttributes) { return Browser.createContext(canvas, useWebGL, setInModule, webGLContextAttributes) };
      var preloadedImages = {};
      var preloadedAudios = {};;

  var FSNode = /** @constructor */ function(parent, name, mode, rdev) {
    if (!parent) {
      parent = this;  // root node sets parent to itself
    }
    this.parent = parent;
    this.mount = parent.mount;
    this.mounted = null;
    this.id = FS.nextInode++;
    this.name = name;
    this.mode = mode;
    this.node_ops = {};
    this.stream_ops = {};
    this.rdev = rdev;
  };
  var readMode = 292/*292*/ | 73/*73*/;
  var writeMode = 146/*146*/;
  Object.defineProperties(FSNode.prototype, {
   read: {
    get: /** @this{FSNode} */function() {
     return (this.mode & readMode) === readMode;
    },
    set: /** @this{FSNode} */function(val) {
     val ? this.mode |= readMode : this.mode &= ~readMode;
    }
   },
   write: {
    get: /** @this{FSNode} */function() {
     return (this.mode & writeMode) === writeMode;
    },
    set: /** @this{FSNode} */function(val) {
     val ? this.mode |= writeMode : this.mode &= ~writeMode;
    }
   },
   isFolder: {
    get: /** @this{FSNode} */function() {
     return FS.isDir(this.mode);
    }
   },
   isDevice: {
    get: /** @this{FSNode} */function() {
     return FS.isChrdev(this.mode);
    }
   }
  });
  FS.FSNode = FSNode;
  FS.createPreloadedFile = FS_createPreloadedFile;
  FS.staticInit();;
ERRNO_CODES = {
      'EPERM': 63,
      'ENOENT': 44,
      'ESRCH': 71,
      'EINTR': 27,
      'EIO': 29,
      'ENXIO': 60,
      'E2BIG': 1,
      'ENOEXEC': 45,
      'EBADF': 8,
      'ECHILD': 12,
      'EAGAIN': 6,
      'EWOULDBLOCK': 6,
      'ENOMEM': 48,
      'EACCES': 2,
      'EFAULT': 21,
      'ENOTBLK': 105,
      'EBUSY': 10,
      'EEXIST': 20,
      'EXDEV': 75,
      'ENODEV': 43,
      'ENOTDIR': 54,
      'EISDIR': 31,
      'EINVAL': 28,
      'ENFILE': 41,
      'EMFILE': 33,
      'ENOTTY': 59,
      'ETXTBSY': 74,
      'EFBIG': 22,
      'ENOSPC': 51,
      'ESPIPE': 70,
      'EROFS': 69,
      'EMLINK': 34,
      'EPIPE': 64,
      'EDOM': 18,
      'ERANGE': 68,
      'ENOMSG': 49,
      'EIDRM': 24,
      'ECHRNG': 106,
      'EL2NSYNC': 156,
      'EL3HLT': 107,
      'EL3RST': 108,
      'ELNRNG': 109,
      'EUNATCH': 110,
      'ENOCSI': 111,
      'EL2HLT': 112,
      'EDEADLK': 16,
      'ENOLCK': 46,
      'EBADE': 113,
      'EBADR': 114,
      'EXFULL': 115,
      'ENOANO': 104,
      'EBADRQC': 103,
      'EBADSLT': 102,
      'EDEADLOCK': 16,
      'EBFONT': 101,
      'ENOSTR': 100,
      'ENODATA': 116,
      'ETIME': 117,
      'ENOSR': 118,
      'ENONET': 119,
      'ENOPKG': 120,
      'EREMOTE': 121,
      'ENOLINK': 47,
      'EADV': 122,
      'ESRMNT': 123,
      'ECOMM': 124,
      'EPROTO': 65,
      'EMULTIHOP': 36,
      'EDOTDOT': 125,
      'EBADMSG': 9,
      'ENOTUNIQ': 126,
      'EBADFD': 127,
      'EREMCHG': 128,
      'ELIBACC': 129,
      'ELIBBAD': 130,
      'ELIBSCN': 131,
      'ELIBMAX': 132,
      'ELIBEXEC': 133,
      'ENOSYS': 52,
      'ENOTEMPTY': 55,
      'ENAMETOOLONG': 37,
      'ELOOP': 32,
      'EOPNOTSUPP': 138,
      'EPFNOSUPPORT': 139,
      'ECONNRESET': 15,
      'ENOBUFS': 42,
      'EAFNOSUPPORT': 5,
      'EPROTOTYPE': 67,
      'ENOTSOCK': 57,
      'ENOPROTOOPT': 50,
      'ESHUTDOWN': 140,
      'ECONNREFUSED': 14,
      'EADDRINUSE': 3,
      'ECONNABORTED': 13,
      'ENETUNREACH': 40,
      'ENETDOWN': 38,
      'ETIMEDOUT': 73,
      'EHOSTDOWN': 142,
      'EHOSTUNREACH': 23,
      'EINPROGRESS': 26,
      'EALREADY': 7,
      'EDESTADDRREQ': 17,
      'EMSGSIZE': 35,
      'EPROTONOSUPPORT': 66,
      'ESOCKTNOSUPPORT': 137,
      'EADDRNOTAVAIL': 4,
      'ENETRESET': 39,
      'EISCONN': 30,
      'ENOTCONN': 53,
      'ETOOMANYREFS': 141,
      'EUSERS': 136,
      'EDQUOT': 19,
      'ESTALE': 72,
      'ENOTSUP': 138,
      'ENOMEDIUM': 148,
      'EILSEQ': 25,
      'EOVERFLOW': 61,
      'ECANCELED': 11,
      'ENOTRECOVERABLE': 56,
      'EOWNERDEAD': 62,
      'ESTRPIPE': 135,
    };;
function checkIncomingModuleAPI() {
  ignoredModuleProp('fetchSettings');
}
var wasmImports = {
  "__cxa_throw": ___cxa_throw,
  "_emscripten_get_now_is_monotonic": __emscripten_get_now_is_monotonic,
  "abort": _abort,
  "emscripten_date_now": _emscripten_date_now,
  "emscripten_get_now": _emscripten_get_now,
  "emscripten_memcpy_big": _emscripten_memcpy_big,
  "emscripten_resize_heap": _emscripten_resize_heap,
  "emscripten_set_main_loop": _emscripten_set_main_loop,
  "environ_get": _environ_get,
  "environ_sizes_get": _environ_sizes_get,
  "fd_close": _fd_close,
  "fd_read": _fd_read,
  "fd_seek": _fd_seek,
  "fd_write": _fd_write,
  "strftime_l": _strftime_l
};
var asm = createWasm();
/** @type {function(...*):?} */
var ___wasm_call_ctors = createExportWrapper("__wasm_call_ctors");
/** @type {function(...*):?} */
var _main = Module["_main"] = createExportWrapper("__main_argc_argv");
/** @type {function(...*):?} */
var _init_engine = Module["_init_engine"] = createExportWrapper("init_engine");
/** @type {function(...*):?} */
var _stop_engine = Module["_stop_engine"] = createExportWrapper("stop_engine");
/** @type {function(...*):?} */
var _pause_engine = Module["_pause_engine"] = createExportWrapper("pause_engine");
/** @type {function(...*):?} */
var _play_engine = Module["_play_engine"] = createExportWrapper("play_engine");
/** @type {function(...*):?} */
var _get_current_state = Module["_get_current_state"] = createExportWrapper("get_current_state");
/** @type {function(...*):?} */
var _get_current_framerate = Module["_get_current_framerate"] = createExportWrapper("get_current_framerate");
/** @type {function(...*):?} */
var ___errno_location = createExportWrapper("__errno_location");
/** @type {function(...*):?} */
var _fflush = Module["_fflush"] = createExportWrapper("fflush");
/** @type {function(...*):?} */
var _emscripten_stack_init = function() {
  return (_emscripten_stack_init = Module["asm"]["emscripten_stack_init"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_stack_get_free = function() {
  return (_emscripten_stack_get_free = Module["asm"]["emscripten_stack_get_free"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_stack_get_base = function() {
  return (_emscripten_stack_get_base = Module["asm"]["emscripten_stack_get_base"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_stack_get_end = function() {
  return (_emscripten_stack_get_end = Module["asm"]["emscripten_stack_get_end"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var stackSave = createExportWrapper("stackSave");
/** @type {function(...*):?} */
var stackRestore = createExportWrapper("stackRestore");
/** @type {function(...*):?} */
var stackAlloc = createExportWrapper("stackAlloc");
/** @type {function(...*):?} */
var _emscripten_stack_get_current = function() {
  return (_emscripten_stack_get_current = Module["asm"]["emscripten_stack_get_current"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___cxa_is_pointer_type = createExportWrapper("__cxa_is_pointer_type");
/** @type {function(...*):?} */
var dynCall_viijii = Module["dynCall_viijii"] = createExportWrapper("dynCall_viijii");
/** @type {function(...*):?} */
var dynCall_jiji = Module["dynCall_jiji"] = createExportWrapper("dynCall_jiji");
/** @type {function(...*):?} */
var dynCall_iiiiij = Module["dynCall_iiiiij"] = createExportWrapper("dynCall_iiiiij");
/** @type {function(...*):?} */
var dynCall_iiiiijj = Module["dynCall_iiiiijj"] = createExportWrapper("dynCall_iiiiijj");
/** @type {function(...*):?} */
var dynCall_iiiiiijj = Module["dynCall_iiiiiijj"] = createExportWrapper("dynCall_iiiiiijj");


// include: postamble.js
// === Auto-generated postamble setup entry stuff ===

// include: base64Utils.js
// Converts a string of base64 into a byte array.
// Throws error on invalid input.
function intArrayFromBase64(s) {
  if (typeof ENVIRONMENT_IS_NODE != 'undefined' && ENVIRONMENT_IS_NODE) {
    var buf = Buffer.from(s, 'base64');
    return new Uint8Array(buf['buffer'], buf['byteOffset'], buf['byteLength']);
  }

  try {
    var decoded = atob(s);
    var bytes = new Uint8Array(decoded.length);
    for (var i = 0 ; i < decoded.length ; ++i) {
      bytes[i] = decoded.charCodeAt(i);
    }
    return bytes;
  } catch (_) {
    throw new Error('Converting base64 string to bytes failed.');
  }
}

// If filename is a base64 data URI, parses and returns data (Buffer on node,
// Uint8Array otherwise). If filename is not a base64 data URI, returns undefined.
function tryParseAsDataURI(filename) {
  if (!isDataURI(filename)) {
    return;
  }

  return intArrayFromBase64(filename.slice(dataURIPrefix.length));
}
// end include: base64Utils.js
Module["ccall"] = ccall;
var missingLibrarySymbols = [
  'growMemory',
  'ydayFromDate',
  'setErrNo',
  'inetPton4',
  'inetNtop4',
  'inetPton6',
  'inetNtop6',
  'readSockaddr',
  'writeSockaddr',
  'getHostByName',
  'traverseStack',
  'getCallstack',
  'emscriptenLog',
  'convertPCtoSourceLocation',
  'readEmAsmArgs',
  'jstoi_q',
  'jstoi_s',
  'listenOnce',
  'autoResumeAudioContext',
  'dynCallLegacy',
  'getDynCaller',
  'dynCall',
  'runtimeKeepalivePush',
  'runtimeKeepalivePop',
  'asmjsMangle',
  'HandleAllocator',
  'getNativeTypeSize',
  'STACK_SIZE',
  'STACK_ALIGN',
  'POINTER_SIZE',
  'ASSERTIONS',
  'writeI53ToI64',
  'writeI53ToI64Clamped',
  'writeI53ToI64Signaling',
  'writeI53ToU64Clamped',
  'writeI53ToU64Signaling',
  'readI53FromI64',
  'readI53FromU64',
  'convertI32PairToI53',
  'convertU32PairToI53',
  'cwrap',
  'uleb128Encode',
  'sigToWasmTypes',
  'generateFuncType',
  'convertJsFunctionToWasm',
  'getEmptyTableSlot',
  'updateTableMap',
  'getFunctionAddress',
  'addFunction',
  'removeFunction',
  'reallyNegative',
  'unSign',
  'strLen',
  'reSign',
  'formatString',
  'AsciiToString',
  'UTF16ToString',
  'stringToUTF16',
  'lengthBytesUTF16',
  'UTF32ToString',
  'stringToUTF32',
  'lengthBytesUTF32',
  'stringToNewUTF8',
  'registerKeyEventCallback',
  'maybeCStringToJsString',
  'findEventTarget',
  'findCanvasEventTarget',
  'getBoundingClientRect',
  'fillMouseEventData',
  'registerMouseEventCallback',
  'registerWheelEventCallback',
  'registerUiEventCallback',
  'registerFocusEventCallback',
  'fillDeviceOrientationEventData',
  'registerDeviceOrientationEventCallback',
  'fillDeviceMotionEventData',
  'registerDeviceMotionEventCallback',
  'screenOrientation',
  'fillOrientationChangeEventData',
  'registerOrientationChangeEventCallback',
  'fillFullscreenChangeEventData',
  'registerFullscreenChangeEventCallback',
  'JSEvents_requestFullscreen',
  'JSEvents_resizeCanvasForFullscreen',
  'registerRestoreOldStyle',
  'hideEverythingExceptGivenElement',
  'restoreHiddenElements',
  'setLetterbox',
  'softFullscreenResizeWebGLRenderTarget',
  'doRequestFullscreen',
  'fillPointerlockChangeEventData',
  'registerPointerlockChangeEventCallback',
  'registerPointerlockErrorEventCallback',
  'requestPointerLock',
  'fillVisibilityChangeEventData',
  'registerVisibilityChangeEventCallback',
  'registerTouchEventCallback',
  'fillGamepadEventData',
  'registerGamepadEventCallback',
  'registerBeforeUnloadEventCallback',
  'fillBatteryEventData',
  'battery',
  'registerBatteryEventCallback',
  'setCanvasElementSize',
  'getCanvasElementSize',
  'jsStackTrace',
  'stackTrace',
  'checkWasiClock',
  'wasiRightsToMuslOFlags',
  'wasiOFlagsToMuslOFlags',
  'createDyncallWrapper',
  'setImmediateWrapped',
  'clearImmediateWrapped',
  'polyfillSetImmediate',
  'getPromise',
  'makePromise',
  'idsToPromises',
  'makePromiseCallback',
  'getSocketFromFD',
  'getSocketAddress',
  '_setNetworkCallback',
  'heapObjectForWebGLType',
  'heapAccessShiftForWebGLHeap',
  'webgl_enable_ANGLE_instanced_arrays',
  'webgl_enable_OES_vertex_array_object',
  'webgl_enable_WEBGL_draw_buffers',
  'webgl_enable_WEBGL_multi_draw',
  'emscriptenWebGLGet',
  'computeUnpackAlignedImageSize',
  'colorChannelsInGlTextureFormat',
  'emscriptenWebGLGetTexPixelData',
  '__glGenObject',
  'emscriptenWebGLGetUniform',
  'webglGetUniformLocation',
  'webglPrepareUniformLocationsBeforeFirstUse',
  'webglGetLeftBracePos',
  'emscriptenWebGLGetVertexAttrib',
  '__glGetActiveAttribOrUniform',
  'writeGLArray',
  'registerWebGlEventCallback',
  'runAndAbortIfError',
  'SDL_unicode',
  'SDL_ttfContext',
  'SDL_audio',
  'GLFW_Window',
  'ALLOC_NORMAL',
  'ALLOC_STACK',
  'allocate',
  'writeStringToMemory',
  'writeAsciiToMemory',
];
missingLibrarySymbols.forEach(missingLibrarySymbol)

var unexportedSymbols = [
  'run',
  'addOnPreRun',
  'addOnInit',
  'addOnPreMain',
  'addOnExit',
  'addOnPostRun',
  'addRunDependency',
  'removeRunDependency',
  'FS_createFolder',
  'FS_createPath',
  'FS_createDataFile',
  'FS_createLazyFile',
  'FS_createLink',
  'FS_createDevice',
  'FS_unlink',
  'out',
  'err',
  'callMain',
  'abort',
  'keepRuntimeAlive',
  'wasmMemory',
  'stackAlloc',
  'stackSave',
  'stackRestore',
  'getTempRet0',
  'setTempRet0',
  'writeStackCookie',
  'checkStackCookie',
  'intArrayFromBase64',
  'tryParseAsDataURI',
  'ptrToString',
  'zeroMemory',
  'exitJS',
  'getHeapMax',
  'abortOnCannotGrowMemory',
  'ENV',
  'MONTH_DAYS_REGULAR',
  'MONTH_DAYS_LEAP',
  'MONTH_DAYS_REGULAR_CUMULATIVE',
  'MONTH_DAYS_LEAP_CUMULATIVE',
  'isLeapYear',
  'arraySum',
  'addDays',
  'ERRNO_CODES',
  'ERRNO_MESSAGES',
  'DNS',
  'Protocols',
  'Sockets',
  'initRandomFill',
  'randomFill',
  'timers',
  'warnOnce',
  'UNWIND_CACHE',
  'readEmAsmArgsArray',
  'getExecutableName',
  'handleException',
  'callUserCallback',
  'maybeExit',
  'safeSetTimeout',
  'asyncLoad',
  'alignMemory',
  'mmapAlloc',
  'convertI32PairToI53Checked',
  'getCFunc',
  'freeTableIndexes',
  'functionsInTableMap',
  'setValue',
  'getValue',
  'PATH',
  'PATH_FS',
  'UTF8Decoder',
  'UTF8ArrayToString',
  'UTF8ToString',
  'stringToUTF8Array',
  'stringToUTF8',
  'lengthBytesUTF8',
  'intArrayFromString',
  'intArrayToString',
  'stringToAscii',
  'UTF16Decoder',
  'stringToUTF8OnStack',
  'writeArrayToMemory',
  'JSEvents',
  'specialHTMLTargets',
  'currentFullscreenStrategy',
  'restoreOldWindowedStyle',
  'demangle',
  'demangleAll',
  'ExitStatus',
  'getEnvStrings',
  'doReadv',
  'doWritev',
  'promiseMap',
  'uncaughtExceptionCount',
  'exceptionLast',
  'exceptionCaught',
  'ExceptionInfo',
  'Browser',
  'setMainLoop',
  'wget',
  'SYSCALLS',
  'preloadPlugins',
  'FS_createPreloadedFile',
  'FS_modeStringToFlags',
  'FS_getMode',
  'FS',
  'MEMFS',
  'TTY',
  'PIPEFS',
  'SOCKFS',
  'tempFixedLengthArray',
  'miniTempWebGLFloatBuffers',
  'miniTempWebGLIntBuffers',
  'GL',
  'emscripten_webgl_power_preferences',
  'AL',
  'GLUT',
  'EGL',
  'GLEW',
  'IDBStore',
  'SDL',
  'SDL_gfx',
  'GLFW',
  'allocateUTF8',
  'allocateUTF8OnStack',
];
unexportedSymbols.forEach(unexportedRuntimeSymbol);



var calledRun;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
};

function callMain(args = []) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on Module["onRuntimeInitialized"])');
  assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');

  var entryFunction = _main;

  args.unshift(thisProgram);

  var argc = args.length;
  var argv = stackAlloc((argc + 1) * 4);
  var argv_ptr = argv >> 2;
  args.forEach((arg) => {
    HEAP32[argv_ptr++] = stringToUTF8OnStack(arg);
  });
  HEAP32[argv_ptr] = 0;

  try {

    var ret = entryFunction(argc, argv);

    // if we're not running an evented main loop, it's time to exit
    exitJS(ret, /* implicit = */ true);
    return ret;
  }
  catch (e) {
    return handleException(e);
  }
}

function stackCheckInit() {
  // This is normally called automatically during __wasm_call_ctors but need to
  // get these values before even running any of the ctors so we call it redundantly
  // here.
  _emscripten_stack_init();
  // TODO(sbc): Move writeStackCookie to native to to avoid this.
  writeStackCookie();
}

function run(args = arguments_) {

  if (runDependencies > 0) {
    return;
  }

    stackCheckInit();

  preRun();

  // a preRun added a dependency, run will be called later
  if (runDependencies > 0) {
    return;
  }

  function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    if (calledRun) return;
    calledRun = true;
    Module['calledRun'] = true;

    if (ABORT) return;

    initRuntime();

    preMain();

    readyPromiseResolve(Module);
    if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();

    if (shouldRunNow) callMain(args);

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      doRun();
    }, 1);
  } else
  {
    doRun();
  }
  checkStackCookie();
}

function checkUnflushedContent() {
  // Compiler settings do not allow exiting the runtime, so flushing
  // the streams is not possible. but in ASSERTIONS mode we check
  // if there was something to flush, and if so tell the user they
  // should request that the runtime be exitable.
  // Normally we would not even include flush() at all, but in ASSERTIONS
  // builds we do so just for this check, and here we see if there is any
  // content to flush, that is, we check if there would have been
  // something a non-ASSERTIONS build would have not seen.
  // How we flush the streams depends on whether we are in SYSCALLS_REQUIRE_FILESYSTEM=0
  // mode (which has its own special function for this; otherwise, all
  // the code is inside libc)
  var oldOut = out;
  var oldErr = err;
  var has = false;
  out = err = (x) => {
    has = true;
  }
  try { // it doesn't matter if it fails
    _fflush(0);
    // also flush in the JS FS layer
    ['stdout', 'stderr'].forEach(function(name) {
      var info = FS.analyzePath('/dev/' + name);
      if (!info) return;
      var stream = info.object;
      var rdev = stream.rdev;
      var tty = TTY.ttys[rdev];
      if (tty && tty.output && tty.output.length) {
        has = true;
      }
    });
  } catch(e) {}
  out = oldOut;
  err = oldErr;
  if (has) {
    warnOnce('stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the FAQ), or make sure to emit a newline when you printf etc.');
  }
}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;

if (Module['noInitialRun']) shouldRunNow = false;

run();


// end include: postamble.js


  return moduleArg.ready
}

);
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = Module;
else if (typeof define === 'function' && define['amd'])
  define([], function() { return Module; });
else if (typeof exports === 'object')
  exports["Module"] = Module;
