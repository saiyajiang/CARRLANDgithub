/*:
 * @plugindesc 
 */

(function(){
	var carrland_fixmovespeed = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function() {
		carrland_fixmovespeed.call(this);
		if($gamePlayer.isLocked == true){
			$gamePlayer._moveSpeed = Math.min(4+$gameVariables.value(56)*0.5,6);
		}else{

		};
	};
})();