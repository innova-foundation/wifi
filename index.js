var bs58icheck = require('bs58icheck')
var Buffer = require('safe-buffer').Buffer

function decodeRaw (buffer, version) {
  // check version only if defined
  if (version !== undefined && buffer[0] !== version) throw new Error('Invalid network version')

  // uncompressed
  if (buffer.length === 33) {
    return {
      version: buffer[0],
      privateKey: buffer.slice(1, 33),
      compressed: false
    }
  }

  // invalid length
  if (buffer.length !== 34) throw new Error('Invalid WIF length')

  // invalid compression flag
  if (buffer[33] !== 0x01) throw new Error('Invalid compression flag')

  return {
    version: buffer[0],
    privateKey: buffer.slice(1, 33),
    compressed: true
  }
}

function encodeRaw (version, privateKey, compressed) {
  if (privateKey.length !== 32) throw new TypeError('Invalid privateKey length')

  var result = Buffer.alloc(compressed ? 34 : 33)
  result.writeUInt8(version, 0)
  privateKey.copy(result, 1)

  if (compressed) {
    result[33] = 0x01
  }

  return result
}

function decode (string, version) {
  return decodeRaw(bs58icheck.decode(string), version)
}

function encode (version, privateKey, compressed) {
  if (typeof version === 'number') return bs58icheck.encode(encodeRaw(version, privateKey, compressed))

  return bs58icheck.encode(
    encodeRaw(
      version.version,
      version.privateKey,
      version.compressed
    )
  )
}

module.exports = {
  decode: decode,
  decodeRaw: decodeRaw,
  encode: encode,
  encodeRaw: encodeRaw
}
