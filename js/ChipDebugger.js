function instructionToUI (instruction) {
	function link(inst) { 
		var chunks = inst.split(' -');
		var code = chunks[0].toLowerCase();
		return [inst, 'http://devernay.free.fr/hacks/chip8/C8TECH10.HTM#' + code];
	}

	if (instruction == 0x00E0) { // 00E0 CLS
			return link('00E0 - CLS');
		}

		var i = instruction >> 12; /* Instruction is ixkj */
		var j = instruction & 0x0F;

		if (instruction == 0x00EE) { // 00EE RET
			return link('00EE - RET');
		}

		if (i == 1) { // 1nnn - JP addr
			return link('1nnn - JP 0x' + (instruction & 0xFFF).toString(16));
		} 
		if (i == 2) { // 2nnn - CALL addr
			return link('2nnn - CALL 0x' + (instruction & 0xFFF).toString(16));
		} 
		if (i == 3) { // 3xkk - SE Vx, byte
			return link('3xkk - SE V' + (instruction >> 8 & 0x0F).toString(16) + ', ' + (instruction & 0x00FF).toString(16));
		}
		if (i == 4) { // 4xkk - SNE Vx, byte
			return link('4xkk - SNE V' + (instruction >> 8 & 0x0F).toString(16) + ', ' + (instruction & 0x00FF).toString(16));
		}
		if (i == 5) { // 5xy0 - SE Vx, Vy
			return link('5xy0 - SE V' + (instruction >> 8 & 0x0F).toString(16) + ', ' + (instruction >> 4 & 0x0F).toString(16));
		}
		if (i == 6) { // 6xkk - LD Vx, byte
			return link('6xkk - LD V' + (instruction >> 8 & 0x0F).toString(16) + ', ' + (instruction & 0x00FF).toString(16));
		}
		if (i == 7) { // 7xkk - ADD Vx, byte
			return link('7xkk - ADD V' + (instruction >> 8 & 0x0F).toString(16) + ', ' + (instruction & 0x00FF).toString(16));
		}
		if (i == 8 && j == 0x0) { // 8xy0 - LD Vx, Vy
			return link('8xy0 - LD V' + (instruction >> 8 & 0x0F).toString(16) + ', V' + (instruction >> 4 & 0x0F).toString(16));
		}
		if (i == 8 && j == 0x1) { // 8xy1 - OR Vx, Vy
			return link('8xy1 - OR V' + (instruction >> 8 & 0x0F).toString(16) + ', V' + (instruction >> 4 & 0x0F).toString(16));
		}
		if (i == 8 && j == 0x2) { // 8xy2 - AND Vx, Vy
			return link('8xy2 - AND V' + (instruction >> 8 & 0x0F).toString(16) + ', V' + (instruction >> 4 & 0x0F).toString(16));
		}
		if (i == 8 && j == 0x3) { // 8xy3 - XOR Vx, Vy
			return link('8xy3 - XOR V' + (instruction >> 8 & 0x0F).toString(16) + ', V' + (instruction >> 4 & 0x0F).toString(16));
		}
		if (i == 8 && j == 0x4) { // 8xy4 - ADD Vx, Vy
			return link('8xy4 - ADD V' + (instruction >> 8 & 0x0F).toString(16) + ', V' + (instruction >> 4 & 0x0F).toString(16));
		}
		if (i == 8 && j == 0x5) { // 8xy5 - SUB Vx, Vy
			return link('8xy5 - SUB V' + (instruction >> 8 & 0x0F).toString(16) + ', V' + (instruction >> 4 & 0x0F).toString(16));
		}
		if (i == 8 && j == 0x6) { // 8xy6 - SHR Vx {, Vy}
			return link('8xy6 - SHR V' + (instruction >> 8 & 0x0F).toString(16) + ', V' + (instruction >> 4 & 0x0F).toString(16));
		}
		if (i == 8 && j == 0x7) { // 8xy7 - SUBN Vx, Vy
			return link('8xy7 - SUBN V' + (instruction >> 8 & 0x0F).toString(16) + ', V' + (instruction >> 4 & 0x0F).toString(16));
		}
		if (i == 8 && j == 0xE) { // 8xyE - SHL Vx {, Vy}
			return link('8xyE - SHL V' + (instruction >> 8 & 0x0F).toString(16) + ', V' + (instruction >> 4 & 0x0F).toString(16));
		} 
		if (i == 9 && j == 0) { // 9xy0 - SNE Vx, Vy
			return link('9xy0 - SNE V' + (instruction >> 8 & 0x0F).toString(16) + ', V' + (instruction >> 4 & 0x0F).toString(16));
		}
		if (i == 0xA) { // Annn - LD I, addr
			return link('Annn - LD I, addr' + (instruction & 0x0FFF).toString(16));
		}
		if (i == 0xB) { // Bnnn - JP V0, addr
			return link('Bnnn - JP V0, ' + (instruction & 0x0FFF).toString(16));
		}
		if (i == 0xC) { // Cxkk - RND Vx, byte
			return link('Cxkk - RND '+ (instruction >> 8 & 0x0F).toString(16) +', ' + (instruction & 0x00FF).toString(16));
		}
		if (i == 0xD) { // Dxyn - DRW Vx, Vy, nibble
			var Nibble = instruction & 0x0F;
			return link('Dxyn - DRW V' + (instruction >> 8 & 0x0F).toString(16) + ', ' + (instruction >> 4 & 0x0F).toString(16) + ', ' + Nibble);
		}
		if (i == 0xE && ((instruction & 0xFF) == 0x9E)) { // Ex9E - SKP Vx
			return link('Ex9E - SKP V' + (instruction >> 8 & 0x0F).toString(16));
		}
		if (i == 0xE && ((instruction & 0xFF) == 0xA1)) { // ExA1 - SKNP Vx
			return link('ExA1 - SKNP V' + (instruction >> 8 & 0x0F).toString(16));
		}
		if (i == 0xF && ((instruction & 0xFF) == 0x07)) { // Fx07 - LD Vx, DT
			return link('Fx07 - LD V' + (instruction >> 8 & 0x0F).toString(16) + ', DT');
		}
		if (i == 0xF && ((instruction & 0xFF) == 0x0A)) { // Fx0A - LD Vx, K
			return link('Fx0A - LD V' + (instruction >> 8 & 0x0F).toString(16) + ', K');
		}
		if (i == 0xF && ((instruction & 0xFF) == 0x15)) { // Fx15 - LD DT, Vx
			return link('Fx15 - LD DT, V' + (instruction >> 8 & 0x0F).toString(16));
		}
		if (i == 0xF && ((instruction & 0xFF) == 0x18)) { // Fx18 - LD ST, Vx
			return link('Fx18 - LD ST, V' + (instruction >> 8 & 0x0F).toString(16));
		}
		if (i == 0xF && ((instruction & 0xFF) == 0x1E)) { // Fx1E - ADD I, Vx
			return link('Fx1E - ADD I, V' + (instruction >> 8 & 0x0F).toString(16));
		}
		if (i == 0xF && ((instruction & 0xFF) == 0x29)) { // Fx29 - LD F, Vx
			return link('Fx29 - LD F, V' + (instruction >> 8 & 0x0F).toString(16));
		}
		if (i == 0xF && ((instruction & 0xFF) == 0x33)) { // Fx33 - LD B, Vx
			return link('Fx33 - LD B, V' + (instruction >> 8 & 0x0F).toString(16));
		}
		if (i == 0xF && ((instruction & 0xFF) == 0x55)) { // Fx55 - LD [I], Vx
			return link('Fx55 - LD [I], V' + (instruction >> 8 & 0x0F).toString(16));
		}
		if (i == 0xF && ((instruction & 0xFF) == 0x65)) { // Fx65 - LD Vx, [I]
			return link('Fx65 - LD V' + (instruction >> 8 & 0x0F).toString(16) + ', [I]');
		}

		return link(instruction.toString(16) + ' - UNKNOWN');
}


