//=============================================================================
// QABS Skillbar
//=============================================================================

var Imported = Imported || {};

if (!Imported.QABS || !QPlus.versionCheck(Imported.QABS, '1.0.0')) {
  alert('Error: QABS+Skillbar requires QABS 1.0.0 or newer to work.');
  throw new Error('Error: QABS+Skillbar requires QABS 1.0.0 or newer to work.');
}

Imported.QABS_Skillbar = '1.0.1';

//=============================================================================
 /*:
 * @plugindesc <QABSSkillbar>
 * QABS Addon: Adds a skillbar
 * @author Quxios  | Version 1.0.1
 *
 * @requires QABS
 *
 * @param Show Unassigned Keys
 * @desc Shows Keys even if they have nothing assigned to them
 * @type boolean
 * @on Show
 * @off Hide
 * @default false
 *
 * @param Default visibility
 * @desc Is the skillbar visible by default
 * @type boolean
 * @on Visible
 * @off Hidden
 * @default true
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This is an addon to QABS plugin. This plugin adds a skill bar to QABS.
 * ============================================================================
 * ## How to use
 * ============================================================================
 * Install this plugin somewhere below QABS.
 * ============================================================================
 * ## Toggling hud
 * ============================================================================
 * To turn on the skillbar use the plugin command:
 * ~~~
 *  QABS skillbar show
 * ~~~
 * To hide the skillbar, use:
 * ~~~
 *  QABS skillbar hide
 * ~~~
 * ============================================================================
 * ## Links
 * ============================================================================
 * RPGMakerWebs:
 *
 *  http://forums.rpgmakerweb.com/index.php?threads/qplugins.73023/
 *
 * Terms of use:
 *
 *  https://github.com/quxios/QMV-Master-Demo/blob/master/readme.md
 *
 * Like my plugins? Support me on Patreon!
 *
 *  https://www.patreon.com/quxios
 *
 * @tags QABS-Addon, hud
 */
//=============================================================================

function QABSSkillbar() {
  throw new Error('This is a static class');
}

function Sprite_Skillbar() {
  this.initialize.apply(this, arguments);
}

function Sprite_SkillInfo() {
  this.initialize.apply(this, arguments);
}

//=============================================================================
// QABS Skillbar

