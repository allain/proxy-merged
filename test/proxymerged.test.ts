import proxyMerged from '../src/index'

it('can be created empty', () => expect(proxyMerged([])).toBeTruthy())

it('reading, object works', () => {
  const s = proxyMerged([{ x: { y: 1 } }, {}])
  expect(typeof s.x).toEqual('object')
  expect(s.x.y).toEqual(1)
})

it('shallow merges objects together', () => {
  const s = proxyMerged([{ a: 'hi' }, { a: { b: 10 } }])
  expect(s.a).toEqual('hi')
})

it('merges all props of all objects together', () => {
  const s = proxyMerged([{ a: 1 }, { b: 2 }, { c: 3 }])
  expect(s.a).toEqual(1)
  expect(s.b).toEqual(2)
  expect(s.c).toEqual(3)
  expect(s.d).toBeUndefined()
})

it('merged object has expected keys', () => {
  const s = proxyMerged([{ a: 1 }, { b: 2 }, { c: 3 }])
  expect(Object.keys(s)).toEqual(['c', 'b', 'a'])
})

it('makes merged object look like real object', () => {
  const s = proxyMerged([{ a: 1 }, { b: 2 }, { c: 3 }])
  expect(s).toEqual({ a: 1, b: 2, c: 3 })
})

it('toString is sane', () => {
  const s = proxyMerged([{ a: 1 }, { b: 2 }, { c: 3 }])
  const r = { a: 1, b: 2, c: 3 }
  expect(s.toString()).toEqual(r.toString())
})

it('modifies first object with key found', () => {
  const a = { a: 1 }
  const b = { b: 2 }
  const s = proxyMerged([a, b])
  s.a = 10
  s.b = 20
  expect(a).toEqual({ a: 10 })
  expect(b).toEqual({ b: 20 })
})

it('modifies first object with key found', () => {
  const a = { a: 1 }
  const b = { b: 2 }
  const s = proxyMerged([a, b])
  s.c = 'Hello'
  expect(a).toEqual({ a: 1, c: 'Hello' })
})

it('behaves as it should in "in" expressions', () => {
  const a = { a: 1 }
  const b = { b: 2 }
  const s = proxyMerged([a, b])
  expect('a' in s).toEqual(true)
  expect('b' in s).toEqual(true)
  expect('c' in s).toEqual(false)
})
