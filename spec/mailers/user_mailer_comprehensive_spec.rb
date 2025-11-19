# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UserMailer do
  let(:user) { Fabricate(:user, confirmed_at: nil, locale: :en) }

  describe '#confirmation_instructions' do
    let(:token) { 'fake-token' }
    let(:mail) { described_class.confirmation_instructions(user, token) }

    it 'renders the subject' do
      expect(mail.subject).to be_present
    end

    it 'renders the receiver email' do
      expect(mail.to).to include(user.email)
    end

    it 'renders the sender email' do
      expect(mail.from).to be_present
    end

    it 'includes the token in the body' do
      expect(mail.body.encoded).to include(token)
    end

    context 'with pending reconfirmation' do
      let(:user) { Fabricate(:user, confirmed_at: Time.zone.now, unconfirmed_email: 'new@example.com') }

      it 'sends to unconfirmed email' do
        expect(mail.to).to include('new@example.com')
      end
    end
  end

  describe '#reset_password_instructions' do
    let(:user) { Fabricate(:user) }
    let(:token) { 'fake-token' }
    let(:mail) { described_class.reset_password_instructions(user, token) }

    it 'renders the subject' do
      expect(mail.subject).to be_present
    end

    it 'renders the receiver email' do
      expect(mail.to).to include(user.email)
    end

    it 'includes the token in the body' do
      expect(mail.body.encoded).to include(token)
    end

    it 'uses user locale' do
      user.update(locale: :es)
      expect(I18n).to receive(:with_locale).with(:es)
      described_class.reset_password_instructions(user, token)
    end
  end

  describe '#password_change' do
    let(:user) { Fabricate(:user) }
    let(:mail) { described_class.password_change(user) }

    it 'renders the subject' do
      expect(mail.subject).to be_present
    end

    it 'renders the receiver email' do
      expect(mail.to).to include(user.email)
    end

    it 'renders the sender email' do
      expect(mail.from).to be_present
    end
  end

  describe '#email_changed' do
    let(:user) { Fabricate(:user) }
    let(:mail) { described_class.email_changed(user) }

    it 'renders the subject' do
      expect(mail.subject).to be_present
    end

    it 'renders the receiver email' do
      expect(mail.to).to include(user.email)
    end
  end

  describe '#two_factor_enabled' do
    let(:user) { Fabricate(:user) }
    let(:mail) { described_class.two_factor_enabled(user) }

    it 'renders the subject' do
      expect(mail.subject).to be_present
    end

    it 'renders the receiver email' do
      expect(mail.to).to include(user.email)
    end
  end

  describe '#two_factor_disabled' do
    let(:user) { Fabricate(:user) }
    let(:mail) { described_class.two_factor_disabled(user) }

    it 'renders the subject' do
      expect(mail.subject).to be_present
    end

    it 'renders the receiver email' do
      expect(mail.to).to include(user.email)
    end
  end

  describe '#two_factor_recovery_codes_changed' do
    let(:user) { Fabricate(:user) }
    let(:mail) { described_class.two_factor_recovery_codes_changed(user) }

    it 'renders the subject' do
      expect(mail.subject).to be_present
    end

    it 'renders the receiver email' do
      expect(mail.to).to include(user.email)
    end
  end

  describe '#webauthn_enabled' do
    let(:user) { Fabricate(:user) }
    let(:mail) { described_class.webauthn_enabled(user) }

    it 'renders the subject' do
      expect(mail.subject).to be_present
    end

    it 'renders the receiver email' do
      expect(mail.to).to include(user.email)
    end
  end

  describe '#webauthn_disabled' do
    let(:user) { Fabricate(:user) }
    let(:mail) { described_class.webauthn_disabled(user) }

    it 'renders the subject' do
      expect(mail.subject).to be_present
    end

    it 'renders the receiver email' do
      expect(mail.to).to include(user.email)
    end
  end

  describe '#backup_ready' do
    let(:user) { Fabricate(:user) }
    let(:backup) { Fabricate(:backup, user: user) }
    let(:mail) { described_class.backup_ready(user, backup) }

    it 'renders the subject' do
      expect(mail.subject).to be_present
    end

    it 'renders the receiver email' do
      expect(mail.to).to include(user.email)
    end
  end

  describe '#warning' do
    let(:user) { Fabricate(:user) }
    let(:warning) { Fabricate(:account_warning, target_account: user.account, text: 'Test warning') }
    let(:mail) { described_class.warning(user, warning) }

    it 'renders the subject' do
      expect(mail.subject).to be_present
    end

    it 'renders the receiver email' do
      expect(mail.to).to include(user.email)
    end

    it 'includes warning text in body' do
      expect(mail.body.encoded).to include('Test warning')
    end
  end

  describe '#sign_in_token' do
    let(:user) { Fabricate(:user) }
    let(:remote_ip) { '192.168.1.1' }
    let(:user_agent) { 'Mozilla/5.0' }
    let(:timestamp) { Time.zone.now }
    let(:mail) { described_class.sign_in_token(user, remote_ip, user_agent, timestamp) }

    it 'renders the subject' do
      expect(mail.subject).to be_present
    end

    it 'renders the receiver email' do
      expect(mail.to).to include(user.email)
    end

    it 'includes IP address in body' do
      expect(mail.body.encoded).to include(remote_ip)
    end
  end

  describe '#appeal_approved' do
    let(:user) { Fabricate(:user) }
    let(:appeal) { Fabricate(:appeal, account: user.account) }
    let(:mail) { described_class.appeal_approved(user, appeal) }

    it 'renders the subject' do
      expect(mail.subject).to be_present
    end

    it 'renders the receiver email' do
      expect(mail.to).to include(user.email)
    end
  end

  describe '#appeal_rejected' do
    let(:user) { Fabricate(:user) }
    let(:appeal) { Fabricate(:appeal, account: user.account) }
    let(:mail) { described_class.appeal_rejected(user, appeal) }

    it 'renders the subject' do
      expect(mail.subject).to be_present
    end

    it 'renders the receiver email' do
      expect(mail.to).to include(user.email)
    end
  end
end

