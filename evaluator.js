function zip(arr1, arr2) {
	var hash = {};
	for (var i = 0; i < arr1.length; i++) {
		hash[arr[i]] = arr2[i];
	}
	return hash;
}

function SexpJSON() {
	this.env = {
		'define' : function(args, ctx) { // Add definition to env
			var name = args[0], val = args[1];
			this.env[name] = this.eval(val, env);
		},
		'if'	  : function(args, ctx) {
			var cond = args[0], thn = args[1], els = args[2];
			this.eval(cond, ctx) ? this.eval(thn, ctx) : this.eval(els, ctx);
		},
		'eq'	  : function(args, ctx) {
			var l = args[0], r = args[1];
			this.eval(l, ctx) === this.eval(r, ctx)
		},
		'head'  : function(args, ctx) {
			var list = args;
			return list[0];
		},
		'tail'  : function(args, ctx) {
			var list = args;
			return list.slice(1)
		},
		'cons'  : function(args, ctx) {
			var el = args[0], cell = args[1];
			return [el] + cell;
		},
		'quote' : function(sexpr) { // Return the Sexp itthis
			return sexpr[0];
		},
		'atom'  : function(sexpr) { // Determine whether a sexpr is an atom
			return (typeof sexpr === 'number' || typeof sexpr === 'string');
		}
	}

	this.apply = function(fn, args, ctx) {
		ctx = ctx ? ctx : this.env;
		if (typeof ctx[fn] === "function") {
			return ctx[fn](args, ctx)
		} else {
			var mergedCtx = {}, fnNames = ctx[fn][1], fnBody = ctx[fn][2], fnsWithArgs = zip(fnNames, args);
			for (var attrname in ctx) { mergedCtx[attrname] = ctx[attrname] };
			return this.eval(fnBody, mergedCtx)
		}
	}

	this.eval = function(sexpr, ctx) {
		ctx = ctx ? ctx : this.env;
		if (ctx['atom'](sexpr, ctx)) { return sexpr }
		var fn = sexpr[0], args = sexpr.slice(1);

		if (typeof ctx[fn] === 'object') {
			var args = args.map(function(arg) { this.eval(arg,ctx) })
		}
		return this.apply(fn, args, ctx)
	}
}

module.exports.SexpJSON = SexpJSON;
