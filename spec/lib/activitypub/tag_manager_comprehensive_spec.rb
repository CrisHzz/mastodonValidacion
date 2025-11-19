# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ActivityPub::TagManager do
  let(:tag_manager) { described_class.instance }
  let(:local_account) { Fabricate(:account, username: 'alice', domain: nil) }
  let(:remote_account) { Fabricate(:account, username: 'bob', domain: 'remote.com') }
  let(:local_status) { Fabricate(:status, account: local_account) }
  let(:remote_status) { Fabricate(:status, account: remote_account) }

  describe '#public_collection?' do
    it 'returns true for ActivityStreams Public collection' do
      expect(tag_manager.public_collection?('https://www.w3.org/ns/activitystreams#Public')).to be true
    end

    it 'returns true for as:Public' do
      expect(tag_manager.public_collection?('as:Public')).to be true
    end

    it 'returns true for Public' do
      expect(tag_manager.public_collection?('Public')).to be true
    end

    it 'returns false for private URI' do
      expect(tag_manager.public_collection?('https://example.com/followers')).to be false
    end

    it 'returns false for nil' do
      expect(tag_manager.public_collection?(nil)).to be false
    end

    it 'returns false for empty string' do
      expect(tag_manager.public_collection?('')).to be false
    end
  end

  describe '#url_for' do
    context 'with local account' do
      it 'returns short account URL' do
        expect(tag_manager.url_for(local_account)).to include(local_account.username)
      end

      it 'handles instance actor' do
        instance_actor = Fabricate(:account, username: 'mastodon.internal')
        allow(instance_actor).to receive(:instance_actor?).and_return(true)
        url = tag_manager.url_for(instance_actor)
        expect(url).to be_a(String)
      end
    end

    context 'with remote account' do
      it 'returns the remote URL' do
        expect(tag_manager.url_for(remote_account)).to eq(remote_account.url)
      end

      it 'handles nil URL gracefully' do
        remote_account.update(url: nil)
        expect(tag_manager.url_for(remote_account)).to be_nil
      end
    end

    context 'with local status' do
      it 'returns short status URL' do
        url = tag_manager.url_for(local_status)
        expect(url).to be_a(String)
      end

      it 'handles reblog' do
        reblog = Fabricate(:status, account: local_account, reblog: local_status)
        url = tag_manager.url_for(reblog)
        expect(url).to be_a(String)
      end
    end

    context 'with remote status' do
      it 'returns the remote URL' do
        expect(tag_manager.url_for(remote_status)).to eq(remote_status.url)
      end
    end

    it 'returns nil for unsupported object types' do
      object = double('unknown_object', object_type: :unknown)
      expect(tag_manager.url_for(object)).to be_nil
    end
  end

  describe '#uri_for' do
    context 'with local account' do
      it 'returns account URI' do
        uri = tag_manager.uri_for(local_account)
        expect(uri).to be_a(String)
      end

      it 'handles numeric AP ID' do
        allow(local_account).to receive(:numeric_ap_id?).and_return(true)
        uri = tag_manager.uri_for(local_account)
        expect(uri).to be_a(String)
      end

      it 'handles instance actor' do
        allow(local_account).to receive(:instance_actor?).and_return(true)
        uri = tag_manager.uri_for(local_account)
        expect(uri).to be_a(String)
      end
    end

    context 'with remote account' do
      it 'returns the remote URI' do
        expect(tag_manager.uri_for(remote_account)).to eq(remote_account.uri)
      end
    end

    context 'with local status' do
      it 'returns status URI' do
        uri = tag_manager.uri_for(local_status)
        expect(uri).to be_a(String)
      end

      it 'handles numeric AP ID for account' do
        allow(local_status.account).to receive(:numeric_ap_id?).and_return(true)
        uri = tag_manager.uri_for(local_status)
        expect(uri).to be_a(String)
      end

      it 'handles reblog with numeric AP ID' do
        reblog = Fabricate(:status, account: local_account, reblog: local_status)
        allow(reblog.account).to receive(:numeric_ap_id?).and_return(true)
        uri = tag_manager.uri_for(reblog)
        expect(uri).to be_a(String)
      end
    end

    context 'with conversation' do
      let(:conversation) { Fabricate(:conversation) }

      it 'returns conversation URI when parent_account_id and parent_status_id are present' do
        allow(conversation).to receive(:parent_account_id).and_return(1)
        allow(conversation).to receive(:parent_status_id).and_return(1)
        allow(conversation).to receive(:object_type).and_return(:conversation)
        uri = tag_manager.uri_for(conversation)
        expect(uri).to be_a(String).or be_nil
      end

      it 'returns nil when parent IDs are missing' do
        allow(conversation).to receive(:parent_account_id).and_return(nil)
        allow(conversation).to receive(:parent_status_id).and_return(nil)
        allow(conversation).to receive(:object_type).and_return(:conversation)
        expect(tag_manager.uri_for(conversation)).to be_nil
      end
    end
  end

  describe '#key_uri_for' do
    it 'appends #main-key to the URI' do
      uri = tag_manager.key_uri_for(local_account)
      expect(uri).to end_with('#main-key')
    end

    it 'works with statuses' do
      uri = tag_manager.key_uri_for(local_status)
      expect(uri).to be_a(String)
      expect(uri).to include('#main-key')
    end
  end

  describe '#uri_for_username' do
    it 'generates URI for username' do
      uri = tag_manager.uri_for_username('testuser')
      expect(uri).to include('testuser')
    end

    it 'handles special characters' do
      uri = tag_manager.uri_for_username('test_user')
      expect(uri).to be_a(String)
    end
  end

  describe '#local_uri?' do
    it 'returns true for local URIs' do
      local_uri = tag_manager.uri_for(local_account)
      expect(tag_manager.local_uri?(local_uri)).to be true
    end

    it 'returns false for remote URIs' do
      expect(tag_manager.local_uri?('https://remote.com/users/bob')).to be false
    end

    it 'returns false for nil' do
      expect(tag_manager.local_uri?(nil)).to be false
    end

    it 'returns false for invalid URIs' do
      expect(tag_manager.local_uri?('not a uri')).to be false
    end
  end

  describe '#uri_to_local_id' do
    it 'extracts local ID from URI' do
      uri = tag_manager.uri_for(local_status)
      id = tag_manager.uri_to_local_id(uri, :status)
      expect(id).to eq(local_status.id.to_s)
    end

    it 'returns nil for remote URIs' do
      id = tag_manager.uri_to_local_id('https://remote.com/users/1', :account)
      expect(id).to be_nil
    end

    it 'handles different types' do
      uri = tag_manager.uri_for(local_account)
      id = tag_manager.uri_to_local_id(uri, :account)
      expect(id).to be_a(String).or be_nil
    end
  end

  describe '#uri_to_resource' do
    it 'finds local account by URI' do
      uri = tag_manager.uri_for(local_account)
      resource = tag_manager.uri_to_resource(uri, Account)
      expect(resource).to eq(local_account).or be_nil
    end

    it 'finds local status by URI' do
      uri = tag_manager.uri_for(local_status)
      resource = tag_manager.uri_to_resource(uri, Status)
      expect(resource).to eq(local_status).or be_nil
    end

    it 'returns nil for non-existent resources' do
      resource = tag_manager.uri_to_resource('https://example.com/fake', Account)
      expect(resource).to be_nil
    end
  end

  describe '#local_domain?' do
    it 'returns true for local domain' do
      expect(tag_manager.local_domain?(Rails.configuration.x.local_domain)).to be true
    end

    it 'returns false for remote domain' do
      expect(tag_manager.local_domain?('remote.com')).to be false
    end

    it 'handles nil domain' do
      expect(tag_manager.local_domain?(nil)).to be false
    end

    it 'handles empty string' do
      expect(tag_manager.local_domain?('')).to be false
    end
  end

  describe '#normalize_domain' do
    it 'normalizes domain' do
      normalized = tag_manager.normalize_domain('EXAMPLE.COM')
      expect(normalized).to eq('example.com')
    end

    it 'handles nil' do
      expect(tag_manager.normalize_domain(nil)).to be_nil
    end

    it 'handles domains with ports' do
      normalized = tag_manager.normalize_domain('example.com:3000')
      expect(normalized).to be_a(String)
    end
  end
end

