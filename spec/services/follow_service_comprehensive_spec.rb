# frozen_string_literal: true

require 'rails_helper'

RSpec.describe FollowService, type: :service do
  subject { described_class.new }

  let(:sender) { Fabricate(:account, username: 'alice') }
  let(:target) { Fabricate(:account, username: 'bob') }

  describe '#call' do
    context 'with local account' do
      it 'creates a following relationship' do
        expect { subject.call(sender, target) }.to change { sender.following.count }.by(1)
      end

      it 'creates a follow' do
        result = subject.call(sender, target)
        expect(result).to be_a(Follow)
        expect(result.account).to eq(sender)
        expect(result.target_account).to eq(target)
      end

      it 'creates a notification for the target' do
        expect { subject.call(sender, target) }.to change { Notification.where(type: 'follow').count }.by(1)
      end
    end

    context 'when already following' do
      before { Fabricate(:follow, account: sender, target_account: target) }

      it 'does not create a duplicate follow' do
        expect { subject.call(sender, target) }.not_to change { sender.following.count }
      end
    end

    context 'with locked account' do
      let(:locked_account) { Fabricate(:account, locked: true) }

      it 'creates a follow request' do
        result = subject.call(sender, locked_account)
        expect(result).to be_a(FollowRequest)
      end

      it 'does not create a follow immediately' do
        subject.call(sender, locked_account)
        expect(sender.following?(locked_account)).to be false
      end

      it 'creates a notification for follow request' do
        expect { subject.call(sender, locked_account) }.to change { Notification.where(type: 'follow_request').count }.by(1)
      end
    end

    context 'with remote account' do
      let(:remote_account) { Fabricate(:account, domain: 'remote.test', protocol: :activitypub) }

      it 'creates a follow' do
        result = subject.call(sender, remote_account)
        expect(result).to be_a(Follow)
      end
    end

    context 'with blocked account' do
      before { Fabricate(:block, account: sender, target_account: target) }

      it 'does not create a follow' do
        expect { subject.call(sender, target) }.not_to change { sender.following.count }
      end
    end

    context 'with suspended account' do
      before { target.suspend! }

      it 'does not create a follow' do
        expect { subject.call(sender, target) }.not_to change { sender.following.count }
      end
    end

    context 'with reblogs parameter' do
      it 'respects show_reblogs parameter' do
        result = subject.call(sender, target, reblogs: false)
        expect(result.show_reblogs).to be false
      end
    end

    context 'with notify parameter' do
      it 'respects notify parameter' do
        result = subject.call(sender, target, notify: true)
        expect(result.notify).to be true
      end
    end
  end
end

