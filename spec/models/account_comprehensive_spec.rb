# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Account do
  subject { Fabricate(:account) }

  describe 'validations' do
    it { is_expected.to validate_presence_of(:username) }
  end

  describe '#local?' do
    it 'returns true when domain is nil' do
      account = Fabricate(:account, domain: nil)
      expect(account.local?).to be true
    end

    it 'returns false when domain is present' do
      account = Fabricate(:account, domain: 'remote.test')
      expect(account.local?).to be false
    end
  end

  describe '#following' do
    let(:account) { Fabricate(:account) }
    let(:target_account) { Fabricate(:account) }

    before { Fabricate(:follow, account: account, target_account: target_account) }

    it 'returns accounts being followed' do
      expect(account.following).to include(target_account)
    end
  end

  describe '#followers' do
    let(:account) { Fabricate(:account) }
    let(:follower) { Fabricate(:account) }

    before { Fabricate(:follow, account: follower, target_account: account) }

    it 'returns follower accounts' do
      expect(account.followers).to include(follower)
    end
  end

  describe '#following?' do
    let(:account) { Fabricate(:account) }
    let(:target_account) { Fabricate(:account) }

    context 'when following' do
      before { Fabricate(:follow, account: account, target_account: target_account) }

      it 'returns true' do
        expect(account.following?(target_account)).to be true
      end
    end

    context 'when not following' do
      it 'returns false' do
        expect(account.following?(target_account)).to be false
      end
    end
  end

  describe '#blocking?' do
    let(:account) { Fabricate(:account) }
    let(:target_account) { Fabricate(:account) }

    context 'when blocking' do
      before { Fabricate(:block, account: account, target_account: target_account) }

      it 'returns true' do
        expect(account.blocking?(target_account)).to be true
      end
    end

    context 'when not blocking' do
      it 'returns false' do
        expect(account.blocking?(target_account)).to be false
      end
    end
  end

  describe '#muting?' do
    let(:account) { Fabricate(:account) }
    let(:target_account) { Fabricate(:account) }

    context 'when muting' do
      before { Fabricate(:mute, account: account, target_account: target_account) }

      it 'returns true' do
        expect(account.muting?(target_account)).to be true
      end
    end

    context 'when not muting' do
      it 'returns false' do
        expect(account.muting?(target_account)).to be false
      end
    end
  end

  describe '#requested?' do
    let(:account) { Fabricate(:account) }
    let(:target_account) { Fabricate(:account, locked: true) }

    context 'when follow requested' do
      before { Fabricate(:follow_request, account: account, target_account: target_account) }

      it 'returns true' do
        expect(account.requested?(target_account)).to be true
      end
    end

    context 'when not requested' do
      it 'returns false' do
        expect(account.requested?(target_account)).to be false
      end
    end
  end

  describe '#suspend!' do
    it 'marks account as suspended' do
      account = Fabricate(:account)
      account.suspend!
      expect(account.suspended?).to be true
    end
  end

  describe '#unsuspend!' do
    it 'removes suspension' do
      account = Fabricate(:account)
      account.suspend!
      account.unsuspend!
      expect(account.suspended?).to be false
    end
  end

  describe '#silence!' do
    it 'marks account as silenced' do
      account = Fabricate(:account)
      account.silence!
      expect(account.silenced?).to be true
    end
  end

  describe '#unsilence!' do
    it 'removes silence' do
      account = Fabricate(:account)
      account.silence!
      account.unsilence!
      expect(account.silenced?).to be false
    end
  end

  describe '#sensitized?' do
    it 'returns false by default' do
      account = Fabricate(:account)
      expect(account.sensitized?).to be false
    end
  end

  describe '#display_name' do
    it 'returns display name if present' do
      account = Fabricate(:account, display_name: 'Alice Smith')
      expect(account.display_name).to eq('Alice Smith')
    end

    it 'returns username if display name is blank' do
      account = Fabricate(:account, display_name: '', username: 'alice')
      expect(account.display_name).to eq('alice')
    end
  end

  describe '#acct' do
    it 'returns local acct' do
      account = Fabricate(:account, username: 'alice', domain: nil)
      expect(account.acct).to eq('alice')
    end

    it 'returns full acct for remote account' do
      account = Fabricate(:account, username: 'alice', domain: 'remote.test')
      expect(account.acct).to eq('alice@remote.test')
    end
  end

  describe '#to_param' do
    it 'returns username' do
      account = Fabricate(:account, username: 'alice')
      expect(account.to_param).to eq('alice')
    end
  end

  describe '.find_local' do
    it 'finds local account by username' do
      account = Fabricate(:account, username: 'alice', domain: nil)
      expect(described_class.find_local('alice')).to eq(account)
    end
  end

  describe '.find_remote' do
    it 'finds remote account by username and domain' do
      account = Fabricate(:account, username: 'alice', domain: 'remote.test')
      expect(described_class.find_remote('alice', 'remote.test')).to eq(account)
    end
  end
end

