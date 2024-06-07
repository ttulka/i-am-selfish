const interpret = (program, memory, maxSteps, onStep) => {    
    // initialize
    const p = parse(program)
    const m = Array.isArray(memory) 
                ? [memory[0] ? memory[0]-0 : 0, memory[1] ? memory[1]-0 : 0, memory[2] ? memory[2]-0 : 0, memory[3] ? memory[3]-0 : 0] 
                : [0, 0, 0, 0]
    const ms = maxSteps > 0 ? maxSteps : 0

    let pc = 0   // program counter

    // execute
    let sc = 0   // step counter
    while (pc < p.length && (!ms || ++sc <= ms)) {
        const i = p[pc]

        switch (i.id) {
            case '+': 
                pc++
                m[i.reg]++
                break
            case '-':
                pc++
                if (m[i.reg]) m[i.reg]--
                break
            case '?':
                pc++
                if (m[i.reg]) pc++
                break
            case 'j':
                pc = findWhereToJump(i.reg, i.attr)
                break
        }
        
        if (typeof onStep === 'function') onStep([...m])
    }

    if (maxSteps && sc > maxSteps) throw new Error('Maximal steps exceeded')

    return [...m]

    function findWhereToJump(reg, index) {
        let i = 0, count = 0
        while (i < p.length) {
            if (p[i].reg === reg && count++ === index) return i
            i++
        }
        throw new Error('Cannot jump to unknown instruction index ' + index)
    }
}

// parse the program to AST
function parse(program) {
    const symbols2regs = {
        '\u0049': 0, // Latin capital letter I
        '\u0399': 1, // Greek capital letter iota
        '\u0406': 2, // Cyrillic capital letter Byelorussian-Ukrainian I
        '\u04c0': 3, // Cyrillic letter Palochka
    }
    const symbols = Object.keys(symbols2regs)

    if (!new RegExp('^[' + symbols.join('') + ']*$').test(program))
        throw new Error('Syntax error: invalid code')

    return (program.match(/(.)\1*/g) || [])
        .map(instr => {
            switch (instr.length) {
                case 1:  return new Instr('+', symbols2regs[instr[0]])
                case 2:  return new Instr('-', symbols2regs[instr[0]])
                case 3:  return new Instr('?', symbols2regs[instr[0]])
                default: return new Instr('j', symbols2regs[instr[0]], instr.length - 4)
            }
        })
}

class Instr {
    constructor(id, reg, attr) {
        this.id = id
        this.reg = reg
        this.attr = attr
    }
}

module.exports = interpret