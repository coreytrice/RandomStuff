var	  alphNum	= 'abcdefghijklmnopqrstuvwxyz0123456789'
	, result	= ''
	, length	= 16
;

for(var i = length; i > 0; --i){
	result += alphNum[Math.round(Math.random() * (alphNum.length - 1))];
}