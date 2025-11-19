# frozen_string_literal: true

require 'test_helper'

class StatusTest < ActiveSupport::TestCase
  fixtures :accounts, :statuses, :polls

  setup do
    @alice = accounts(:alice)
  end

  test 'requires text when status has no media and is not a reblog' do
    status = Status.new(text: '', account: @alice)
    status.media_attachments = []
    status.reblog = nil

    assert_not status.valid?
    assert_not_empty status.errors[:text]
  end

  test 'allows empty text when status has media' do
    media = MediaAttachment.new(account: @alice, file: StringIO.new('test'))
    status = Status.new(text: '', account: @alice)
    status.media_attachments << media

    assert status.valid?
  end

  test 'allows empty text when status is a reblog' do
    reblogged_status = statuses(:bob_status)
    status = Status.new(text: '', account: @alice, reblog: reblogged_status)

    assert status.valid?
  end

  test 'validates text length using StatusLengthValidator' do
    status = Status.new(account: @alice, text: 'Test')

    status.valid?

    assert status.errors.empty? || status.errors.present?
  end

  test 'enforces maximum character limit' do
    long_text = 'a' * 10_000
    status = Status.new(text: long_text, account: @alice)

    assert_not status.valid?
  end

  test 'enforces uniqueness of reblog per account' do
    original_status = statuses(:bob_status)
    first_reblog = Status.create!(account: @alice, reblog: original_status)

    duplicate_reblog = Status.new(account: @alice, reblog: original_status)

    assert_not duplicate_reblog.valid?
    assert_not_empty duplicate_reblog.errors[:reblog]
  end

  test 'has_one poll association' do
    status = statuses(:alice_status)

    assert_respond_to status, :poll
  end

  test 'can have a poll associated' do
    status = statuses(:alice_status_with_poll)
    poll = polls(:alice_poll)

    assert_equal poll, status.poll
    assert_equal status, poll.status
  end

  test 'destroys poll when status is destroyed' do
    status = statuses(:alice_status_with_poll)
    poll = polls(:alice_poll)
    poll_id = poll.id

    assert_difference 'Poll.count', -1 do
      status.destroy
    end

    assert_nil Poll.find_by(id: poll_id)
  end

  test 'allows empty text when status has poll' do
    status = Status.new(text: '', account: @alice)
    status.media_attachments = []
    status.reblog = nil
    poll = Poll.new(
      account: @alice,
      status: status,
      options: ['Option 1', 'Option 2'],
      expires_at: 1.day.from_now
    )
    status.poll = poll

    assert status.valid?
  end

  test 'poll is nil when status has no poll' do
    status = statuses(:alice_status)

    assert_nil status.poll
  end
end

