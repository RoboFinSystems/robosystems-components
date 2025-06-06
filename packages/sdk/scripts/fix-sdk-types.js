#!/usr/bin/env node
/* eslint-env node */

const fs = require('fs')
const path = require('path')

const typesFilePath = path.join(
  __dirname,
  '../src/generated/types.gen.ts'
)

try {
  let content = fs.readFileSync(typesFilePath, 'utf8')

  // Fix the problematic union type
  content = content.replace(/ \| \(string & \{\}\)/g, '')

  fs.writeFileSync(typesFilePath, content, 'utf8')
  console.log('✅ Fixed SDK types - removed problematic union types')
} catch (error) {
  console.error('❌ Error fixing SDK types:', error.message)
  process.exit(1)
}