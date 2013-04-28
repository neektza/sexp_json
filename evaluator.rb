class SexpJSON
  def initialize(ext={})
    @env = {
      :head  => lambda { |(list), _| list[0] },
      :tail  => lambda { |(list), _| list.drop 1 },
      :cons  => lambda { |(e,cell), _| [e] + cell },
      :eq    => lambda { |(l,r), ctx| self.eval(l, ctx) == self.eval(r, ctx) },
      :atom  => lambda { |(sexpr), _| (sexpr.is_a? Symbol) or (sexpr.is_a? Numeric) },
      :+     => lambda { |args, _| args.reduce(&:+) },
      :*     => lambda { |args, _| args.reduce(&:*) },
      # Procs - we don't eval these
      :label => proc   { |(name,val), _| @env[name] = self.eval(val, @env) },
      :if    => proc   { |(cond, thn, els), ctx| self.eval(cond, ctx) ? self.eval(thn, ctx) : self.eval(els, ctx) },
      :quote => proc   { |sexpr, _| sexpr[0] }
    }.merge(ext)
  end

  def apply fn, args, ctx=@env
    return ctx[fn].call(args, ctx) if ctx[fn].respond_to? :call
    fnBody = ctx[fn][2]; fnNamesWithArgs = Hash[*(ctx[fn][1].zip args).flatten(1)]
    self.eval(fnBody, fnNamesWithArgs)
  end

  def eval sexpr, ctx=@env
    puts "SEXP: #{sexpr}"
    return (ctx[sexpr] || sexpr) if ctx[:atom].call([sexpr], ctx)

    fn, *args = sexpr
    puts "FN: #{fn}"
    puts "ARGS: #{args}"
    if ctx[fn].is_a?(Array) || (ctx[fn].respond_to?(:lambda?) && ctx[fn].lambda?)
      args = args.map { |arg| self.eval(arg, ctx) }
    end # If it's an sexpr or a lambda, eval it, other
    self.apply(fn, args, ctx)
  end
end
