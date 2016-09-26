var exports = module.exports = {};
var esprima = require('esprima')

function handleBody(body,env) {
    var reduced = [];
    for(var stmt of body) {
	var s = handle(stmt,env);
	if(s!="") reduced.push(s);
    }
    return reduced.map(function (x) { return x+";" }).join('');
}
function handleProgram(p,env) {
    return handleBody(p.body,env);
}
function handleExpressionStatement(e,env) {
    return handle(e.expression,env);
}
function handleBinaryExpression(e,env) {
    var left = handle(e.left,env);
    var right = handle(e.right,env);
    if(!isNaN(left) && !isNaN(right)) 
	return binaryOperatorHandlers[e.operator](left,right)
    else
	return ""+left+e.operator+right;
}
function handleLiteral(x,env) {
    return x.value;
}
function handleIdentifier(x,env) {
    if(env[x.name]==undefined)
	return x.name;
    else
	return env[x.name];
}
function handleVariableDeclaration(d,env) {
    var reduced = [];
    for(var decl of d.declarations) {
	var init = handle(decl.init,env);
	if(!isNaN(init))
	    env[decl.id.name] = init;
	else
	    reduced.push(decl.id.name+" = "+init);
    }
    return reduced.join(', ');
}

var binaryOperatorHandlers = {
    '+': function(x,y) { return x+y; }
}

var syntaxHandlers = {
    'Program': handleProgram,
    'ExpressionStatement': handleExpressionStatement,
    'BinaryExpression': handleBinaryExpression,
    'Literal': handleLiteral,
    'Identifier': handleIdentifier,
    'VariableDeclaration': handleVariableDeclaration
}
function handle(ast,env) {
    if(syntaxHandlers[ast.type]==undefined)
	console.log("Undefined handler for type "+ast.type+", keys: "+Object.keys(ast));
    return syntaxHandlers[ast.type](ast,env);
}
exports.process = function(program) {
    return handle(esprima.parse(program),{});
}


