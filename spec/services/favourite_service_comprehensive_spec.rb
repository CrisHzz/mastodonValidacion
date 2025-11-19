# frozen_string_literal: true

require 'rails_helper'

RSpec.describe FavouriteService, type: :service do
  subject { described_class.new }

  let(:sender) { Fabricate(:account, username: 'alice') }
  let(:status) { Fabricate(:status, account: Fabricate(:account)) }

  describe '#call' do
    it 'creates a favourite' do
      expect { subject.call(sender, status) }.to change { status.favourites.count }.by(1)
    end

    it 'returns the created favourite' do
      result = subject.call(sender, status)
      expect(result).to be_a(Favourite)
      expect(result.account).to eq(sender)
      expect(result.status).to eq(status)
    end

    it 'creates a notification for the status author' do
      expect { subject.call(sender, status) }.to change { Notification.where(type: 'favourite').count }.by(1)
    end

    context 'when already favourited' do
      before { Fabricate(:favourite, account: sender, status: status) }

      it 'does not create a duplicate favourite' do
        expect { subject.call(sender, status) }.not_to change { status.favourites.count }
      end
    end

    context 'with remote status' do
      let(:remote_status) { Fabricate(:status, account: Fabricate(:account, domain: 'remote.test')) }

      it 'creates a favourite' do
        expect { subject.call(sender, remote_status) }.to change { remote_status.favourites.count }.by(1)
      end
    end

    context 'with local status' do
      it 'increments favourites counter cache' do
        expect { subject.call(sender, status) }.to change { status.reload.favourites_count }.by(1)
      end
    end
  end
end

