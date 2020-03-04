//-----------------------------------------------------------------------------
// 2D Fixed Direction (Horizontal)
/*:
 * @plugindesc Only allows player to face left or right (even when moving up or down). Example uses Platformer or Brawler/Beat'em Ups.
 * @author Quasi      Site: http://quasixi.com
 * @help This plugin does not provide plugin commands.
 */
(function() {
    Game_CharacterBase.prototype.moveStraight = function(d) {
        this.setMovementSuccess(this.canPass(this._x, this._y, d));
        if (this.isMovementSucceeded()) {
            if (d === 4 || d === 6) this.setDirection(d);
            this._x = $gameMap.roundXWithDirection(this._x, d);
            this._y = $gameMap.roundYWithDirection(this._y, d);
            this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(d));
            this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(d));
            this.increaseSteps();
        } else {
            if (d === 4 || d === 6) this.setDirection(d);
            this.checkEventTriggerTouchFront(d);
        }
    };
    Game_CharacterBase.prototype.moveDiagonally = function(horz, vert) {
        this.setMovementSuccess(this.canPassDiagonally(this._x, this._y, horz, vert));
        if (this.isMovementSucceeded()) {
            this._x = $gameMap.roundXWithDirection(this._x, horz);
            this._y = $gameMap.roundYWithDirection(this._y, vert);
            this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(horz));
            this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(vert));
            this.increaseSteps();
        }
        if (this._direction === this.reverseDir(horz)) {
            this.setDirection(horz);
        }
    };
}());