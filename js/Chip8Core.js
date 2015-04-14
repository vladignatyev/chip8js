/*
 GFX - шина графического адаптера (write)
 Keypad - шина кейпада (read)
*/
var Chip8Core = function(GFX, Keypad) {
	/* CPU Core */

	// RAM
	var	RAM = this.RAM = new Uint8Array(0x1000);

	// Memory layout
	var FontSetAddr    = 0x050;
	var ProgramRomAddr = 0x200;

	// CPU registers (v1, v2, v3 ... v16)
	var VX = this.VX = new Uint8Array(0x10);
			
	// Index register
	var I = this.I = 0;
	// Program counter
	var PC = this.PC = 0;
	
	// Delay time register
	var DT = this.DT = 0;
	// Sound time register
	var ST = this.ST = 0;

	var Stack = this.Stack = new Uint16Array(0x10),
			StackPointer = this.StackPointer = 0x000;

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

	this.initialize = function () {
		I = 0x000;
		PC = 0x200;

		for (var i = 0; i < 0x10; i++) {
			VX[i] = 0x00;
		}
	};

	// this.loadROM = function (blob) {
	// 	if (blob.length + ProgramRomAddr > 0x1000) {
	// 		throw "OutOfMemory: ROM size is too big, it couldn't be loaded into RAM.";
	// 	}

	// 	for (var byteIndex = 0; byteIndex < blob.length; byteIndex++) {
	// 		RAM[ProgramRomAddr + byteIndex] = blob[byteIndex];
	// 	}
	// };

	// this.loadRAMDump = function() { // todo:
	// };

	this.hw60HzClockTick = function () {
		if (DT > 0) DT--;
		if (ST > 0) ST--;
	};

	// this.addBreakpoint = function (addr) {
	// 	if (addr >= 0x200 && addr < 0x1000) {
	// 		breakpointAddrs.push(addr & 0xFFF);
	// 	} else {
	// 		console.error('Invalid breakpoint address: 0x', addr.toString(16));
	// 	}
	// };


};