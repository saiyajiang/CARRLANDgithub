/*:
 * @plugindesc 判定角色装备决定是否可以使用技能
 * @param 拳类型技能
 * @desc 拳类型的技能
 */
 
Carrland = PluginManager.parameters('Carrland_Qabs_Weapontype');

var Carrland_Weapontype_0 = String(Carrland['拳类型技能']);



var Skill_Weapon_0 = Carrland_Weapontype_0.split(',');


// if($gameVariables.value(72) == 0){
	// for(var i=0; i<noweapon.length; i++){
	// $gameActors.actor($gameVariables.value(1)).learnSkill(noweapon[0]);		
	// }

// }else{
	// for(var i=0; i<noweapon.length; i++){
	// $gameActors.actor($gameVariables.value(1)).forgetSkill(noweapon[0]);
	// }
// }

// var skill_0 = [252];
// if ($gameVariables.value(72) == 0){
	// var i = 0
	// $gameActors.actor($gameVariables.value(1)).learnSkill(skill_0[0]);
	// if (i<skill_0.legth){i++};
// }else{
	// var i = 0
	// $gameActors.actor($gameVariables.value(1)).forgetSkill(skill_0[0]);
	// if (i<skill_0.legth){i++};
// }