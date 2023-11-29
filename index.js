const fs = require('node:fs')
const path = require('node:path')
const { WASI } = require('node:wasi') 

const wasm32UnknownUnknownDebug = path.join(__dirname, './target/wasm32-unknown-unknown/debug/binding.wasm')
const wasm32UnknownUnknownRelease = path.join(__dirname, './target/wasm32-unknown-unknown/release/binding.wasm')
const wasm32WasiDebug = path.join(__dirname, './target/wasm32-wasi/debug/binding.wasm')
const wasm32WasiRelease = path.join(__dirname, './target/wasm32-wasi/release/binding.wasm')
const wasm32WasiThreadsDebug = path.join(__dirname, './target/wasm32-wasi-preview1-threads/debug/binding.wasm')
const wasm32WasiThreadsRelease = path.join(__dirname, './target/wasm32-wasi-preview1-threads/release/binding.wasm')

// wasm32-unknown-unknown

let instance = new WebAssembly.Instance(new WebAssembly.Module(fs.readFileSync(wasm32UnknownUnknownDebug)))
console.log(instance.exports.add(1, 2)) // <-- break point

instance = new WebAssembly.Instance(new WebAssembly.Module(fs.readFileSync(wasm32UnknownUnknownRelease)))
console.log(instance.exports.add(1, 2)) // <-- break point

// wasm32-wasi

const wasi1 = new WASI({ version: 'preview1' })
instance = new WebAssembly.Instance(new WebAssembly.Module(fs.readFileSync(wasm32WasiDebug)), wasi1.getImportObject())
wasi1.initialize(instance)
console.log(instance.exports.add(1, 2)) // <-- break point

const wasi2 = new WASI({ version: 'preview1' })
instance = new WebAssembly.Instance(new WebAssembly.Module(fs.readFileSync(wasm32WasiRelease)), wasi2.getImportObject())
wasi2.initialize(instance)
console.log(instance.exports.add(1, 2)) // <-- break point

// wasm32-wasi-threads

const wasi3 = new WASI({ version: 'preview1' })
instance = new WebAssembly.Instance(new WebAssembly.Module(fs.readFileSync(wasm32WasiThreadsDebug)), {
  ...wasi3.getImportObject(),
  env: {
    memory: new WebAssembly.Memory({ shared: true, initial: 16777216 / 65536, maximum: 2147483648 / 65536 })
  }
})
wasi3.initialize(instance)
console.log(instance.exports.add(1, 2)) // <-- break point

const wasi4 = new WASI({ version: 'preview1' })
instance = new WebAssembly.Instance(new WebAssembly.Module(fs.readFileSync(wasm32WasiThreadsRelease)), {
  ...wasi4.getImportObject(),
  env: {
    memory: new WebAssembly.Memory({ shared: true, initial: 16777216 / 65536, maximum: 2147483648 / 65536 })
  }
})
wasi4.initialize(instance)
console.log(instance.exports.add(1, 2)) // <-- break point
