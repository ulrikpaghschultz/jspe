var exports = module.exports = {};
var esprima = require('esprima')

function handleBody(body) {
    return body.map(handle).map(function (x) { return x+";" }).join();
}
function handleProgram(p) {
    return handleBody(p.body);
}
function handleExpressionStatement(e) {
    return handle(e.expression);
}
function handleBinaryExpression(e) {
    var left = handle(e.left);
    var right = handle(e.right);
    if(!isNaN(left) && !isNaN(right)) 
	return binaryOperatorHandlers[e.operator](left,right)
    else
	return ""+left+e.operator+right;
}
function handleLiteral(x) {
    return x.value;
}
function handleIdentifier(x) {
    return x.name;
}

var binaryOperatorHandlers = {
    '+': function(x,y) { return x+y; }
}

var syntaxHandlers = {
    'Program': handleProgram,
    'ExpressionStatement': handleExpressionStatement,
    'BinaryExpression': handleBinaryExpression,
    'Literal': handleLiteral,
    'Identifier': handleIdentifier
}
function handle(ast) {
    if(syntaxHandlers[ast.type]==undefined)
	console.log("Undefined handler for type "+ast.type);
    return syntaxHandlers[ast.type](ast);
}
exports.process = function(program) {
    return handle(esprima.parse(program));
}


