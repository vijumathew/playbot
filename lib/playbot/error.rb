class PlayBot
  class PlayBotError < StandardError
    class_attribute :message
    self.message = "Unspecified PlayBot error occured"
    attr_reader :output, :html

    def initialize(error, output = [], message = nil)
      super(self.class.message)
      output ||= []
      output = output.map(&:strip).reject(&:blank?)
      @html = output.select {|n|
        is_debug_html?(n)
      }.map { |s|
        JSON.parse(s)['html']
      }.first

      @output = output.reject {|n|
        is_debug_html?(n)
      }

      full_backtrace = (@output.map { |o|
        "#{o}:in `PlayBot'"
      } + error.backtrace).compact
      set_backtrace(full_backtrace)
    end

    def is_debug_html?(line)
      line.include?('"event":"debug_html"')
    end
  end

  class AppleBotError
    def self.for_output(output = [])
      output ||= []

      error_class = PlayBotError

      begin
        # capture the Ruby-level stack trace
        raise StandardError
      rescue Exception => e
        error_class.new(e, output)
      end
    end

    def self.test
      raise for_output(["something", "happened"])
    end
  end

end
