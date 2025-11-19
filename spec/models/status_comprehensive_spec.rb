# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Status do
  subject { Fabricate(:status) }

  describe 'validations' do
    it { is_expected.to validate_presence_of(:account) }
  end

  describe '#local?' do
    it 'returns true for local status' do
      status = Fabricate(:status, account: Fabricate(:account, domain: nil))
      expect(status.local?).to be true
    end

    it 'returns false for remote status' do
      status = Fabricate(:status, account: Fabricate(:account, domain: 'remote.test'))
      expect(status.local?).to be false
    end
  end

  describe '#reblog?' do
    it 'returns true when it has a reblog' do
      original = Fabricate(:status)
      reblog = Fabricate(:status, reblog: original)
      expect(reblog.reblog?).to be true
    end

    it 'returns false when it does not have a reblog' do
      status = Fabricate(:status)
      expect(status.reblog?).to be false
    end
  end

  describe '#reply?' do
    it 'returns true when status is a reply' do
      original = Fabricate(:status)
      reply = Fabricate(:status, in_reply_to_id: original.id)
      expect(reply.reply?).to be true
    end

    it 'returns false when status is not a reply' do
      status = Fabricate(:status)
      expect(status.reply?).to be false
    end
  end

  describe '#thread' do
    it 'returns the thread of statuses' do
      first = Fabricate(:status)
      second = Fabricate(:status, in_reply_to_id: first.id)
      third = Fabricate(:status, in_reply_to_id: second.id)
      expect(third.thread).to include(first, second, third)
    end
  end

  describe '#favourites' do
    let(:status) { Fabricate(:status) }
    let(:account) { Fabricate(:account) }

    before { Fabricate(:favourite, status: status, account: account) }

    it 'returns favourites' do
      expect(status.favourites).to be_present
      expect(status.favourites.first.account).to eq(account)
    end
  end

  describe '#reblogs' do
    let(:status) { Fabricate(:status) }
    let(:account) { Fabricate(:account) }

    before { Fabricate(:status, reblog: status, account: account) }

    it 'returns reblogs' do
      expect(status.reblogs).to be_present
    end
  end

  describe '#mentions' do
    let(:status) { Fabricate(:status) }
    let(:account) { Fabricate(:account) }

    before { Fabricate(:mention, status: status, account: account) }

    it 'returns mentions' do
      expect(status.mentions).to be_present
      expect(status.mentions.first.account).to eq(account)
    end
  end

  describe '#media_attachments' do
    let(:status) { Fabricate(:status) }

    before { Fabricate(:media_attachment, status: status) }

    it 'returns media attachments' do
      expect(status.media_attachments).to be_present
    end
  end

  describe '#tags' do
    let(:status) { Fabricate(:status, text: 'Hello #world') }
    let(:tag) { Fabricate(:tag, name: 'world') }

    before { status.tags << tag }

    it 'returns tags' do
      expect(status.tags).to include(tag)
    end
  end

  describe '#visibility' do
    it 'returns public by default' do
      status = Fabricate(:status)
      expect(status.visibility).to eq('public')
    end

    it 'returns the set visibility' do
      status = Fabricate(:status, visibility: :private)
      expect(status.visibility).to eq('private')
    end
  end

  describe '#public_visibility?' do
    it 'returns true for public status' do
      status = Fabricate(:status, visibility: :public)
      expect(status.public_visibility?).to be true
    end

    it 'returns false for private status' do
      status = Fabricate(:status, visibility: :private)
      expect(status.public_visibility?).to be false
    end
  end

  describe '#unlisted_visibility?' do
    it 'returns true for unlisted status' do
      status = Fabricate(:status, visibility: :unlisted)
      expect(status.unlisted_visibility?).to be true
    end
  end

  describe '#private_visibility?' do
    it 'returns true for private status' do
      status = Fabricate(:status, visibility: :private)
      expect(status.private_visibility?).to be true
    end
  end

  describe '#direct_visibility?' do
    it 'returns true for direct status' do
      status = Fabricate(:status, visibility: :direct)
      expect(status.direct_visibility?).to be true
    end
  end

  describe '#proper' do
    it 'excludes reblogs' do
      original = Fabricate(:status)
      Fabricate(:status, reblog: original)
      expect(described_class.proper).not_to include(Status.find_by(reblog: original))
    end
  end

  describe '.as_public_timeline' do
    it 'returns public timeline statuses' do
      public_status = Fabricate(:status, visibility: :public)
      private_status = Fabricate(:status, visibility: :private)
      
      timeline = described_class.as_public_timeline
      expect(timeline).to include(public_status)
      expect(timeline).not_to include(private_status)
    end
  end

  describe '.as_home_timeline' do
    it 'returns home timeline statuses' do
      account = Fabricate(:account)
      followed = Fabricate(:account)
      Fabricate(:follow, account: account, target_account: followed)
      status = Fabricate(:status, account: followed)

      timeline = described_class.as_home_timeline(account)
      expect(timeline).to include(status)
    end
  end
end

