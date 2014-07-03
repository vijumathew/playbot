# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)

require "playbot/version"

Gem::Specification.new do |s|
  s.name        = "playbot"
  s.license     = "MIT"
  s.authors     = ["Viju Mathew", "Clay Allsopp"]
  s.email       = "clay.allsopp@gmail.com"
  s.homepage    = PlayBot::WEBSITE
  s.version     = PlayBot::VERSION
  s.summary     = "PlayBot - automate Google Play tasks"
  s.description = PlayBot::DESCRIPTION

  # sync w/ vendor/botlib/botlib.gemspec
  s.add_dependency "commander", "~> 4.2.0"
  s.add_dependency "activesupport", ">= 3.2"
  s.add_dependency "terminal-table", ">= 1.4.0"

  s.add_development_dependency "rake"
  s.add_development_dependency "dotenv"

  s.files         = Dir["./**/*"].reject { |file| file =~ /\.\/(bin|log|pkg|script|spec|test)/ }
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  s.require_paths = ["lib"]
end