var ChipDebugger = function (chip8, gfx, keypad) {

	function int2Hex (intVal) {
		var val = intVal.toString(16);
		if (val.length == 1) val = '0' + val;
		return val;
	}

	this.initialize = function () {
		var html = '';
		j = 0;
		for (var i = 0; i < chip8.RAM.length; i++) { // initialize markup for RAM state
			if (j == 0) html += '<tr>' + '<td><b>' + i.toString(16) + '</b></td>';
			html +=  '<td id="ram' + i + '">' + '</td>';
			j++;
			if (j == 16) {
				j = 0;
				html += '</tr>';
			}
		}
		$('#ramView').append(html);

		html = '';
		for (var i = 0; i < 32; i++) {
			html += '<tr>';
			for (var j = 0; j < 64; j++) {
				html += '<td id="gfx-' + j + '-' + i + '"></td>';
			}
			html += '</tr>';
		}
			
		$('#gfxDebugger').append(html);
	}

	this.renderGfxState = function () {
		for (var i = 0; i < 32; i++) {
			for (var j = 0; j < 64; j++) {
				var v = gfx.VRAM[gfx.xy(j, i)];
				if (v == 1) {
					$('#gfx-' + j + '-' + i).addClass('black');
				} else {
					$('#gfx-' + j + '-' + i).removeClass('black');
				}
			}
		}
	}

	this.renderKeypadState = function() {
		for (var i = 0; i < 0x10; i++) {
			if (keypad[i] == 0) {
				$('#key' + i).removeClass('current');
			} else {
				$('#key' + i).addClass('current');
			}
			
		}
	}

	this.renderEmulatorState = function() {
		var debugRegisters = ['I', 'PC', 'DT', 'ST'];

		for (var i = 0; i < debugRegisters.length; i++) {
			var val = parseInt($('#debug' + debugRegisters[i]).html(), 16);
			if (chip8[debugRegisters[i]] != val) {
				$('#debug' + debugRegisters[i]).addClass('changed');
			} else {
				$('#debug' + debugRegisters[i]).removeClass('changed');
			}
			$('#debug' + debugRegisters[i]).html(int2Hex(chip8[debugRegisters[i]]));
		}

		for (var i = 0; i < 0x10; i++) {
			var val = parseInt($('#v' + i).html(), 16);
			if (chip8.VX[i] != val) {
				$('#v' + i).addClass('changed');
			} else {
				$('#v' + i).removeClass('changed');
			}
			$('#v' + i).html(int2Hex(chip8.VX[i]));
		}

		$('#peAddr').html(int2Hex(chip8.PC));
		$('#peInstruction').html(int2Hex(chip8.RAM[chip8.PC] << 8 | chip8.RAM[chip8.PC+1]));

		var help = instructionToUI(chip8.RAM[chip8.PC] << 8 | chip8.RAM[chip8.PC+1]);
		$('#peInstructionHelp').html('<a href="' + help[1] +'" target="_blank">' + help[0] + '</a>');

		for (var i = 0; i < chip8.RAM.length; i++) {
			var val = parseInt($('#ram' + i).html(), 16);

			if (chip8.RAM[i] != val) {
				$('#ram' + i).addClass('changed');
			} else {
				$('#ram' + i).removeClass('changed');
			}

			$('#ram' + i).html(int2Hex(chip8.RAM[i]));
		}

		$('#ramDebugger td').removeClass('current');
		$('#ram' + chip8.PC).addClass('current');
		$('#ram' + (chip8.PC + 1)).addClass('current');


		for (var i = 0; i < 0x10; i++) {
			var val = parseInt($('#stack' + i).html(), 16);
			if (val != chip8.Stack[i]) {
				$('#stack' + i).addClass('changed');
			} else {
				$('#stack' + i).removeClass('changed');
			}
			$('#stack' + i).html(int2Hex(chip8.Stack[i]));
		}

		$('#stackDebugger td').removeClass('current');
		$('#stack' + chip8.StackPointer).addClass('current');

		this.renderGfxState();
		this.renderKeypadState();
	}
};
