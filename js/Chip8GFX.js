var Chip8GFX = function () {
	var ScreenWidth = 64;
	var ScreenHeight = 32;
	var ScreenSize = ScreenWidth * ScreenHeight;

	this.VRAM = new Uint8Array(ScreenSize);

	/* CPU -> GFX Bus */
	this.clearTheDisplay = function () {
		for (var i = 0; i < ScreenSize; i++) {
			this.VRAM[i] = 0x00;
		}
	};

	this.renderSpriteCall = function (x, y, spriteRowBytes) {
		var result = false,
				currentPixel, rowByte,
				newPixel, xorPixel,
				curX = x, curY = y; 

		for (var row = 0; row < spriteRowBytes.length; row++) {
			curX = x;
			rowByte = spriteRowBytes[row];

			for (var b = 7; b >= 0; b--) {
				newPixel = (rowByte >> b) & 0x01;
				if (newPixel != 0) {

				currentPixel = this.VRAM[this.xy(curX, curY)];
				xorPixel = currentPixel ^ newPixel;
				if (xorPixel == 0 && currentPixel == 1) result = true;
				this.VRAM[this.xy(curX, curY)] = xorPixel;
			}
				curX++;
			}
			curY++;
		}
		return result;
	};

	// Emulation
	this.xy = function (x, y) { // x, y to index
		var x0 = x;
		var y0 = y;
		if (x0 > ScreenWidth - 1) x0 -= ScreenWidth;
		if (y0 > ScreenHeight - 1) y0 -= ScreenHeight;
		return x0 + ScreenWidth * y0;
	}

	this.byteToString = function (rowByte) {
		var r = '';
		for (var b = 7; b >= 0; b--) {
			newPixel = (rowByte >> b) & 0x01;
			if (newPixel == 1) r += '+';
			else r += '.';
		}
		return r;
	}

	this.initialize = function () {
		this.clearTheDisplay();
	}
};