(function() {
  QABSSkillbar.over = false;
  QABSSkillbar.requestRefresh = false;

  var _PARAMS = QPlus.getParams('<QABSSkillbar>', true);

  var _SHOW_UNASSIGNED = _PARAMS['Show Unassigned Keys'];
  var _VISIBLE = _PARAMS['Default visibility'];

  //-----------------------------------------------------------------------------
  // Game_Interpreter

  var Alias_Game_Interpreter_qABSCommand = Game_Interpreter.prototype.qABSCommand;
  Game_Interpreter.prototype.qABSCommand = function(args) {
    var cmd = args[0].toLowerCase();
    if (cmd === 'skillbar') {
      var val = args[1].toLowerCase();
      if (val === 'show') {
        $gameSystem.showSkillbar();
      } else if (val === 'hide') {
        $gameSystem.hideSkillbar();
      }
      return;
    }
    Alias_Game_Interpreter_qABSCommand.call(this, args);
  };

  //-----------------------------------------------------------------------------
  // Game_System

  var Alias_Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function() {
    Alias_Game_System_initialize.call(this);
    this._showSkillbar = _VISIBLE;
  };

  Game_System.prototype.showSkillbar = function() {
    this._showSkillbar = true;
  };

  Game_System.prototype.hideSkillbar = function() {
    this._showSkillbar = false;
  };

  var Alias_Game_System_loadClassABSKeys = Game_System.prototype.loadClassABSKeys;
  Game_System.prototype.loadClassABSKeys = function() {
    Alias_Game_System_loadClassABSKeys.call(this);
    QABSSkillbar.requestRefresh = true;
  };

  var Alias_Game_System_changeABSSkill = Game_System.prototype.changeABSSkill;
  Game_System.prototype.changeABSSkill = function(skillNumber, skillId, forced) {
    Alias_Game_System_changeABSSkill.call(this, skillNumber, skillId, forced);
    QABSSkillbar.requestRefresh = true;
  };

  var Alias_Game_System_changeABSWeaponSkills = Game_System.prototype.changeABSWeaponSkills;
  Game_System.prototype.changeABSWeaponSkills = function(skillNumber, skillId, forced) {
    Alias_Game_System_changeABSWeaponSkills.call(this, skillNumber, skillId, forced);
    QABSSkillbar.requestRefresh = true;
  };

  var Alias_Game_System_changeABSSkillInput = Game_System.prototype.changeABSSkillInput;
  Game_System.prototype.changeABSSkillInput = function(skillNumber, input) {
    Alias_Game_System_changeABSSkillInput.call(this, skillNumber, input);
    QABSSkillbar.requestRefresh = true;
  };

  //-----------------------------------------------------------------------------
  // Game_Actor

  var Alias_Game_Actor_learnSkill = Game_Actor.prototype.learnSkill;
  Game_Actor.prototype.learnSkill = function(skillId) {
    Alias_Game_Actor_learnSkill.call(this, skillId);
    QABSSkillbar.requestRefresh = true;
  };

  var Alias_Game_Actor_forgetSkill = Game_Actor.prototype.forgetSkill;
  Game_Actor.prototype.forgetSkill = function(skillId) {
    Alias_Game_Actor_forgetSkill.call(this, skillId);
    QABSSkillbar.requestRefresh = true;
  };

  var Alias_Game_Actor_changeClass = Game_Actor.prototype.changeClass;
  Game_Actor.prototype.changeClass = function(classId, keepExp) {
    Alias_Game_Actor_changeClass.call(this, classId, keepExp);
    QABSSkillbar.requestRefresh = true;
  };

  //-----------------------------------------------------------------------------
  // Game_Player

  var Alias_Game_Player_canClick = Game_Player.prototype.canClick;
  Game_Player.prototype.canClick = function() {
    if (QABSSkillbar.over) return false;
    return Alias_Game_Player_canClick.call(this);
  };

  //-----------------------------------------------------------------------------
  // Sprite_Skillbar

  Sprite_Skillbar.prototype = Object.create(Sprite_Base.prototype);
  Sprite_Skillbar.prototype.constructor = Sprite_Skillbar;

  Sprite_Skillbar.prototype.initialize = function() {
    Sprite_Base.prototype.initialize.call(this);
    this.y = Graphics.height - 36;
    this._buttons = [];
    this._over = 0;
    this._absKeys = $gameSystem.absKeys();
    this._actorId = $gameParty.leader()._actorId;
    this.createKeys();
  };

  Sprite_Skillbar.prototype.createKeys = function() {
    if (this._buttons.length > 0) this.removeKeys();
    for (var key in this._absKeys) {
      if (!this._absKeys[key] && !_SHOW_UNASSIGNED) continue;
      var skillId = this._absKeys[key] ? this._absKeys[key].skillId : null;
      var inputs = this._absKeys[key] ? this._absKeys[key].input : null;
      var input = inputs[0];
      if (Imported.QInput) {
        for (var i = 0; i < inputs.length; i++) {
          var isGamepad = /^\$/.test(inputs[i]);
          if (Input.preferGamepad() && isGamepad) {
            input = inputs[i];
            break;
          } else if (!Input.preferGamepad() && !isGamepad) {
            input = inputs[i];
            break;
          }
        }
      }
      this.createSkill(skillId, input);
    }
	if ($gameSwitches.value(2) == true){
    var w1 = Graphics.width / 2;
    var w2 = (this._buttons.length * 36) / 2;
    this.x = 300//w1 - w2;
	this.y = 544/*w1 - w2+200*/;
	}
	else{
    var w1 = Graphics.width / 2;
    var w2 = (this._buttons.length * 36) / 2;
    this.x = 99999//w1 - w2;
	this.y = 99999/*w1 - w2+200*/;
	}
  };

  Sprite_Skillbar.prototype.removeKeys = function() {
    for (var i = this._buttons.length - 1; i >= 0; i--) {
      this.removeChild(this._buttons[i]);
      this._buttons.splice(i, 1);
    }
  };

  Sprite_Skillbar.prototype.createSkill = function(skillId, input) {
    var button = new Sprite_Button();
    // Black box under icon
    button._frame = this.createButtonFrame();
    button.addChild(button._frame);
    // Skill Icon
    button._icon = this.createButtonIcon(skillId);
    button.addChild(button._icon);
    // Black box over icon, size changes based off cooldown
    button._cooldown = this.createButtonFrame();
    button._cooldown.alpha = 0.5;
    button._cooldown.height = 0;
    button.addChild(button._cooldown);
    // Hover frame
    button._hover = this.createButtonHover();
    button._hover.alpha = 0;
    button.addChild(button._hover);
    // Skill Key text
    //button._input = this.createButtonInput(input);
    //button.addChild(button._input);
    // Skill info
    if (skillId) {
      button._info = new Sprite_SkillInfo(skillId);
      button.addChild(button._info);
    }
    var x = 36 * this._buttons.length;
    button.x = x;
    button._skillId = skillId;
    button.setClickHandler(this.onButtonDown.bind(this, skillId));
    this._buttons.push(button);
    this.addChild(button);
  };

  Sprite_Skillbar.prototype.createButtonFrame = function() {
    var frame = new Sprite();
    frame.bitmap = new Bitmap(34, 34);
    frame.bitmap.fillAll('#000000');
    frame.alpha = 0.3;
    return frame;
  };

  Sprite_Skillbar.prototype.createButtonIcon = function(skillId) {
    var skill = $dataSkills[skillId];
    var icon = new Sprite_Icon(skill ? skill.iconIndex : 0);
    if (!skill || (!$gameParty.leader().isLearnedSkill(skillId) &&
        !$gameParty.leader().addedSkills().contains(skillId))) {
      icon.alpha = 0.5;
    }
    return icon;
  };

  Sprite_Skillbar.prototype.createButtonHover = function() {
    var frame = new Sprite();
    frame.bitmap = new Bitmap(34, 34);
    var color1 = 'rgba(255, 255, 255, 0.9)';
    var color2 = 'rgba(255, 255, 255, 0)';
    frame.bitmap.gradientFillRect(0, 0, 8, 34, color1, color2);
    frame.bitmap.gradientFillRect(26, 0, 8, 34, color2, color1);
    frame.bitmap.gradientFillRect(0, 0, 34, 8, color1, color2, true);
    frame.bitmap.gradientFillRect(0, 26, 34, 8, color2, color1, true);
    return frame;
  };

  Sprite_Skillbar.prototype.createButtonInput = function(input) {
    var sprite = new Sprite();
    if (!input) return sprite;
    sprite.bitmap = new Bitmap(34, 34);
    input = input.replace('#', '');
    input = input.replace('$', '');
    input = input.replace('mouse', 'M');
    sprite.bitmap.fontSize = 14;
    sprite.bitmap.drawText(input, 2, 8, 34, 34, 'enter');
    return sprite;
  };

  Sprite_Skillbar.prototype.onButtonDown = function(skillId) {
    if (!skillId) return;
    $gamePlayer.useSkill(skillId);
  };

  Sprite_Skillbar.prototype.onButtonHover = function(button) {
    var twoAmp = 1;
    var count = button._count * 0.02;
    var newAlpha = 0.9 - Math.abs(count % twoAmp - (twoAmp / 2));
    button._hover.alpha = newAlpha;
    if (button._info) button._info.alpha = 1;
  };

  Sprite_Skillbar.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    if (!$gameSystem._showSkillbar) {
      QABSSkillbar.over = false;
      this.visible = false;
      return;
    }
    if (this.needsRefresh()) {
      this.createKeys();
    }
    this._over = 0;
    for (var i = 0; i < this._buttons.length; i++) {
      this.updateButton(this._buttons[i]);
    }
    QABSSkillbar.over = this._over > 0;
  };

  Sprite_Skillbar.prototype.updateButton = function(button) {
    if (button.isButtonTouched()) {
      this.onButtonHover(button);
      button._count++;
      this._over++;
    } else {
      button._count = 0;
      button._hover.alpha = 0;
      if (button._info) button._info.alpha = 0;
    }
    var skillId = button._skillId;
    if (!skillId) return;
    var cd = $gamePlayer._skillCooldowns[skillId];
    if (cd) {
      var settings = QABS.getSkillSettings($dataSkills[skillId]);
      var newH = cd / settings.cooldown;
      button._cooldown.height = 34 * newH;
    } else {
      button._cooldown.height = 0;
    }
  };

  Sprite_Skillbar.prototype.needsRefresh = function() {
    if (this._actorId !== $gameParty.leader()._actorId) {
      this._actorId = $gameParty.leader()._actorId;
      this._absKeys = $gameSystem.absKeys();
      return true;
    }
    if (QABSSkillbar.requestRefresh) {
      QABSSkillbar.requestRefresh = false;
      this._absKeys = $gameSystem.absKeys();
      return true;
    }
    if (Imported.QInput && this._preferGamePad !== Input.preferGamepad()) {
      this._preferGamePad = Input.preferGamepad();
      return true;
    }
  };

  //-----------------------------------------------------------------------------
  // Sprite_SkillInfo

  Sprite_SkillInfo.prototype = Object.create(Sprite_Base.prototype);
  Sprite_SkillInfo.prototype.constructor = Sprite_SkillInfo;

  Sprite_SkillInfo.prototype.initialize = function(skillId) {
    Sprite_Base.prototype.initialize.call(this);
    this.width = 500;
    this.height = 250;
    this.y = -this.height;
	this.x = -this.width/2
    this._skillId = skillId;
    this._skill = $dataSkills[skillId];
    if (!this._skill) return;
    this.createBackground();
    this.drawInfo();
  };

  Sprite_SkillInfo.prototype.createBackground = function() {
    this.bitmap = new Bitmap(this.width, this.height);
    this.bitmap.fillAll('rgba(0, 0, 0, 0.8)');
  };

  Sprite_SkillInfo.prototype.drawInfo = function() {
    /*this._realHeight = 4;
    // Draw the details
    this.drawName(0, 0);
    this.drawIcon(0, 36);
    this.drawAbsSettings(40, 36);
    this.drawDescription(4, this._realHeight);
    this.drawLine(this._realHeight + 2);
    this.drawData(4, this._realHeight);
    // Resize to fit height
    this.height = this._realHeight + 4;
    this.y = -this.height;*/
	this._realHeight = 4;
    // Draw the details
	this.drawLineOutH(0);
	this.drawLineOutS(0)
	this.drawLineOutSS(0)
    this.drawName(1, 10);
	this.drawIcon(30, 12);
    //this.drawIcon(2, 36);
	this.drawLine(this._realHeight + 6);
    this.drawAbsSettings(20, 60);
	this.drawLine(this._realHeight + 2);
    this.drawDescription(4, this._realHeight);
    this.drawLine(this._realHeight + 0);
    this.drawData(4, this._realHeight + 8);
	this.drawLineOutH(this._realHeight + 8);
    // Resize to fit height
    this.height = this._realHeight + 3;
    this.y = -this.height;
  };

  Sprite_SkillInfo.prototype.drawName = function(x, y) {
    this.bitmap.fontSize = 24;
    this.bitmap.textColor = '#ffffa0';
    this.bitmap.drawText(this._skill.name, x+72, y, this.width, 36, 'left');
    this._realHeight = Math.max(y + 24, this._realHeight);
  };

  Sprite_SkillInfo.prototype.drawIcon = function(x, y) {
    var iconIndex = this._skill.iconIndex;
    var bitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
    var sx = iconIndex % 16 * pw;
    var sy = Math.floor(iconIndex / 16) * ph;
    this.bitmap.blt(bitmap, sx, sy, pw, ph, x, y);
    this._realHeight = Math.max(y + 32, this._realHeight);
  };

  Sprite_SkillInfo.prototype.drawAbsSettings = function(x, y) {
    var abs = QABS.getSkillSettings(this._skill);
    var w = this.width - x - 4; // 4 is padding
    this.bitmap.fontSize = 14;
    var cooldown = abs.cooldown / 60;
    var range = abs.range;
    var mpCost = this._skill.mpCost;
    var tpCost = this._skill.tpCost;
    var i = 0;
    var l = 18; // line height
    if (cooldown !== 0) {
      this.bitmap.textColor = "#ffffa0";
      var w2 = this.bitmap.measureTextWidth(cooldown);
      this.bitmap.drawText("冷却时间: ", x, y + l * i, w, l, "left");
      this.bitmap.textColor = "#ffffff";
	  	var cd = cooldown * (100/($gameVariables.value(42)+100))
	    cd = cd.toFixed(2)
      this.bitmap.drawText(cd, 96, y + l * i, w, l, "left");
	  this.bitmap.textColor = "#ffffa0";
	  this.bitmap.drawText("秒", 144, y + l * i, w, l, "left");
	  this.bitmap.textColor = "#ffffa0";
      i++;
    }
    if (range !== 0) {
      this.bitmap.textColor = "#ffffa0";
      var w2 = this.bitmap.measureTextWidth(range);
      this.bitmap.drawText("技能范围: ", x - 1, y + l * i, w, l, "left");
      this.bitmap.textColor = "#ffffff";
      this.bitmap.drawText(range, 96, y + l * i, w, l, "left");
	  this.bitmap.textColor = "#ffffa0";
	  this.bitmap.drawText("Px", 144, y + l * i, w, l, "left");
      i++;
    }
    if (mpCost!== 0) {
      this.bitmap.textColor = "#ffffa0";
      var w2 = this.bitmap.measureTextWidth(mpCost);
      this.bitmap.drawText(TextManager.mpA + "消耗:", x, y + l * i, w, l, "left");
      this.bitmap.textColor = "#ffffff";
      this.bitmap.drawText(mpCost, 96, y + l * i, w, l, "left");
      i++;
    }
    if (tpCost!== 0) {
      this.bitmap.textColor = "#ffffa0";
      var w2 = this.bitmap.measureTextWidth(tpCost);
      this.bitmap.drawText(TextManager.tpA + " 消耗:", x, y + l * i, w, l, "left");
      this.bitmap.textColor = "#ffffff";
      this.bitmap.drawText(tpCost, 96, y + l * i, w, l, "left");
      i++;
    }
    this._realHeight = Math.max(y + (i * l), this._realHeight);
  };

  Sprite_SkillInfo.prototype.drawDescription = function(x, y) {
    this.bitmap.fontSize = 16;
    this.bitmap.textColor = '#ffffa0';
    this.bitmap.drawText('   ', x, y, this.width, 18, 'left');
    var desc = this._skill.description;
    var settings = {
      fontName: 'GameFont',
      fontSize: 14,
	  fontAlign: 'center',
      fill: '#ffffff',
      stroke: 'rgba(0, 0, 0, 0.5)',
      strokeThickness: 4,
      wordWrap: false,
      wordWrapWidth: this.width + 10086,
      lineHeight: 18
    }
    this._desc = new PIXI.Text(desc, settings);
    this._desc.x = x + 12;
    this._desc.y = y - 1;
    this.addChild(this._desc);
    this._realHeight = Math.max(y + this._desc.height, this._realHeight);
  };

  Sprite_SkillInfo.prototype.drawLine = function(y) {
    this.bitmap.fillRect(2, y, this.width - 4, 2, 'rgba(255, 255, 255, 0.8)');
    this._realHeight = Math.max(y + 4, this._realHeight);
  };
    Sprite_SkillInfo.prototype.drawLineOutH = function(y) {
    this.bitmap.fillRect(0, y, this.width, 3, "rgba(212, 190, 71, 0.8)");
    this._realHeight = Math.max(y, this._realHeight);
  };
	
  Sprite_SkillInfo.prototype.drawLineOutS = function(x) {
    this.bitmap.fillRect(x, 0, 3, this.height, "rgba(212, 190, 71, 0.8)");
    this._realHeight = Math.max(x, 0);
  };
  
    Sprite_SkillInfo.prototype.drawLineOutSS = function(x) {
    this.bitmap.fillRect( 497 , 0, 3, this.height, "rgba(212, 190, 71, 0.8)");
    this._realHeight = Math.max(x, 0);
  };
  
  Sprite_SkillInfo.prototype.drawLine = function(y) {
    this.bitmap.fillRect(24, y, this.width - 36, 1, "rgba(255, 255, 255, 0.3)");
    this._realHeight = Math.max(y + 4, this._realHeight);
  };

  Sprite_SkillInfo.prototype.drawData = function(x, y) {
    var w = this.width - x - 4; // 4 is padding
    this.bitmap.fontSize = 18;
    var formula = this._skill.damage.formula;
    formula = formula.replace(/b.(\w+)/g, '0');
    var a = $gamePlayer.actor();
    var v = $gameVariables._data;
    var dmg = eval(formula);
    var i = 0;
    var l = 18; // line height
    if (dmg !== 0 && this._skill.damage.type !== 0) {
      this.bitmap.textColor = '#ffffa0';
      var title;
      if (this._skill.damage.type === 1) {
        title = '  伤害: ';
      } else if (this._skill.damage.type === 2) {
        title = '  伤害（MP）: ';
      } else if (this._skill.damage.type === 3) {
        title = '  恢复: ';
      } else if (this._skill.damage.type === 4) {
        title = '  恢复（MP）: ';
      }
      this.bitmap.drawText(title, x+48, y + l * i, w, l, 'left');
      this.bitmap.textColor = '#ffffff';
      var w2 = this.bitmap.measureTextWidth(title);
      this.bitmap.drawText(parseInt(dmg)/*取整*/, x + w2, y + l * i, w, l, 'left');
      i++;
    }
    // Write the effects:
    this._realHeight = Math.max(y + (i * l), this._realHeight);
  };

  //-----------------------------------------------------------------------------
  // Scene_Map

  var Alias_Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
  Scene_Map.prototype.createAllWindows = function() {
    Alias_Scene_Map_createAllWindows.call(this);
    this.createABSKeys();
  };

  Scene_Map.prototype.createABSKeys = function() {
    this._absSkillBar = new Sprite_Skillbar();
    this.addChild(this._absSkillBar);
  };
})();
