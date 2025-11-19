# frozen_string_literal: true

require 'rails_helper'

RSpec.describe BlockService, type: :service do
  subject { described_class.new }

  let(:sender) { Fabricate(:account, username: 'alice') }
  let(:target) { Fabricate(:account, username: 'bob') }

  describe '#call' do
    it 'creates a block' do
      expect { subject.call(sender, target) }.to change { sender.blocking.count }.by(1)
    end

    it 'returns a block' do
      result = subject.call(sender, target)
      expect(result).to be_a(Block)
      expect(result.account).to eq(sender)
      expect(result.target_account).to eq(target)
    end

    context 'when already blocking' do
      before { Fabricate(:block, account: sender, target_account: target) }

      it 'does not create a duplicate block' do
        expect { subject.call(sender, target) }.not_to change { sender.blocking.count }
      end
    end

    context 'when following the target' do
      before { Fabricate(:follow, account: sender, target_account: target) }

      it 'removes the follow' do
        expect { subject.call(sender, target) }.to change { sender.following?(target) }.from(true).to(false)
      end
    end

    context 'when target is following sender' do
      before { Fabricate(:follow, account: target, target_account: sender) }

      it 'removes the follow' do
        expect { subject.call(sender, target) }.to change { target.following?(sender) }.from(true).to(false)
      end
    end

    context 'with follow request pending' do
      before { Fabricate(:follow_request, account: sender, target_account: target) }

      it 'cancels the follow request' do
        expect { subject.call(sender, target) }.to change { FollowRequest.where(account: sender, target_account: target).count }.to(0)
      end
    end

    context 'with remote account' do
      let(:remote_account) { Fabricate(:account, domain: 'remote.test', protocol: :activitypub) }

      it 'creates a block' do
        result = subject.call(sender, remote_account)
        expect(result).to be_a(Block)
      end
    end

    context 'with blocking the same account twice' do
      before { subject.call(sender, target) }

      it 'returns the existing block' do
        result = subject.call(sender, target)
        expect(result).to be_a(Block)
      end
    end
  end
end

