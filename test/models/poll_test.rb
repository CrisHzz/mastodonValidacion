# frozen_string_literal: true

require 'test_helper'

class PollTest < ActiveSupport::TestCase
  fixtures :accounts, :statuses, :polls

  setup do
    @account = accounts(:alice)
    @status = statuses(:alice_status)
  end

  test 'requires options to be present' do
    poll = Poll.new(account: @account, status: @status, expires_at: 1.day.from_now)

    assert_not poll.valid?
    assert_not_empty poll.errors[:options]
  end

  test 'requires expires_at for local polls' do
    poll = Poll.new(account: @account, status: @status, options: ['Option 1', 'Option 2'])
    poll.stub :local?, true do
      assert_not poll.valid?
      assert_not_empty poll.errors[:expires_at]
    end
  end

  test 'allows missing expires_at for remote polls' do
    poll = Poll.new(account: @account, status: @status, options: ['Option 1', 'Option 2'])
    poll.stub :local?, false do
      poll.valid?
      assert_empty poll.errors[:expires_at]
    end
  end

  test 'validates minimum number of options' do
    poll = Poll.new(account: @account, status: @status, options: ['Only one'], expires_at: 1.day.from_now)
    poll.stub :local?, true do
      assert_not poll.valid?
      assert_not_empty poll.errors[:options]
    end
  end

  test 'validates maximum number of options' do
    poll = Poll.new(
      account: @account,
      status: @status,
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'],
      expires_at: 1.day.from_now
    )
    poll.stub :local?, true do
      assert_not poll.valid?
      assert_not_empty poll.errors[:options]
    end
  end

  test 'validates option character limit' do
    long_option = 'a' * 51
    poll = Poll.new(
      account: @account,
      status: @status,
      options: ['Option 1', long_option],
      expires_at: 1.day.from_now
    )
    poll.stub :local?, true do
      assert_not poll.valid?
      assert_not_empty poll.errors[:options]
    end
  end

  test 'validates no duplicate options' do
    poll = Poll.new(
      account: @account,
      status: @status,
      options: ['Option 1', 'Option 1'],
      expires_at: 1.day.from_now
    )
    poll.stub :local?, true do
      assert_not poll.valid?
      assert_not_empty poll.errors[:options]
    end
  end

  test 'validates expiration duration is not too long' do
    poll = Poll.new(
      account: @account,
      status: @status,
      options: ['Option 1', 'Option 2'],
      expires_at: 2.months.from_now
    )
    poll.stub :local?, true do
      assert_not poll.valid?
      assert_not_empty poll.errors[:expires_at]
    end
  end

  test 'validates expiration duration is not too short' do
    poll = Poll.new(
      account: @account,
      status: @status,
      options: ['Option 1', 'Option 2'],
      expires_at: 1.minute.from_now
    )
    poll.stub :local?, true do
      assert_not poll.valid?
      assert_not_empty poll.errors[:expires_at]
    end
  end

  test 'accepts valid poll with correct options and expiration' do
    poll = Poll.new(
      account: @account,
      status: @status,
      options: ['Option 1', 'Option 2'],
      expires_at: 1.day.from_now
    )
    poll.stub :local?, true do
      assert poll.valid?
    end
  end

  test 'belongs to account' do
    poll = Poll.create!(
      account: @account,
      status: @status,
      options: ['Option 1', 'Option 2'],
      expires_at: 1.day.from_now
    )

    assert_equal @account, poll.account
    assert poll.account_id.present?
  end

  test 'belongs to status' do
    poll = Poll.create!(
      account: @account,
      status: @status,
      options: ['Option 1', 'Option 2'],
      expires_at: 1.day.from_now
    )

    assert_equal @status, poll.status
    assert poll.status_id.present?
  end

  test 'has many votes' do
    poll = Poll.create!(
      account: @account,
      status: @status,
      options: ['Option 1', 'Option 2'],
      expires_at: 1.day.from_now
    )

    assert_respond_to poll, :votes
  end

  test 'voted? returns true when account is poll creator' do
    poll = Poll.create!(
      account: @account,
      status: @status,
      options: ['Option 1', 'Option 2'],
      expires_at: 1.day.from_now
    )

    assert poll.voted?(@account)
  end

  test 'voted? returns false when account has not voted' do
    other_account = accounts(:bob)
    poll = Poll.create!(
      account: @account,
      status: @status,
      options: ['Option 1', 'Option 2'],
      expires_at: 1.day.from_now
    )

    assert_not poll.voted?(other_account)
  end

  test 'expired? returns true when expires_at is in the past' do
    poll = Poll.create!(
      account: @account,
      status: @status,
      options: ['Option 1', 'Option 2'],
      expires_at: 1.day.ago
    )

    assert poll.expired?
  end

  test 'expired? returns false when expires_at is in the future' do
    poll = Poll.create!(
      account: @account,
      status: @status,
      options: ['Option 1', 'Option 2'],
      expires_at: 1.day.from_now
    )

    assert_not poll.expired?
  end

  test 'expired? returns false when expires_at is nil' do
    poll = Poll.new(
      account: @account,
      status: @status,
      options: ['Option 1', 'Option 2']
    )
    poll.stub :local?, false do
      poll.save(validate: false)
      assert_not poll.expired?
    end
  end

  test 'expires? returns true when expires_at is present' do
    poll = Poll.create!(
      account: @account,
      status: @status,
      options: ['Option 1', 'Option 2'],
      expires_at: 1.day.from_now
    )

    assert poll.expires?
  end

  test 'expires? returns false when expires_at is nil' do
    poll = Poll.new(
      account: @account,
      status: @status,
      options: ['Option 1', 'Option 2']
    )
    poll.stub :local?, false do
      poll.save(validate: false)
      assert_not poll.expires?
    end
  end

  test 'reset_votes! clears votes and tallies' do
    poll = Poll.create!(
      account: @account,
      status: @status,
      options: ['Option 1', 'Option 2'],
      expires_at: 1.day.from_now,
      cached_tallies: [5, 3],
      votes_count: 8,
      voters_count: 8
    )

    poll.reset_votes!

    assert_equal [0, 0], poll.cached_tallies
    assert_equal 0, poll.votes_count
    assert_equal 0, poll.voters_count
  end

  test 'loaded_options returns Option objects with correct structure' do
    poll = Poll.create!(
      account: @account,
      status: @status,
      options: ['Option 1', 'Option 2'],
      expires_at: 1.day.from_now,
      cached_tallies: [5, 3]
    )

    options = poll.loaded_options

    assert_equal 2, options.size
    assert_equal '0', options[0].id
    assert_equal 'Option 1', options[0].title
    assert_equal 5, options[0].votes_count
    assert_equal '1', options[1].id
    assert_equal 'Option 2', options[1].title
    assert_equal 3, options[1].votes_count
  end

  test 'possibly_stale? returns false for local polls' do
    poll = Poll.create!(
      account: @account,
      status: @status,
      options: ['Option 1', 'Option 2'],
      expires_at: 1.day.from_now
    )
    poll.stub :remote?, false do
      assert_not poll.possibly_stale?
    end
  end

  test 'prepare_options strips and removes blank options for local polls' do
    poll = Poll.new(
      account: @account,
      status: @status,
      options: ['  Option 1  ', '', 'Option 2'],
      expires_at: 1.day.from_now
    )
    poll.stub :local?, true do
      poll.valid?
      assert_equal ['Option 1', 'Option 2'], poll.options
    end
  end

  test 'prepare_cached_tallies initializes empty tallies' do
    poll = Poll.new(
      account: @account,
      status: @status,
      options: ['Option 1', 'Option 2'],
      expires_at: 1.day.from_now
    )
    poll.stub :local?, true do
      poll.valid?
      assert_equal [0, 0], poll.cached_tallies
    end
  end

  test 'prepare_votes_count calculates from cached_tallies' do
    poll = Poll.new(
      account: @account,
      status: @status,
      options: ['Option 1', 'Option 2'],
      expires_at: 1.day.from_now,
      cached_tallies: [5, 3]
    )
    poll.stub :local?, true do
      poll.valid?
      assert_equal 8, poll.votes_count
    end
  end
end

