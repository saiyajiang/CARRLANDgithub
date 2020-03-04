(function(){
	// 以别名扩充菜单视窗方法
	var testjavascript_createwindow = Scene_Menu.prototype.create
	Scene_Menu.prototype.create = function() {
		testjavascript_createwindow.call(this);
	};
	// 建立新的视窗 
	function Window_Costum() {
	    this.initialize.apply(this, arguments);
	}

	Window_Costum.prototype = Object.create(Window_Base.prototype);
	Window_Costum.prototype.constructor = Window_Costum;

	Window_Costum.prototype.initialize = function(x, y) {
	    var width = this.windowWidth();
	    var height = this.windowHeight();
	    Window_Base.prototype.initialize.call(this, x, y, width, height);
	    this.refresh();
	};

	Window_Costum.prototype.windowWidth = function() {
	    return 240;
	};

	Window_Costum.prototype.windowHeight = function() {
	    return this.fittingHeight(1);
	};

	Window_Costum.prototype.refresh = function() {
	    var x = this.textPadding();
	    var width = this.contents.width - this.textPadding() * 2;
	    this.contents.clear();
	    this.drawCurrencyValue(this.value(), this.currencyUnit(), x, 0, width);
	};

	Window_Costum.prototype.value = function() {
	    return $gameParty.gold();
	};

	Window_Costum.prototype.currencyUnit = function() {
	    return TextManager.currencyUnit;
	};

	Window_Costum.prototype.open = function() {
	    this.refresh();
	    Window_Base.prototype.open.call(this);
	};


})();