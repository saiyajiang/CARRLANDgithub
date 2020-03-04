//--
/*:
* @plugindesc 用来调整状态界面（无法直接适用于其他工程。）
* @param 系统字色
* @desc 系统字的颜色（十六进制色）
* 默认：#ffffff
* @default #ffffff
*
* @author 神仙狼
* @help 其他工程不能直接用！不能！
*/
//--


var sxwolf = PluginManager.parameters('sxwolf_status');	
var systemcolor = String(sxwolf[ '系统字色'||'#ffffff' ])
	
Window_Base.prototype.drawItemNameStatus = function(item, wx, wy, ww) {
    ww = ww || 312;
    this.setItemTextColor(item);
    Yanfly.Item.Window_Base_drawItemName.call(this, item, wx, wy, 400);
    this._resetTextColor = undefined;
    this.resetTextColor();
};

 Window_Base.prototype.drawActorNameStatus = function(actor, x, y, width,lineHeight,align) {
    width = width || 168;
	this.contents.fontSize = 28
    this.drawText('角色状态', 0, 6, 128 ,'center');
	this.contents.fontSize = this.standardFontSize();
	var lineHeight = this.standardFontSize()+ 12
    this.changeTextColor(this.hpColor(actor));
	this.contents.fontSize = 28
    this.drawText(actor.name(), x, y, width,lineHeight ,'center');
	this.contents.fontSize = this.standardFontSize();
	
};


 //划分区域
 Window_Status.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        var lineHeight = this.lineHeight();
        this.drawBlock1(lineHeight * 1);
        //this.drawHorzLine(lineHeight * 1);
        this.drawBlock2(lineHeight * 2);
        this.drawBlock3(lineHeight * 7);
       // this.drawHorzLine(lineHeight * 13);
        this.drawBlock4(lineHeight * 14);
    }
};
//$gameActors.actor($gameParty.leader()).name//名字
Window_Status.prototype.drawBlock1 = function(y) {
	var width = Graphics.boxWidth;

    //this.drawActorNickname(this._actor, 432, y+96);
};
/*Window_Status.prototype.drawBasicInfo = function(x, y) {

};*/

Window_Status.prototype.drawBlock2 = function() {
	var y= 50
	this.drawActorFace(this._actor, 24, y+12);
	//this.drawText($gameActors.actor(1).name, 0, y+i*lineheight, 160);
    this.drawActorNameStatus(this._actor, 172, y+12,'center');
    this.drawActorClass( this._actor , 172, y+48);
    var lineHeight = this.lineHeight();
    this.drawActorLevel(this._actor, 296, y+48 + lineHeight * 0);
    //this.drawActorIcons(this._actor, x, y + lineHeight * 1);
    this.drawActorHp(this._actor, 172, y+48 + lineHeight * 1);
    this.drawActorMp(this._actor, 172, y+48 + lineHeight * 2);
	this.drawHorzLine(y+48+lineHeight*2+42);
    //this.drawExpInfo(456, y);
};

