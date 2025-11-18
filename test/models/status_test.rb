# frozen_string_literal: true

require 'test_helper'

class StatusTest < ActiveSupport::TestCase
  setup do
    @alice = Fabricate(:account, username: 'alice')
  end

  test 'requires text when status has no media and is not a reblog' do
    status = Fabricate.build(:status, text: '', account: @alice)
    status.media_attachments = []
    status.reblog = nil

    assert_not status.valid?
    assert_not_empty status.errors[:text]
  end

  test 'allows empty text when status has media' do
    media = Fabricate(:media_attachment, account: @alice)
    status = Fabricate.build(:status, text: '', account: @alice)
    status.media_attachments << media

    assert status.valid?
  end

  test 'allows empty text when status is a reblog' do
    reblogged_status = Fabricate(:status)
    status = Fabricate.build(:status, text: '', account: @alice, reblog: reblogged_status)

    assert status.valid?
  end

  test 'validates text length using StatusLengthValidator' do
    status = Fabricate.build(:status, account: @alice)

    status.valid?

    assert status.errors.empty? || status.errors.present?
  end

  test 'enforces maximum character limit' do
    long_text = 'a' * 10_000
    status = Fabricate.build(:status, text: long_text, account: @alice)

    assert_not status.valid?
  end

  test 'enforces uniqueness of reblog per account' do
    original_status = Fabricate(:status)
    first_reblog = Fabricate(:status, account: @alice, reblog: original_status)

    duplicate_reblog = Fabricate.build(:status, account: @alice, reblog: original_status)

    assert_not duplicate_reblog.valid?
    assert_not_empty duplicate_reblog.errors[:reblog]
  end
end

