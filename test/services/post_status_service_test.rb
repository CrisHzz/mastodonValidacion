# frozen_string_literal: true

require 'test_helper'

class PostStatusServiceTest < ActiveSupport::TestCase
  setup do
    @account = Fabricate(:account)
    @service = PostStatusService.new
  end

  test 'calls Status.create! through account.statuses.new' do
    status = @service.call(@account, text: 'test status')

    assert status.persisted?
    assert_equal 'test status', status.text
  end

  test 'sanitizes text before creating status' do
    status = @service.call(@account, text: '  test status  ')

    assert_equal 'test status', status.text
  end

  test 'attaches media to status without enqueueing PostProcessMediaWorker for already processed media' do
    media_attachment = Fabricate(:media_attachment, account: @account)

    PostProcessMediaWorker.stub :perform_async, nil do
      media_attachment.define_singleton_method(:not_processed?) { false }
      status = @service.call(@account, text: 'test', media_ids: [media_attachment.id])

      assert_equal status, media_attachment.reload.status
    end
  end

  test 'validates media belongs to account' do
    other_account = Fabricate(:account)
    other_media = Fabricate(:media_attachment, account: other_account)

    assert_raises(Mastodon::ValidationError) do
      @service.call(@account, text: 'test', media_ids: [other_media.id])
    end
  end

  test 'enqueues DistributionWorker after status creation' do
    distribution_worker_called = false
    distribution_worker_args = nil

    DistributionWorker.stub :perform_async, ->(*args) { distribution_worker_called = true; distribution_worker_args = args } do
      ActivityPub::DistributionWorker.stub :perform_async, true do
        LinkCrawlWorker.stub :perform_async, true do
          status = @service.call(@account, text: 'test status')

          assert distribution_worker_called
          assert_equal status.id, distribution_worker_args.first
        end
      end
    end
  end

  test 'enqueues ActivityPub::DistributionWorker after status creation' do
    activitypub_worker_called = false
    activitypub_worker_args = nil

    DistributionWorker.stub :perform_async, true do
      ActivityPub::DistributionWorker.stub :perform_async, ->(*args) { activitypub_worker_called = true; activitypub_worker_args = args } do
        LinkCrawlWorker.stub :perform_async, true do
          status = @service.call(@account, text: 'test status')

          assert activitypub_worker_called
          assert_equal status.id, activitypub_worker_args.first
        end
      end
    end
  end

  test 'enqueues LinkCrawlWorker after status creation' do
    link_crawl_worker_called = false
    link_crawl_worker_args = nil

    DistributionWorker.stub :perform_async, true do
      ActivityPub::DistributionWorker.stub :perform_async, true do
        LinkCrawlWorker.stub :perform_async, ->(*args) { link_crawl_worker_called = true; link_crawl_worker_args = args } do
          status = @service.call(@account, text: 'test status')

          assert link_crawl_worker_called
          assert_equal status.id, link_crawl_worker_args.first
        end
      end
    end
  end
end