Window_Status.prototype.drawEquipments = function() {
	var x= 24
	var xequip = 60
	var y= 250
	var xr = 30
	var line=0
	var lineheight = 36
    var equips = this._actor.equips();
    //var count = Math.min(equips.length, this.maxEquipmentLines());
	this.changeTextColor(systemcolor);
	this.drawText('武器', x, y, 0, 'left');
	this.drawItemNameStatus(equips[0], x+xequip, y);//武器
	line += 1
	this.changeTextColor(systemcolor);
	this.drawText('盾牌', x, y+line*lineheight, 'left');
	this.drawItemNameStatus(equips[1], x+xequip, y+line*lineheight);//盾牌
	line += 1
	this.changeTextColor(systemcolor);
	this.drawText('头部', x, y+line*lineheight, y+line*lineheight, 'left');
	this.drawItemNameStatus(equips[2], x+xequip, y+line*lineheight);//头盔.
	line += 1
	this.changeTextColor(systemcolor);
	this.drawText('身体', x, y+line*lineheight, y+line*lineheight, 'left');
	this.drawItemNameStatus(equips[3], x+xequip, y+line*lineheight);//身体
	line += 1
	this.changeTextColor(systemcolor);
	this.drawText('戒指', x, y+line*lineheight, y+line*lineheight, 'left');
	this.drawItemNameStatus(equips[4], x+xequip, y+line*lineheight);//戒指
    line += 1
	this.changeTextColor(systemcolor);
	this.drawText('项链', x, y+line*lineheight, y+line*lineheight, 'left');
	this.drawItemNameStatus(equips[5], x+xequip, y+line*lineheight);//项链
	line += 1
	this.changeTextColor(systemcolor);
	this.drawText('宝石', x, y+line*lineheight, y+line*lineheight, 'left');
	this.drawItemNameStatus(equips[6], x+xequip, y+line*lineheight);//宝石
	line += 1
	this.changeTextColor(systemcolor);
	this.drawText('称号', x, y+line*lineheight, y+line*lineheight, 'left');
	this.drawItemNameStatus(equips[7], x+xequip, y+line*lineheight);//称号
    /*for (var i = 0; i < count; i++) {
        
    }*/
};
 //状态数值界面：
 var sxwolf_status_drawParameters = Window_Status.prototype.drawParameters; //设置程序别名
 Window_Status.prototype.drawParameters = function(x, y) {
	 x = 480
	 var lines = 0
	 var lineheight = 36
	 for(i=0;i<8;i++){//基础属性
	 this.changeTextColor(systemcolor);
     this.drawText(TextManager.param(i)+':', x, y+i*lineheight, 160);
	 this.changeTextColor('#ffffff');
	 this.drawText(this._actor.param(i), x + 128, y+i*lineheight, 0, 'left');
	 }
	 //附加属性
	 ////////////////////////////////////////////////////////////////////////////////////////
	 ////////////////////////////////////////////////////////////////////////////////////////
	 this.changeTextColor(systemcolor);
	 this.drawText(TextManager.param(9), x+192, y, 0);//韧性
	 if(this._actor.xparam(1)>=0){
		 this.changeTextColor('#80FF80');
	 }else{
		 this.changeTextColor('#C08080');
	 }
	 this.drawText(':'+ ((this._actor.xparam(1)>=0)?'+':'') + Math.floor(this._actor.xparam(1)*100)+'%', x + 128+192, y, 0, 'left');
	 ///////////////////////////////////////////////////////////////////////////////////////
	 lines += 1
	 this.changeTextColor(systemcolor);
	 this.drawText('暴击率', x+192, y+lineheight*lines, 0);//暴击率
	 if(this._actor.xparam(2)>=0){
		 this.changeTextColor('#80FF80');
	 }else{
		 this.changeTextColor('#C08080');
	 }
	 this.drawText(':'+ ((this._actor.xparam(2)>=0)?'+':'') + Math.floor(this._actor.xparam(2)*100)+'%', x + 128+192, y+lineheight*lines, 0, 'left');
	 ////////////////////////////////////////////////////////////////////////////////////////
	 lines += 1
	 this.changeTextColor(systemcolor);
	 this.drawText('攻击速度', x+192, y+lineheight*lines, 0);//攻速
	 if($gameVariables.value(41)>=0){
		 this.changeTextColor('#80FF80');
	 }else{
		 this.changeTextColor('#C08080');
	 }
	 this.drawText(':'+ (($gameVariables.value(41)>=0)?'+':'') + Math.floor($gameVariables.value(41)) +'%', x + 128+192, y+lineheight*lines, 0, 'left');
	 //////////////////////////////////////////////////////////////////////////////////////////
	 lines += 1
	 this.changeTextColor(systemcolor);
	 this.drawText('吟唱速度', x+192, y+lineheight*lines, 0);//吟唱
	 if($gameVariables.value(57)>=0){
		 this.changeTextColor('#80FF80');
	 }else{
		 this.changeTextColor('#C08080');
	 }
	 this.drawText(':'+ (($gameVariables.value(57)>=0)?'+':'') +  Math.floor($gameVariables.value(57)) +'%', x + 128+192, y+lineheight*lines, 0, 'left');
	 //////////////////////////////////////////////////////////////////////////////////////////
	 lines += 1
	 this.changeTextColor(systemcolor);
	 this.drawText('冷却缩减', x+192, y+lineheight*lines, 0);//冷却
	 if($gameVariables.value(42)>=0){
		 this.changeTextColor('#80FF80');
	 }else{
		 this.changeTextColor('#C08080');
	 }
	 this.drawText(':'+ (($gameVariables.value(42)>=0)?'+':'') +  Math.floor($gameVariables.value(42)) +'%', x + 128+192, y+lineheight*lines, 0, 'left');
	 /////////////////////////////////////////////////////////////////////////////////////////
	 lines += 1
	 this.changeTextColor(systemcolor);
	 this.drawText('寻宝概率', x+192, y+lineheight*lines, 0);//寻宝
	 if($gameVariables.value(49)>=0){
		 this.changeTextColor('#80FF80');
	 }else{
		 this.changeTextColor('#C08080');
	 }
	 this.drawText(':'+ (($gameVariables.value(49)>=0)?'+':'') + Math.floor($gameVariables.value(49)) + '%', x + 128+192, y+lineheight*lines, 0, 'left');
	 /////////////////////////////////////////////////////////////////////////////////////////
	 lines += 1
	 this.changeTextColor(systemcolor);
	 this.drawText('金币掉落', x+192, y+lineheight*lines, 0);//金币
	 	 if($gameVariables.value(45)>=0){
		 this.changeTextColor('#80FF80');
	 }else{
		 this.changeTextColor('#C08080');
	 }
	 this.drawText(':'+ (($gameVariables.value(45)>=0)?'+':'')+ Math.floor($gameVariables.value(45)) +'%', x + 128+192, y+lineheight*lines, 0, 'left');
	 /////////////////////////////////////////////////////////////////////////////////////////
	 lines += 1
	 this.changeTextColor(systemcolor);
	 this.drawText('经验倍率', x+192, y+lineheight*lines, 0);//经验倍率
	 	 if(this._actor.sparam(9)>=0){
		 this.changeTextColor('#80FF80');
	 }else{
		 this.changeTextColor('#C08080');
	 }
	 this.drawText(':' + Math.floor(this._actor.sparam(9)*100) +'%', x + 128+192, y+lineheight*lines, 0, 'left');
	 
	 /////////////////////////////////////////////////////////////////////////////////////////
	 //属性抗性
	 /////////////////////////////////////////////////////////////////////////////////////////
	 var xe = 480
	 var xer = 192
	 var ye = 46
	 var linee= 0
	 var lineeheight = 32
	 var e=1
	 /////////////////////////////////////////////////////////////////////////////////////////
     this.changeTextColor(systemcolor);
	 this.drawText('混沌:', xe, ye+lineeheight*linee, 0);
	 if(this._actor.elementRate(e)<=1){
		 this.changeTextColor('#80FF80');
	 }else{
		 this.changeTextColor('#C08080');
	 }
	 this.drawText( Math.floor(this._actor.elementRate(e)*100) +'%', xe + 128, ye+lineeheight*linee, 0, 'left');
	 linee += 1
	 e += 1 
	/////////////////////////////////////////////////////////////////////////////////////////
	 this.changeTextColor(systemcolor);
	 this.drawText('炎:', xe, ye+lineeheight*linee, 0);
	 if(this._actor.elementRate(e)<=1){
		 this.changeTextColor('#80FF80');
	 }else{
		 this.changeTextColor('#C08080');
	 }
	 this.drawText( Math.floor(this._actor.elementRate(e)*100) +'%', xe + 128, ye+lineeheight*linee, 0, 'left');
	 linee += 1
     e += 1 
	/////////////////////////////////////////////////////////////////////////////////////////
	 this.changeTextColor(systemcolor);
	 this.drawText('冰:', xe, ye+lineeheight*linee, 0);
	 if(this._actor.elementRate(e)<=1){
		 this.changeTextColor('#80FF80');
	 }else{
		 this.changeTextColor('#C08080');
	 }
	 this.drawText( Math.floor(this._actor.elementRate(e)*100) +'%', xe + 128, ye+lineeheight*linee, 0, 'left');
	 linee += 1
     e += 1 
	/////////////////////////////////////////////////////////////////////////////////////////
	 this.changeTextColor(systemcolor);
	 this.drawText('雷:', xe, ye+lineeheight*linee, 0);
	 if(this._actor.elementRate(e)<=1){
		 this.changeTextColor('#80FF80');
	 }else{
		 this.changeTextColor('#C08080');
	 }
	 this.drawText( Math.floor(this._actor.elementRate(e)*100) +'%', xe + 128, ye+lineeheight*linee, 0, 'left');
	 linee += 1
     e += 1 
	 /////////////////////////////////////////////////////////////////////////////////////////
	 this.changeTextColor(systemcolor);
	 this.drawText('水:', xe, ye+lineeheight*linee, 0);
	 if(this._actor.elementRate(e)<=1){
		 this.changeTextColor('#80FF80');
	 }else{
		 this.changeTextColor('#C08080');
	 }
	 this.drawText( Math.floor(this._actor.elementRate(e)*100) +'%', xe + 128, ye+lineeheight*linee, 0, 'left');
	 linee += 2
     e += 1 
	/////////////////////////////////////////////////////////////////////////////////////////
	 this.changeTextColor(systemcolor);
	 this.drawText('土:', xe+xer, ye+lineeheight*(linee-5), 0);
	 if(this._actor.elementRate(e)<=1){
		 this.changeTextColor('#80FF80');
	 }else{
		 this.changeTextColor('#C08080');
	 }
	 this.drawText( Math.floor(this._actor.elementRate(e)*100) +'%', xe+xer + 128, ye+lineeheight*(linee-5), 0, 'left');
	 linee += 1
     e += 1 
	/////////////////////////////////////////////////////////////////////////////////////////
	 this.changeTextColor(systemcolor);
	 this.drawText('风:', xe+xer, ye+lineeheight*(linee-5), 0);
	 if(this._actor.elementRate(e)<=1){
		 this.changeTextColor('#80FF80');
	 }else{
		 this.changeTextColor('#C08080');
	 }
	 this.drawText( Math.floor(this._actor.elementRate(e)*100) +'%', xe+xer + 128, ye+lineeheight*(linee-5), 0, 'left');
	 linee += 1
     e += 1 
	/////////////////////////////////////////////////////////////////////////////////////////
	 this.changeTextColor(systemcolor);
	 this.drawText('光:', xe+xer, ye+lineeheight*(linee-5), 0);
	 if(this._actor.elementRate(e)<=1){
		 this.changeTextColor('#80FF80');
	 }else{
		 this.changeTextColor('#C08080');
	 }
	 this.drawText( Math.floor(this._actor.elementRate(e)*100) +'%', xe +xer+ 128, ye+lineeheight*(linee-5), 0, 'left');
	 linee += 1
     e += 1 
	/////////////////////////////////////////////////////////////////////////////////////////
	 this.changeTextColor(systemcolor);
	 this.drawText('暗:', xe+xer, ye+lineeheight*(linee-5), 0);
	 if(this._actor.elementRate(e)<=1){
		 this.changeTextColor('#80FF80');
	 }else{
		 this.changeTextColor('#C08080');
	 }
	 this.drawText( Math.floor(this._actor.elementRate(e)*100) +'%', xe+xer + 128, ye+lineeheight*(linee-5), 0, 'left');

	 /////////////////////////////////////////////////////////////////////////////////////////
	 /////////////////////////////////////////////////////////////////////////////////////////
    }
	

	