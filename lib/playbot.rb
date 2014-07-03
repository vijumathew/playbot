proj_root = File.expand_path(File.join(File.dirname(__FILE__), '..'))
$:.unshift(File.join(proj_root, 'vendor', 'botlib', 'lib'))

require 'botlib'

require_relative 'playbot/error'

class PlayBot
  cattr_accessor :loaded
  USERNAME_ENV = "PLAYBOT_USERNAME"
  PASSWORD_ENV = "PLAYBOT_PASSWORD"

  class Shell < BotLib::Shell
    def raise_error_for_output!(output)
      raise PlayBotError.for_output(output)
    end
  end

  class Command < BotLib::Command
    def self.load_all!
      commands_file_path = File.join(AppleBot.selenium_scripts_path, '_commands.json')
      PlayBot.commands = self.commands_from_json_file(commands_file_path)
    end
  end

  class CommandProxy < BotLib::CommandProxy
    self.bot = PlayBot
  end

  class CLI < BotLib::CLI
    self.name = "PlayBot"
    self.version = PlayBot::VERSION
    self.description = PlayBot::DESCRIPTION
    self.author = 'Clay Allsopp <clay.allsopp@gmail.com>'
    self.website = PlayBot::WEBSITE
    self.username_option_description = "Username to login to Google Play, or $#{USERNAME_ENV}"
    self.password_option_description = "Password to login to Google Play, or $#{PASSWORD_ENV}"
    self.cli_name = "applebot"
    self.bot_class = PlayBot
  end

  include BotLib::API

  class << self
    def shell
      @shell ||= PlayBot::Shell.new
    end

    def cli
      @cli ||= PlayBot::CLI.new
    end

    def playbot_root_path
      File.expand_path(File.join(File.dirname(__FILE__), '..'))
    end

    def selenium_scripts_path
      File.join(playbot_root_path, 'selenium')
    end

    def command_file_path(command)
      file = command
      if !file.end_with?(".js")
        file << ".js"
      end
      File.join(selenium_scripts_path, file)
    end

    def casper_installed?
      !!BotLib.find_executable("start-selenium")
    end

    def run_command(command, options = {})
      raise "CasperJS is not installed - `brew install caspjerjs --devel` or visit http://casperjs.org/" if !casper_installed?

      options = options.with_indifferent_access
      verbose = options.delete(:verbose)
      format = options.delete(:format).to_s
      print_result = options.delete(:print_result)

      if options[:manifest]
        options = File.open(options[:manifest], 'r') { |f|
          JSON.parse(f.read).with_indifferent_access
        }
      end

      command_file = command_file_path(command)
      manifest_file = Tempfile.new('manifest.json')
      begin
        write_options = {
          "output_format" => 'json',
          "username" => options[:username] || @username || ENV[USERNAME_ENV],
          "password" => options[:password] || @password || ENV[PASSWORD_ENV],
          "applebot_root_path" => AppleBot.applebot_root_path
        }.merge(options)
        manifest_file.write(write_options.to_json)

        manifest_file.close

        sys_command = "casperjs #{command_file} --manifest=#{manifest_file.path.to_s.shellescape}"
        command_result = shell.command(sys_command, verbose, format)

        if command_result != nil
          shell.result(command_result, format, print_result)
        else
          true
        end
      ensure
        manifest_file.unlink
      end
    end
  end
end

if !PlayBot.loaded
  PlayBot.loaded = true
  PlayBot::Command.load_all!
  PlayBot.commands.each { |command|
    command_proxy = PlayBot::CommandProxy.for(command)
    command_proxy.attach_to(PlayBot)
  }
  PlayBot::CLI.commands = PlayBot.commands
end

