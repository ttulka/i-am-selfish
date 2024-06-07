const selfish = require('./i-am-selfish')

const A = 0, B = 1, C = 2, D = 3

const translate = p => p.replaceAll(/[^ABCD]/g, '')
                        .replaceAll(/A/g, '\u0049')
                        .replaceAll(/B/g, '\u0399')
                        .replaceAll(/C/g, '\u0406')
                        .replaceAll(/D/g, '\u04c0')

test('error: invalid syntax', () => {
  expect(() => selfish('i')).toThrow()
  expect(() => selfish('I ')).toThrow()
  expect(() => selfish(' I')).toThrow()
  expect(() => selfish('I I')).toThrow()
})

test('empty program', () => {
  expect(selfish('')).toStrictEqual([0, 0, 0, 0])
})

test('increment', () => {
  expect(selfish(translate('A'))).toStrictEqual([1, 0, 0, 0])
  expect(selfish(translate('AB'))).toStrictEqual([1, 1, 0, 0])
  expect(selfish(translate('BA'))).toStrictEqual([1, 1, 0, 0])
  expect(selfish(translate('ABCD'))).toStrictEqual([1, 1, 1, 1])
  expect(selfish(translate('ABCDABCD'))).toStrictEqual([2, 2, 2, 2])
})

test('decrement', () => {
  expect(selfish(translate('AA'), [1, 0, 0, 0])).toStrictEqual([0, 0, 0, 0])
  expect(selfish(translate('AABB'), [2, 2, 0, 0])).toStrictEqual([1, 1, 0, 0])
  expect(selfish(translate('BBAA'), [2, 2, 0, 0])).toStrictEqual([1, 1, 0, 0])
  expect(selfish(translate('AABBCCDD'), [3, 3, 3, 3])).toStrictEqual([2, 2, 2, 2])
  expect(selfish(translate('AABBCCDDAABBCCDD'), [3, 3, 3, 3])).toStrictEqual([1, 1, 1, 1])
})

test('not', () => { // B = NOT A
  expect(selfish(translate('AAAB'), [0, 0, 0, 0])[B]).toBeGreaterThanOrEqual(1)
  expect(selfish(translate('AAAB'), [1, 0, 0, 0])[B]).toEqual(0)
})

test('or', () => { // C = A OR B
  expect(selfish(translate('AAADBBBADDDCAAAC'), [0, 0, 0, 0])[C]).toEqual(0)
  expect(selfish(translate('AAADBBBADDDCAAAC'), [0, 1, 0, 0])[C]).toBeGreaterThanOrEqual(1)
  expect(selfish(translate('AAADBBBADDDCAAAC'), [1, 0, 0, 0])[C]).toBeGreaterThanOrEqual(1)
  expect(selfish(translate('AAADBBBADDDCAAAC'), [1, 1, 0, 0])[C]).toBeGreaterThanOrEqual(1)
})

test('and', () => { // C = A AND B
  expect(selfish(translate('AAADBBBDADDDC'), [0, 0, 0, 0])[C]).toEqual(0)
  expect(selfish(translate('AAADBBBDADDDC'), [0, 1, 0, 0])[C]).toEqual(0)
  expect(selfish(translate('AAADBBBDADDDC'), [1, 0, 0, 0])[C]).toEqual(0)
  expect(selfish(translate('AAADBBBDADDDC'), [1, 1, 0, 0])[C]).toBeGreaterThanOrEqual(1)
})

test('nand', () => { // C = A NAND B
  expect(selfish(translate('AAACBBBC'), [0, 0, 0, 0])[C]).toBeGreaterThanOrEqual(1)
  expect(selfish(translate('AAACBBBC'), [0, 1, 0, 0])[C]).toBeGreaterThanOrEqual(1)
  expect(selfish(translate('AAACBBBC'), [1, 0, 0, 0])[C]).toBeGreaterThanOrEqual(1)
  expect(selfish(translate('AAACBBBC'), [1, 1, 0, 0])[C]).toEqual(0)
})

test('invert', () => { // A = NOT A
  expect(selfish(translate('AAABABBBAABBBAABB'), [0, 0, 0, 0])).toStrictEqual([1, 0, 0, 0])
  expect(selfish(translate('AAABABBBAABBBAABB'), [1, 0, 0, 0])).toStrictEqual([0, 0, 0, 0])
})

test('infinite loop', () => {
    expect(() => selfish(translate('AAAA'), null, 100)).toThrow()
})

