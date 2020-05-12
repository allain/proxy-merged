# Proxy merged

Proxy merged is a tool for merging objects together using a proxy.

## Usage

```JavaScript
import proxyMerged from 'proxy-merged'
const a = { a: 1 }
const b = { b: 1 }
const merged = proxyMerged(a, b)

// merged can ge asked about props on its constituents
console.log('a:', merged.a, 'b:', merged.b)

// props not found in any of the sources is undefined
console.log('c:', merged.c)

// the merged object is mutable
merged.a = 'A' // changes a.a to A
merged.b = 'B' // changes b.b to B
merged.c = 'C' // when none of the sources have a prop, the change is performed on the first one given (a in this case)
console.log(a) // => {a:'A', c: 'C'}
console.log(b) // => {b:'B'}
```
