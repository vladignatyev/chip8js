var Chip8GFX = function () {
	var ScreenWidth = 64;
	var ScreenHeight = 32;
	var ScreenSize = ScreenWidth * ScreenHeight;

	this.VRAM = new Uint8Array(ScreenSize);

	var VRAM = this.VRAM;

	/* CPU -> GFX Bus */
	this.clearTheDisplay = function () {
		for (var i = 0; i < ScreenSize; i++) {
			VRAM[i] = 0x00;
		}
	};

	function xy(x, y) { // x, y to index
		var x0 = x;
		var y0 = y;
		if (x0 > ScreenWidth - 1) x0 -= ScreenWidth;
		if (y0 > ScreenHeight - 1) y0 -= ScreenHeight;
		return x0 + ScreenWidth * y0;
	}

	this.renderSpriteCall = function (x, y, spriteRowBytes) {
		var result,
				currentPixel, rowByte,
				newPixel, xorPixel,
				curX, curY = y; 

		for (var row = 0; row < spriteRowBytes.length; row++) {
			curX = x;
			currentPixel = VRAM[xy(curX, curY)];
			rowByte = spriteRowBytes[row];

			for (var b = 7; b >= 0; b--) {
				newPixel = (rowByte >> b) & 0x01;
				xorPixel = currentPixel ^ newPixel;
				if (newPixel == 1 && xorPixel == 0) result = true;
				VRAM[xy(curX, curY)] = xorPixel;
				curX++;
			}
			curY++;
		}
	};
};