test('loop', () => {
    expect(selfish(translate('ABABAB AAB CC AAAC B CCCBBBBBB'))).toStrictEqual([0, 11, 1, 0])
})

test('addition', () => { // A = A + B
  const add = translate(`
    BBB CCCCC    if b==0 jump to end
    BB           b--
    A            a++
    BBBB         jump to begin
    CC           end label
  `)
  // alternatively:
  // BBB C       if b==0 c++
  // BB          b--
  // CCC A       if b>0 a++
  // CCC BBBB    if b>0 jump 0
  expect(selfish(add, [0, 0, 0, 0])[A]).toEqual(0)
  expect(selfish(add, [1, 0, 0, 0])[A]).toEqual(1)
  expect(selfish(add, [42, 0, 0, 0])[A]).toEqual(42)
  expect(selfish(add, [0, 1, 0, 0])[A]).toEqual(1)
  expect(selfish(add, [0, 42, 0, 0])[A]).toEqual(42)
  expect(selfish(add, [1, 1, 0, 0])[A]).toEqual(2)
  expect(selfish(add, [42, 13, 0, 0])[A]).toEqual(55)
  expect(selfish(add, [13, 42, 0, 0])[A]).toEqual(55)
})

test('multiplication', () => { // A = A * B
  const mult = translate(`
    @init           initially move a to c:
    AAA BBBB B      if a==0 jump @begin
    AA C            a-- c++
    AAAA            jump @init

    @begin          add c to a via d b-times:
    BBB CCCC CCCCCC if b==0 jump @end
    BB              b--
    @add
    CCC DDDD DD     jump @mv
    CC A D          c-- a++ d++
    CCCC CC         jump @add
    @mv             move d back to c:
    DDD BBBBB       if d==0 jump @begin
    DD C            d-- c++
    DDDD DD         jump @mv          
    @end            clear c
    CC              just label    
  `)
  expect(selfish(mult, [0, 0, 0, 0])[A]).toEqual(0)
  expect(selfish(mult, [1, 0, 0, 0])[A]).toEqual(0)
  expect(selfish(mult, [42, 0, 0, 0])[A]).toEqual(0)
  expect(selfish(mult, [0, 1, 0, 0])[A]).toEqual(0)
  expect(selfish(mult, [0, 42, 0, 0])[A]).toEqual(0)
  expect(selfish(mult, [1, 1, 0, 0])[A]).toEqual(1)
  expect(selfish(mult, [2, 1, 0, 0])[A]).toEqual(2)
  expect(selfish(mult, [1, 2, 0, 0])[A]).toEqual(2)
  expect(selfish(mult, [2, 3, 0, 0])[A]).toEqual(6)
  expect(selfish(mult, [3, 2, 0, 0])[A]).toEqual(6)
  expect(selfish(mult, [13, 42, 0, 0])[A]).toEqual(546)
  expect(selfish(mult, [42, 13, 0, 0])[A]).toEqual(546)
})

test('Hello World', () => {
  const hello = `
    ABBABBABBABB              H
    AABBAABBAABBAABB
    ABBABBABB                 e
    AABBAABBAABB
    ABBABBABBABBABB           l
    AABBAABBAABBAABBAABB
    ABBABBABBABBABB           l
    AABBAABBAABBAABBAABB
    ABBABBABBABBABBABB        o
    AABBAABBAABBAABBAABBAABB
    ABB                       _
    AABB
    ABBABBABBABBABBABBABBABB  W
    AABBAABBAABBAABBAABBAABBAABBAABB
    ABBABBABBABBABBABB        o
    AABBAABBAABBAABBAABBAABB
    ABBABBABBABBABBABBABB     r
    AABBAABBAABBAABBAABBAABBAABB
    ABBABBABBABBABB           l
    AABBAABBAABBAABBAABB
    ABBABB                    d
    AABBAA
  `
  const result = []
  let last = 0, zero = true
  const onStep = r => {
    if (r[0] < last && zero) {  // value change
      result.push(last)
      zero = false
    }
    last = r[0]
    if (last === 0) zero = true
  }
  selfish(translate(hello), null, null, onStep)
  console.log('RES', result)

  const alphabet = []
  alphabet[1] = ' '
  alphabet[2] = 'd'
  alphabet[3] = 'e'
  alphabet[4] = 'H'
  alphabet[5] = 'l'
  alphabet[6] = 'o'
  alphabet[7] = 'r'
  alphabet[8] = 'W'

  let msg = ''
  for (let i = 0; i < result.length; i++) {
      msg += alphabet[result[i]]
  }

  expect(msg).toStrictEqual('Hello World')
})
