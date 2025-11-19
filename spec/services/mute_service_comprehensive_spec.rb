# frozen_string_literal: true

require 'rails_helper'

RSpec.describe MuteService, type: :service do
  subject { described_class.new }

  let(:account) { Fabricate(:account) }
  let(:target_account) { Fabricate(:account) }

  describe '#call' do
    it 'creates a mute' do
      expect { subject.call(account, target_account) }.to change { account.muting.count }.by(1)
    end

    it 'returns a mute' do
      result = subject.call(account, target_account)
      expect(result).to be_a(Mute)
      expect(result.account).to eq(account)
      expect(result.target_account).to eq(target_account)
    end

    context 'when already muting' do
      before { Fabricate(:mute, account: account, target_account: target_account) }

      it 'does not create a duplicate mute' do
        expect { subject.call(account, target_account) }.not_to change { account.muting.count }
      end
    end

    context 'with notifications parameter' do
      it 'mutes notifications when true' do
        result = subject.call(account, target_account, notifications: true)
        expect(result.hide_notifications).to be true
      end

      it 'does not mute notifications when false' do
        result = subject.call(account, target_account, notifications: false)
        expect(result.hide_notifications).to be false
      end
    end

    context 'with duration parameter' do
      it 'sets expiration date' do
        result = subject.call(account, target_account, duration: 3600)
        expect(result.expires_at).to be_present
      end

      it 'does not set expiration for 0 duration' do
        result = subject.call(account, target_account, duration: 0)
        expect(result.expires_at).to be_nil
      end
    end

    context 'with remote account' do
      let(:remote_account) { Fabricate(:account, domain: 'remote.test') }

      it 'creates a mute' do
        result = subject.call(account, remote_account)
        expect(result).to be_a(Mute)
      end
    end

    context 'when removing statuses from home feed' do
      let!(:status) { Fabricate(:status, account: target_account) }

      before do
        Fabricate(:follow, account: account, target_account: target_account)
        FeedManager.instance.push_to_home(account, status)
      end

      it 'removes muted account statuses from home feed' do
        subject.call(account, target_account)
        expect(FeedManager.instance.feed(:home, account.id).get(10)).not_to include(status.id.to_s)
      end
    end
  end
end

