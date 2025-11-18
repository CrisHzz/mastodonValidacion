# frozen_string_literal: true

ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'
require 'minitest/mock'

ActiveRecord::Migration.maintain_test_schema!

# Rails.root.glob('spec/fabricators/**/*.rb').each { |f| require f }


class ActiveSupport::TestCase
  include ActiveJob::TestHelper

  parallelize(workers: :number_of_processors)

  fixtures :all
end

