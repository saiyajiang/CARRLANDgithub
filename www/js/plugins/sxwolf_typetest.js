//--
/*:
* @plugindesc 用来测试教程学到的内容
* @param 内容
* @desc 想看什么内容的教程？
* 默认：什么都不想看
* @default 0
*
* @author 神仙狼
* @help 暂时啥也没有
*/
//--
 
var sxwolf = PluginManager.parameters('sxwolf_typetest'); //有这一行，“sxwolf”才能调用前面写的插件参数，括号中是插件的名称，填错无法使用插件参数

var lesson = String(sxwolf[ '内容'||0 ]);//String 规定为字串，Number规定为数字，赋值lesson为sxwolf的插件参数，括号里||前面为参数名称，||后面为默认值。

var sxwolf_interpreterCommand = Game_Interpreter.prototype.pluginCommand;//程序别名
Game_Interpreter.prototype.pluginCommand = function(command, args){//这行是原生插件中用来定义插件命令的语句，复制即可
	
	sxwolf_interpreterCommand.apply(this);//程序别名沿用原先的插件命令项，相当于把下面的内容放入原生程序相应部分
	
	if(command == '把变量100'){//插件命令第一个单词
		switch(args[0]){
			case '改为100'://插件命令第二个单词，不要忘记打冒号
			$gameVariables.setValue(100, 100);//执行的语句
			break;
		}
	}
	
}

// /*
 // 赋值 变量a=1
 // var a = 2
 // var b = Math.floor(3.15); //取整
 // var c = Math.round(3.7);  //四舍五入
 // var d = Math.random();    //0到1之间的随机值
 
 // 自定函数 名字test 有一个变量叫sxwolf
 // function test( sxwolf ){
	 // console.log( '欢迎来到加尔蓝大陆！' + sxwolf );
 // }
 // 调用自定函数 把sxwolf替换为变量a，同时让a+1
 // test(a);
 
 // 判断
 // /*
 // ==   等于
 // >    大于
 // <    小于
 // >=   大于等于
 // <=   小于等于
 // &&   同时满足（and）
 // ||   满足某一个（or）
 // !=   不等于
 // */
 
 // 如果a=1 则调用自定义函数，让a替换sxwolf
 // if(a == 1){
	  // test(a);
 // }else{//否则报出有问题
	 // console.log( '有问题！' );
 // };
 // /*
  // if(a == 1){
	  // test(a);
 // }else if() {//另一种情况
	 // console.log( '有问题！' );
 // }else{//如果都不满足则会执行这个
 // };
 // */
 
 // 三元运算式(a==1) ? a=1 : a=2 ;
 
 // var hp=100
 // 在hp变量各种情况下执行的脚本
 // switch(hp){
	 // case 0
	 // 如果hp这个变量是0则执行
	 // console.log('你死了')；
	 // 结束这个case用break
	 // break;
	 // 如果所有case都没达成，则会自动运行default
	 // default:
	 // console.log('血量充足，你还活着')；
	 // break;
 // }
 
 // while循环------------------------------------------
 // while循环，先执行后判断
 // do{
	// 循环内容
 // }while(/*条件*/);
 
  // while循环，先判断后执行
 // while(/*条件*/){
	 // 循环内容
	 
 // }
 
 // for循环----------------------------------------------------------------
 // for循环小括号有三级内容：
 // 第一级宣告变量
 // 第二级条件判定
 // 第三级在条件范围内所做的动作
 // for( var i = 0; i < 10 ; i++){
	 // 循环的内容
	 
 // }

 // 阵列------------------------------------------------------------------
 // 宣告阵列名称为str_ary
 // var str_ary = ['第一个', '第二个', '第三个', '第四个'];
 
 
 // push：用str_ary(阵列名称).push来在阵列中加入一个元素，排序在最后
 // str_ary.push('第五个');
 
 // pop: 将最后一个元素删减
 // str_ary.pop();
 
 // elements:将排序第一百个赋指定值，中途空的地方会显示为undefined
 // str_ary[100] = '我是第一百零一个！'
 
 // 取 阵列 str_ary 的第一个（元素编号从0开始）
 // console.log( str_ary[0] );
 
 
 // for循环 ，宣告i=0，如果i小于str_ary的阵列数量，则i+1
 // for(var i = 0; i < str_ary.length; i++){
	 // 循环内容，显示出str_ary的第i项，默认来说从0开始。
     // console.log( str_ary[i] )
 // }
 
 // toString()：将阵列显示为字串
 // console.log( str_ary.toString() ) //将str_ary的所有元素显示为字串，显示效果为“第一个,第二个,第三个,第四个……”

  // sort()：正向排列字符串  reverse()反向排列
 // console.log( str_ary.sort() ); //将str_ary所有元素正向排列
 // console.log( str_ary.sort() ); //将str_ary所有元素反向排列
 
 // 宣告一个名叫str_ary_string_1的阵列，赋值为str_ary转化来的字串
 // var str_ary_string_1 = str_ary.toString()
 // var str_ary_string_2 = str_ary.toString()
 // 比较两个字符串，一样，或者不一样
 // if(str_ary_string_1 == str_ary_string_2 ){
	 // console.log( ' 这两个字符串一样！' )
 // };else{
	 // console.log( ' 这两个字符串不一样！' )
 // }
 
 
 // 二维阵列
 
 // var ary = []
 // for (var i = 0; i < 4; i++){
	 // ary[i] = [];//阵列中宣告二维阵列初始
	 // for ( var j = 0; j < 4; j++){
		 // ary[i][j]='['+i+','+j+']'
		 // console.log(a[i][j]);
	 // }
 // }