/*
 GFX - шина графического адаптера (write)
 Keypad - шина кейпада (read)
*/
var Chip8Core = function(GFX, Keypad) {
	/* CPU Core */

	// RAM
	this.RAM = new Uint8Array(0x1000);

	// Memory layout
	var FontSetAddr    = 0x050;
	var ProgramRomAddr = 0x200;

	// CPU registers (v1, v2, v3 ... v16)
	this.VX = new Uint8Array(0x10);
			
	// Index register
	this.I = 0;
	// Program counter
	this.PC = 0;
	
	// Delay time register
	this.DT = 0;
	// Sound time register
	this.ST = 0;

	this.Stack = new Uint16Array(0x10);
	this.StackPointer = 0x000;


	var RAM = this.RAM, VX = this.VX, I = this.I, 
			PC = this.PC, DT = this.DT, ST = this.ST, 
			Stack = this.Stack, StackPointer = this.StackPointer;

	var BuiltinFontSetData = [
			0xF0, 0x90, 0x90, 0x90, 0xF0,  // 0
			0x20, 0x60, 0x20, 0x20, 0x70,  // 1
			0xF0, 0x10, 0xF0, 0x80, 0xF0,  // 2
			0xF0, 0x10, 0xF0, 0x10, 0xF0,  // 3
			0x90, 0x90, 0xF0, 0x10, 0x10,  // 4
			0xF0, 0x80, 0xF0, 0x10, 0xF0,  // 5
			0xF0, 0x80, 0xF0, 0x90, 0xF0,  // 6
			0xF0, 0x10, 0x20, 0x40, 0x40,  // 7
			0xF0, 0x90, 0xF0, 0x90, 0xF0,  // 8
			0xF0, 0x90, 0xF0, 0x10, 0xF0,  // 9
			0xF0, 0x90, 0xF0, 0x90, 0x90,  // A
			0xE0, 0x90, 0xE0, 0x90, 0xE0,  // B
			0xF0, 0x80, 0x80, 0x80, 0xF0,  // C
			0xE0, 0x90, 0x90, 0x90, 0xE0,  // D
			0xF0, 0x80, 0xF0, 0x80, 0xF0,  // E
			0xF0, 0x80, 0xF0, 0x80, 0x80,  // F
	];

	/*  */

	var breakUntilKeypress = false;
	var breakUntilKeypressVx;

	this.initialize = function () {
		for (var i = 0; i < 0x1000; i++) {
			RAM[i] = 0x00;
		}

		for (var i = 0; i < 0x10; i++) {
			VX[i] = 0x00;
		}

		I = 0x000;
		PC = 0x200;
		DT = 0x00;
		ST = 0x00;

		for (var byteIndex = 0; byteIndex < BuiltinFontSetData.length; byteIndex++) {
			RAM[FontSetAddr + byteIndex] = BuiltinFontSetData[byteIndex];
		}
	};

	this.loadROM = function (blob) {
		if (blob.length + ProgramRomAddr > 0x1000) {
			throw "OutOfMemory: ROM size is too big, it couldn't be loaded into RAM.";
		}

		for (var byteIndex = 0; byteIndex < blob.length; byteIndex++) {
			RAM[ProgramRomAddr + byteIndex] = blob.charCodeAt(byteIndex);
		}
	};

	this.hw60HzClockTick = function () {
		if (this.DT > 0) this.DT--;
		if (this.ST > 0) this.ST--;
	};

	this.tact = function (numInstructions) {
		var instIndex = 0;
		var instruction = 0x0000;

		if (breakUntilKeypress) {
			for (var i = 0; i < 0x10; i++) {
				if (Keypad[i] == 1) {
					VX[breakUntilKeypressVx] = i;
					breakUntilKeypress = false;
					break;
				}
			}
		}

		while (instIndex < numInstructions && !breakUntilKeypress) {
			instruction = (RAM[PC] << 8) | RAM[PC + 1];  // make 2 byte short instruction
			this.processInstruction(instruction);
			instIndex++;
		}		
	};

	this.processInstruction = function(instruction) {
		if (instruction == 0x00E0) { // 00E0 CLS
			GFX.clearTheDisplay();
			PC += 2; return;
		}

		/* Program execution flow instructions */

		var i = instruction >> 12; /* Instruction is ixkj */
		var j = instruction & 0x0F;

		if (instruction == 0x00EE) { // 0x00EE RET
			PC = Stack[StackPointer];
			StackPointer--;
			return;
		}

		if (i == 1) { // 1nnn - JP addr
			PC = instruction & 0xFFF;
			return;
		} 
		if (i == 2) { // 2nnn - CALL addr
			StackPointer++;
			Stack[StackPointer] = PC;
			PC = instruction & 0xFFF;
			return;
		} 
		/*  */

		/*  */
		if (i == 3) { // 3xkk - SE Vx, byte
			if (VX[instruction >> 8 & 0x0F] /* Vx */ == /* kk */ instruction & 0x00FF)
				PC += 2;
		}
		if (i == 4) { // 4xkk - SNE Vx, byte
			if (VX[instruction >> 8 & 0x0F] /* Vx */ != /* kk */ instruction & 0x00FF)
				PC += 2;
		}
		if (i == 5) { // 5xy0 - SE Vx, Vy
			if (VX[instruction >> 8 & 0x0F] /* Vx */ == /* Vy */ VX[instruction >> 4 & 0x0F])
				PC += 2;
		}
		if (i == 6) { // 6xkk - LD Vx, byte
			VX[instruction >> 8 & 0x0F] /* Vx */ = /* kk */ instruction & 0x00FF;
		}
		if (i == 7) { // 7xkk - ADD Vx, byte
			VX[instruction >> 8 & 0x0F] /* Vx */ = /* Vx */ VX[instruction >> 8 & 0x0F] + /* kk */ instruction & 0x00FF;
		}
		if (i == 8 && j == 0x0) { // 8xy0 - LD Vx, Vy
			VX[instruction >> 8 & 0x0F] /* Vx */ = /* Vy */ VX[instruction >> 4 & 0x0F];
		}
		if (i == 8 && j == 0x1) { // 8xy1 - OR Vx, Vy
			VX[instruction >> 8 & 0x0F] /* Vx */ = /* Vx */ VX[instruction >> 8 & 0x0F] | /* Vy */ VX[instruction >> 4 & 0x0F];
		}
		if (i == 8 && j == 0x2) { // 8xy2 - AND Vx, Vy
			VX[instruction >> 8 & 0x0F] /* Vx */ = /* Vx */ VX[instruction >> 8 & 0x0F] & /* Vy */ VX[instruction >> 4 & 0x0F];
		}
		if (i == 8 && j == 0x3) { // 8xy3 - XOR Vx, Vy
			VX[instruction >> 8 & 0x0F] /* Vx */ = /* Vx */ VX[instruction >> 8 & 0x0F] ^ /* Vy */ VX[instruction >> 4 & 0x0F];
		}
		if (i == 8 && j == 0x4) { // 8xy4 - ADD Vx, Vy
			VX[instruction >> 8 & 0x0F] /* Vx */ = /* Vx */ VX[instruction >> 8 & 0x0F] + /* Vy */ VX[instruction >> 4 & 0x0F];
			if (VX[instruction >> 8 & 0x0F] > 0xFF) {
				VX[instruction >> 8 & 0x0F] &= 0xFF;
				VX[0x0F] = 1;
			} else {
				VX[0x0F] = 0;
			}
		}
		if (i == 8 && j == 0x5) { // 8xy5 - SUB Vx, Vy
			if (VX[instruction >> 8 & 0x0F] /* Vx */ > /* Vy */ VX[instruction >> 4 & 0x0F]) {
				VX[0x0F] = 1;
			} else {
				VX[0x0F] = 0;
			}
			VX[instruction >> 8 & 0x0F] /* Vx */ = (/* Vx */ VX[instruction >> 8 & 0x0F] - /* Vy */ VX[instruction >> 4 & 0x0F]) & 0xFF;
		}
		if (i == 8 && j == 0x6) { // 8xy6 - SHR Vx {, Vy}
			if (VX[instruction >> 8 & 0x0F] /* Vx */ & 0x01 == 1) {
				VX[0x0F] = 1;
			} else {
				VX[0x0F] = 0;
			}

			VX[instruction >> 8 & 0x0F] /* Vx */ = /* Vx */ VX[instruction >> 8 & 0x0F] >> 1;
		}
		if (i == 8 && j == 0x7) { // 8xy7 - SUBN Vx, Vy
			VX[instruction >> 8 & 0x0F] /* Vx */ = (/* Vy */ VX[instruction >> 4 & 0x0F] - /* Vx */ VX[instruction >> 8 & 0x0F]) & 0xFF;

			if (VX[instruction >> 4 & 0x0F] /* Vy */ > VX[instruction >> 8 & 0x0F] /* Vx */) {
				VX[0x0F] = 1;
			} else {
				VX[0x0F] = 0;
			}

			VX[instruction >> 8 & 0x0F] /* Vx */ = /* Vx */ VX[instruction >> 8 & 0x0F] > 1;
		}
		if (i == 8 && j == 0xE) { // 8xyE - SHL Vx {, Vy}
			if (VX[instruction >> 8 & 0x0F] /* Vx */ >> 7 == 1) {
				VX[0x0F] = 1;
			} else {
				VX[0x0F] = 0;
			}

			VX[instruction >> 8 & 0x0F] /* Vx */ = /* Vx */ VX[instruction >> 8 & 0x0F] << 1;
		} 
		if (i == 9 && j == 0) { // 9xy0 - SNE Vx, Vy
			if (VX[instruction >> 8 & 0x0F] /* Vx */ != /* Vy */ VX[instruction >> 4 & 0x0F])
				PC += 2;
		}
		if (i == 0xA) { // Annn - LD I, addr
			I = instruction & 0xFFF;
		}
		if (i == 0xB) { // Bnnn - JP V0, addr
			PC = instruction & 0xFFF + VX[0];
		}
		if (i == 0xC) { // Cxkk - RND Vx, byte
			VX[instruction >> 8 & 0x0F] /* Vx */ = Math.ceil(Math.random() * 0xFF);
		}
		if (i == 0xD) { // Dxyn - DRW Vx, Vy, nibble
			var Vx = VX[instruction >> 8 & 0x0F] /* Vx */;
			var Vy = VX[instruction >> 4 & 0x0F] /* Vy */;
			var Nibble = instruction & 0x0F;

			var Sprite = Uint8Array(Nibble);

			for (var k = 0; k < Nibble; k++) { // copy sprites from RAM to Sprite
				Sprite[k] = RAM[I + k];
			}

			if (GFX.renderSpriteCall(Vx, Vy, Sprite)) {
				VX[0xF] = 1;
			} else {
				VX[0xF] = 0;
			}
		}
		if (i == 0xE && (instruction & 0xFF == 0x9E)) { // Ex9E - SKP Vx
			if (Keypad[VX[instruction >> 8 & 0x0F]] == 1)
				PC += 2;
		}
		if (i == 0xE && (instruction & 0xFF == 0xA1)) { // ExA1 - SKNP Vx
			if (Keypad[VX[instruction >> 8 & 0x0F]] == 0)
				PC += 2;
		}
		if (i == 0xF && (instruction & 0xFF == 0x07)) { // Fx07 - LD Vx, DT
			VX[instruction >> 8 & 0x0F] /* Vx */ = DT;
		}
		if (i == 0xF && (instruction & 0xFF == 0x0A)) { // Fx0A - LD Vx, K
			breakUntilKeypress = true;
			breakUntilKeypressVx = VX[instruction >> 8 & 0x0F];
		}
		if (i == 0xF && (instruction & 0xFF == 0x15)) { // Fx15 - LD DT, Vx
			DT = VX[instruction >> 8 & 0x0F] /* Vx */;
		}
		if (i == 0xF && (instruction & 0xFF == 0x18)) { // Fx18 - LD ST, Vx
			ST = VX[instruction >> 8 & 0x0F] /* Vx */;
		}
		if (i == 0xF && (instruction & 0xFF == 0x1E)) { // Fx1E - ADD I, Vx
			I = (I + VX[instruction >> 8 & 0x0F] /* Vx */) & 0xFFF;
		}
		if (i == 0xF && (instruction & 0xFF == 0x29)) { // Fx29 - LD F, Vx
			I = VX[instruction >> 8 & 0x0F] /* Vx */ * 5 + FontSetAddr;
		}
		if (i == 0xF && (instruction & 0xFF == 0x33)) { // Fx33 - LD B, Vx
			var bcdVx = (VX[instruction >> 8 & 0x0F] /* Vx */).toString(10);
			RAM[I] = bcdVx.charCodeAt(0);
			RAM[I + 1] = bcdVx.charCodeAt(1);
			RAM[I + 2] = bcdVx.charCodeAt(2);
		}
		if (i == 0xF && (instruction & 0xFF == 0x55)) { // Fx55 - LD [I], Vx
			for (var k = 0x00; k < 0x10; k++) {
				RAM[I + k] = VX[k];
			}
		}
		if (i == 0xF && (instruction & 0xFF == 0x65)) { // Fx65 - LD Vx, [I]
			for (var k = 0x00; k < 0x10; k++) {
				VX[k] = RAM[I + k];
			}
		}

		PC += 2; return;
	};

};