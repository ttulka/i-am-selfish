# I am selfish

**I am selfish** is an esoteric programming language that solely discusses itself, permitting only variations of the symbol "*I*":

| Symbol | Encoded | Unicode name | 
| :----: | :-----: | ------------ |
| `I`    | \u0049  | Latin capital letter I | 
| `Ι`    | \u0399  | Greek capital letter iota |
| `І`    | \u0406  | Cyrillic capital letter Byelorussian-Ukrainian I |
| `Ӏ`    | \u04c0  | Cyrillic letter Palochka |

Based on the symbols they are denoted by, instructions operate on one of four registers:

| Symbol | Encoded | Register |
| :----: | :-----: | :------: |
| `I`    | \u0049  | 0        |
| `Ι`    | \u0399  | 1        |
| `І`    | \u0406  | 2        |
| `Ӏ`    | \u04c0  | 3        |

I am selfish has four instructions: increment, decrement, selection, and jump. 
Instructions are denoted as a unary number using one of the "I" symbols:

| Number | Instruction | Meaning | Example |
| :----: | ----------- | ------- | ------- |
| 1      | Increment   | Increments the register | `I` |
| 2      | Decrement   | Decrements the register | `II` |
| 3      | Selection   | Skips the next instruction if the register is zero | `III` |
| ≥4    | Jump        | Jumps to an instruction | `IIII`, `IIIII`, `IIIIII`, ... |

Jump is unconditional; its target is determined by the number of symbols appended to the instruction. Four symbols refer to zero, five to one, six to two, and so on. It counts only instructions that use the same symbols as the jump itself.

Since only "*I*" symbols are allowed, instructions with different symbols must be used as separators; otherwise, the code would be ambiguous.

The selection and jump instructions together provide conditional jumps sufficient for Turing completeness.

## Examples

To make the code more readable, we will use the following notation (pseudocode): the "*I*" symbols will be replaced by *A*, *B*, *C*, *D*, and other symbols will be ignored as comments.

### Empty program

Does nothing:

```
```

### Infinite loop

Never stops:

```
AAAA
```

or

```
IIII
```

The instruction simply jumps to itself again and again.


### Logic operations

Some boolean operations can be done with using only increments and selections:

```
c = a and b
AAAD BBBD A DDDC

c = a or b
AAAD BBBA DDDC AAAC
```

or

```
IIIӀΙΙΙӀIӀӀӀІ
```

```
IIIӀΙΙΙIӀӀӀІIIIІ
```

### Addition

Add *A* and *B* (A = A + B):

```
BBB CCCCC    if b==0 jump to end
BB           b--
A            a++
BBBB         jump to begin
CC           end label
```

or

```
ΙΙΙІІІІІΙΙIΙΙΙΙІІ
```

### Multiplication

Multiples *A* with *B* (A = A × B):

```
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
@end CC         just label 
```

or

```
IIIΙΙΙΙΙIIІIIIIΙΙΙІІІІІІІІІІΙΙІІІӀӀӀӀӀӀІІIӀІІІІІІӀӀӀΙΙΙΙΙӀӀІӀӀӀӀӀӀІІ
```

### Fibonacci sequence

Computes the Fibonacci sequence starting with the elements in *A* and *B*, continuing until the number of elements specified in *C*:

```
@begin
CCC DDDD DDDDDD  if c==0 jump to @end
CC               c--

@b2d             move b to d
BBB AAAA A       if b==0 jump to @a2b
BB D             b-- d++
BBBB             jump to @b2d

@a2b             move a to b
AAA DDDD DDD     if a==0 jump to @d2ab
AA B             a-- b++
AAAA A           jump to @a2b

@d2ab            move d to a and b
DDD CCCC         if d==0 jump to @begin
DD A B           d-- a++ b++
DDDD DD          jump to @d2ab

@end CC DD       label; both are noop
```

or

```
ІІІӀӀӀӀӀӀӀӀӀӀІІΙΙΙIIIIIΙΙӀΙΙΙΙIIIӀӀӀӀӀӀӀIIΙIIIIIӀӀӀІІІІӀӀIΙӀӀӀӀӀӀІІӀӀ
```

### Hello World

For computing "Hello World" the numbers in the registers must be interpreted as letters. 
  It can achieved by defining a simple alphabet:

| Letter | Value |
| :----: | :---: |
| ` `    | 1     |
| `d`    | 2     |
| `e`    | 3     |
| `H`    | 4     |
| `l`    | 5     |
| `o`    | 6     |
| `r`    | 7     |
| `W`    | 8     |

The following program sets *A* progressively to 4, 3, 5, 5, 6, 1, 8, 6, 7, 5, 2
  which corresponds to "Hello World":

```
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
```

or (newlines are added arbitrarily)

```
IΙΙIΙΙIΙΙIΙΙIIΙΙIIΙΙIIΙΙIIΙΙIΙΙIΙΙIΙΙIIΙΙIIΙΙIIΙΙIΙΙIΙΙIΙΙIΙΙ
IΙΙIIΙΙIIΙΙIIΙΙIIΙΙIIΙΙIΙΙIΙΙIΙΙIΙΙIΙΙIIΙΙIIΙΙIIΙΙIIΙΙIIΙΙIΙΙ
IΙΙIΙΙIΙΙIΙΙIΙΙIIΙΙIIΙΙIIΙΙIIΙΙIIΙΙIIΙΙIΙΙIIΙΙIΙΙIΙΙIΙΙIΙΙIΙΙ
IΙΙIΙΙIΙΙIIΙΙIIΙΙIIΙΙIIΙΙIIΙΙIIΙΙIIΙΙIIΙΙIΙΙIΙΙIΙΙIΙΙIΙΙIΙΙII
ΙΙIIΙΙIIΙΙIIΙΙIIΙΙIIΙΙIΙΙIΙΙIΙΙIΙΙIΙΙIΙΙIΙΙIIΙΙIIΙΙIIΙΙIIΙΙII
ΙΙIIΙΙIIΙΙIΙΙIΙΙIΙΙIΙΙIΙΙIIΙΙIIΙΙIIΙΙIIΙΙIIΙΙIΙΙIΙΙIIΙΙII
```

## JavaScript interpreter

```sh
npm i i-am-selfish
```

```js
const selfish = require('i-am-selfish')

const result = selfish(
    'ΙΙΙІІІІІΙΙIΙΙΙΙІІ', 
    [42, 13]
)
result[0]  // 55
```

## License

[MIT](LICENSE)