# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ReblogService, type: :service do
  subject { described_class.new }

  let(:account) { Fabricate(:account) }
  let(:reblogged_status) { Fabricate(:status) }

  describe '#call' do
    it 'creates a reblog' do
      expect { subject.call(account, reblogged_status) }.to change { Status.where(reblog_of_id: reblogged_status.id).count }.by(1)
    end

    it 'returns a reblog status' do
      result = subject.call(account, reblogged_status)
      expect(result).to be_a(Status)
      expect(result.reblog).to eq(reblogged_status)
      expect(result.account).to eq(account)
    end

    it 'creates a notification for the reblogged status author' do
      expect { subject.call(account, reblogged_status) }.to change { Notification.where(type: 'reblog').count }.by(1)
    end

    it 'increments reblogs counter cache' do
      expect { subject.call(account, reblogged_status) }.to change { reblogged_status.reload.reblogs_count }.by(1)
    end

    context 'when already reblogged' do
      before { Fabricate(:status, account: account, reblog: reblogged_status) }

      it 'does not create a duplicate reblog' do
        expect { subject.call(account, reblogged_status) }.not_to change { Status.where(reblog_of_id: reblogged_status.id).count }
      end

      it 'returns the existing reblog' do
        existing_reblog = Status.find_by(account: account, reblog: reblogged_status)
        result = subject.call(account, reblogged_status)
        expect(result).to eq(existing_reblog)
      end
    end

    context 'with private status' do
      let(:private_status) { Fabricate(:status, visibility: :private) }

      context 'when not following' do
        it 'does not create a reblog' do
          expect { subject.call(account, private_status) }.to raise_error(ActiveRecord::RecordInvalid)
        end
      end

      context 'when following' do
        before { Fabricate(:follow, account: account, target_account: private_status.account) }

        it 'creates a reblog' do
          expect { subject.call(account, private_status) }.to change { Status.where(reblog_of_id: private_status.id).count }.by(1)
        end
      end
    end

    context 'with direct status' do
      let(:direct_status) { Fabricate(:status, visibility: :direct) }

      it 'does not create a reblog' do
        expect { subject.call(account, direct_status) }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end

    context 'with remote status' do
      let(:remote_status) { Fabricate(:status, account: Fabricate(:account, domain: 'remote.test')) }

      it 'creates a reblog' do
        result = subject.call(account, remote_status)
        expect(result.reblog).to eq(remote_status)
      end
    end

    context 'with visibility parameter' do
      it 'respects visibility parameter' do
        result = subject.call(account, reblogged_status, visibility: :unlisted)
        expect(result.visibility).to eq('unlisted')
      end
    end
  end
end

