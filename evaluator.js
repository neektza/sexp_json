function zip(arr1, arr2) {
	var hash = {};
	for (var i = 0; i < arr1.length; i++) {
		hash[arr[i]] = arr2[i];
	}
	return hash;
}

function SexpJSON () {
	var self = this;
	self.env = {
		label : function(args, ctx) {
			var name = args[0], val = args[1];
			self.env[name] = self.eval(val, env);
		},
		if	  : function(args, ctx) {
			var cond = args[0], thn = args[1], els = args[2];
			self.eval(cond, ctx) ? self.eval(thn, ctx) : self.eval(els, ctx);
		},
		head  : function(args, ctx) {
			var list = args;
			return list[0];
		},
		tail  : function(args, ctx) {
			var list = args;
			return list.slice(1)
		},
		cons  : function(args, ctx) {
			var el = args[0], cell = args[1];
			return [el] + cell;
		},
		eq	  : function(args, ctx) {
			var l = args[0], r = args[1];
			self.eval(l, ctx) === self.eval(r, ctx)
		},
		quote : function(sexpr) {
			sexpr[0]
		}
	}

	self.apply = function(fn, args, ctx) {
		if (typeof ctx[fn] === "function") {
			return ctx[fn](args, ctx)
		} else {
			var mergedCtx = {}, fnNames = ctx[fn][1], fnBody = ctx[fn][2], fnsWithArgs = zip(fnNames, args);
			for (var attrname in ctx) { mergedCtx[attrname] = ctx[attrname] };
			self.eval(fnBody, mergedCtx)
		}
	}

	self.eval = function(sexpr, ctx) {
	}
}

module.exports.SexpJSON = SexpJSON;
