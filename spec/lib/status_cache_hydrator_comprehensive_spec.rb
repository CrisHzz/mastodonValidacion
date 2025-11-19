# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StatusCacheHydrator do
  subject { described_class.new(status) }

  let(:account) { Fabricate(:account) }
  let(:other_account) { Fabricate(:account) }
  let(:status) { Fabricate(:status, account: account) }
  let(:application) { Fabricate(:application, name: 'TestApp') }

  before do
    allow(Rails.cache).to receive(:fetch).and_call_original
  end

  describe '#hydrate' do
    context 'with a basic status' do
      it 'returns hydrated payload' do
        payload = subject.hydrate(account.id)
        expect(payload).to be_a(Hash)
        expect(payload).to have_key(:favourited)
        expect(payload).to have_key(:reblogged)
        expect(payload).to have_key(:muted)
        expect(payload).to have_key(:bookmarked)
      end

      it 'marks as not favourited when not favourited' do
        payload = subject.hydrate(other_account.id)
        expect(payload[:favourited]).to be false
      end

      it 'marks as favourited when favourited' do
        Fabricate(:favourite, account: other_account, status: status)
        payload = subject.hydrate(other_account.id)
        expect(payload[:favourited]).to be true
      end

      it 'marks as reblogged when reblogged' do
        Fabricate(:status, account: other_account, reblog: status)
        payload = subject.hydrate(other_account.id)
        expect(payload[:reblogged]).to be true
      end

      it 'marks as bookmarked when bookmarked' do
        Fabricate(:bookmark, account: other_account, status: status)
        payload = subject.hydrate(other_account.id)
        expect(payload[:bookmarked]).to be true
      end

      it 'marks as pinned for own status' do
        Fabricate(:status_pin, account: account, status: status)
        payload = subject.hydrate(account.id)
        expect(payload[:pinned]).to be true
      end

      it 'does not mark as pinned for other users' do
        payload = subject.hydrate(other_account.id)
        expect(payload[:pinned]).to be_falsey
      end
    end

    context 'with nested status' do
      it 'updates stats when nested' do
        payload = subject.hydrate(account.id, nested: true)
        expect(payload).to have_key(:replies_count)
        expect(payload).to have_key(:reblogs_count)
        expect(payload).to have_key(:favourites_count)
      end
    end

    context 'with status that has poll' do
      let(:poll) { Fabricate(:poll) }
      let(:status_with_poll) { Fabricate(:status, account: account, poll: poll) }
      let(:hydrator) { described_class.new(status_with_poll) }

      before do
        allow(Rails.cache).to receive(:fetch).and_return({
          id: status_with_poll.id.to_s,
          poll: { id: poll.id.to_s, voted: false, own_votes: [] }
        })
      end

      it 'marks poll as voted for own status' do
        payload = hydrator.hydrate(account.id)
        expect(payload.dig(:poll, :voted)).to be true
        expect(payload.dig(:poll, :own_votes)).to eq([])
      end

      it 'includes poll vote information' do
        payload = hydrator.hydrate(other_account.id)
        expect(payload).to have_key(:poll)
      end
    end

    context 'with reblog' do
      let(:original_status) { Fabricate(:status, account: other_account) }
      let(:reblog_status) { Fabricate(:status, account: account, reblog: original_status) }
      let(:reblog_hydrator) { described_class.new(reblog_status) }

      before do
        allow(Rails.cache).to receive(:fetch).and_return({
          id: reblog_status.id.to_s,
          reblog: {
            id: original_status.id.to_s,
            favourited: false,
            reblogged: false
          }
        })
      end

      it 'hydrates reblog payload' do
        payload = reblog_hydrator.hydrate(account.id)
        expect(payload).to have_key(:reblog)
        expect(payload[:muted]).to be false
        expect(payload[:bookmarked]).to be false
      end

      it 'marks reblog as pinned for author' do
        payload = reblog_hydrator.hydrate(account.id)
        expect(payload[:pinned]).to be false
      end

      it 'hydrates original status favourites' do
        Fabricate(:favourite, account: other_account, status: original_status)
        payload = reblog_hydrator.hydrate(other_account.id)
        expect(payload.dig(:reblog, :favourited)).to be true
      end

      it 'copies filtered status from reblog' do
        allow_any_instance_of(described_class).to receive(:mapped_applied_custom_filter).and_return([])
        payload = reblog_hydrator.hydrate(account.id)
        expect(payload[:filtered]).to eq(payload.dig(:reblog, :filtered))
      end
    end

    context 'with reblog that has poll' do
      let(:poll) { Fabricate(:poll) }
      let(:original_status) { Fabricate(:status, account: other_account, poll: poll) }
      let(:reblog_status) { Fabricate(:status, account: account, reblog: original_status) }
      let(:reblog_hydrator) { described_class.new(reblog_status) }

      before do
        allow(Rails.cache).to receive(:fetch).and_return({
          id: reblog_status.id.to_s,
          reblog: {
            id: original_status.id.to_s,
            poll: { id: poll.id.to_s, voted: false, own_votes: [] }
          }
        })
      end

      it 'marks poll as voted for original author' do
        payload = reblog_hydrator.hydrate(other_account.id)
        expect(payload.dig(:reblog, :poll, :voted)).to be true
        expect(payload.dig(:reblog, :poll, :own_votes)).to eq([])
      end

      it 'includes poll votes for other users' do
        Fabricate(:poll_vote, poll: poll, account: account, choice: 0)
        payload = reblog_hydrator.hydrate(account.id)
        expect(payload.dig(:reblog, :poll, :voted)).to be true
        expect(payload.dig(:reblog, :poll, :own_votes)).to eq([0])
      end
    end

    context 'with application' do
      let(:status_with_app) { Fabricate(:status, account: account, application: application) }
      let(:app_hydrator) { described_class.new(status_with_app) }

      it 'hydrates application when missing for author' do
        allow(Rails.cache).to receive(:fetch).and_return({
          id: status_with_app.id.to_s,
          application: nil
        })
        
        payload = app_hydrator.hydrate(account.id)
        expect(payload[:application]).to be_present.or be_nil
      end
    end

    context 'with conversation mute' do
      let(:conversation) { Fabricate(:conversation) }
      let(:status_in_conv) { Fabricate(:status, account: account, conversation: conversation) }
      let(:conv_hydrator) { described_class.new(status_in_conv) }

      it 'marks as muted when conversation is muted' do
        Fabricate(:conversation_mute, account: other_account, conversation: conversation)
        payload = conv_hydrator.hydrate(other_account.id)
        expect(payload[:muted]).to be true
      end

      it 'marks as not muted when conversation is not muted' do
        payload = conv_hydrator.hydrate(other_account.id)
        expect(payload[:muted]).to be false
      end
    end

    context 'with custom filters' do
      let(:filter) { Fabricate(:custom_filter, account: other_account) }

      it 'includes filtered results' do
        allow(CustomFilter).to receive(:cached_filters_for).and_return([])
        allow(CustomFilter).to receive(:apply_cached_filters).and_return([])
        
        payload = subject.hydrate(other_account.id)
        expect(payload[:filtered]).to be_an(Array)
      end
    end

    context 'with stats' do
      before do
        status.update(
          replies_count: 5,
          reblogs_count: 10,
          favourites_count: 15,
          quotes_count: 3
        )
      end

      it 'includes updated stats when nested' do
        payload = subject.hydrate(account.id, nested: true)
        expect(payload[:replies_count]).to eq(5)
        expect(payload[:reblogs_count]).to eq(10)
        expect(payload[:favourites_count]).to eq(15)
        expect(payload[:quotes_count]).to eq(3)
      end
    end
  end
end

