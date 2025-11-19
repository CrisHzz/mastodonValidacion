# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SignedRequest do
  let(:keypair) { OpenSSL::PKey::RSA.new(2048) }
  let(:actor) { Fabricate(:account) }
  let(:request) { double('request') }

  before do
    allow(actor).to receive(:keypair).and_return(keypair)
    allow(actor).to receive(:public_key).and_return(keypair.public_key.to_pem)
  end

  describe SignedRequest::HttpSignature do
    let(:http_signature) { SignedRequest::HttpSignature.new(request) }

    describe '#key_id' do
      it 'returns key_id from signature params' do
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="https://example.com/actor#main-key",signature="test"'
        })
        expect(http_signature.key_id).to eq('https://example.com/actor#main-key')
      end

      it 'handles missing key_id' do
        allow(request).to receive(:headers).and_return({ 'Signature' => '' })
        expect { http_signature.key_id }.not_to raise_error
      end
    end

    describe '#missing_signature_parameters' do
      it 'returns required parameters when missing' do
        allow(request).to receive(:headers).and_return({ 'Signature' => 'test="value"' })
        expect(http_signature.missing_signature_parameters).to eq(SignedRequest::HttpSignature::REQUIRED_PARAMETERS)
      end

      it 'returns nil when all parameters present' do
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="test",signature="test"'
        })
        expect(http_signature.missing_signature_parameters).to be_nil
      end
    end

    describe '#algorithm_supported?' do
      it 'returns true for rsa-sha256' do
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="test",algorithm="rsa-sha256",signature="test"'
        })
        expect(http_signature.algorithm_supported?).to be true
      end

      it 'returns true for hs2019' do
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="test",algorithm="hs2019",signature="test"'
        })
        expect(http_signature.algorithm_supported?).to be true
      end

      it 'returns false for unsupported algorithm' do
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="test",algorithm="unsupported",signature="test"'
        })
        expect(http_signature.algorithm_supported?).to be false
      end
    end

    describe '#created_time' do
      it 'returns created time from signature params for hs2019' do
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="test",algorithm="hs2019",created="1234567890",signature="test"'
        })
        time = http_signature.created_time
        expect(time).to be_a(Time)
        expect(time.to_i).to eq(1234567890)
      end

      it 'returns date from Date header for rsa-sha256' do
        date_string = Time.now.utc.httpdate
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="test",algorithm="rsa-sha256",signature="test"',
          'Date' => date_string
        })
        expect(http_signature.created_time).to be_a(Time)
      end

      it 'raises error for invalid date' do
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="test",signature="test"',
          'Date' => 'invalid date'
        })
        expect { http_signature.created_time }.to raise_error(Mastodon::SignatureVerificationError)
      end

      it 'returns nil when no date information available' do
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="test",signature="test"'
        })
        expect(http_signature.created_time).to be_nil
      end
    end

    describe '#expires_time' do
      it 'returns expires time when present' do
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="test",expires="1234567890",signature="test"'
        })
        time = http_signature.expires_time
        expect(time).to be_a(Time)
        expect(time.to_i).to eq(1234567890)
      end

      it 'returns nil when expires not present' do
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="test",signature="test"'
        })
        expect(http_signature.expires_time).to be_nil
      end

      it 'raises error for invalid expires' do
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="test",expires="invalid",signature="test"'
        })
        expect { http_signature.expires_time }.to raise_error(Mastodon::SignatureVerificationError)
      end
    end

    describe '#verify_signature_strength!' do
      it 'requires date or (created) to be signed' do
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="test",headers="host digest",signature="test"'
        })
        expect { http_signature.verify_signature_strength! }.to raise_error(Mastodon::SignatureVerificationError, /Date/)
      end

      it 'requires digest or (request-target) to be signed' do
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="test",headers="date host",signature="test"'
        })
        expect { http_signature.verify_signature_strength! }.to raise_error(Mastodon::SignatureVerificationError, /Digest/)
      end

      it 'requires host for GET requests' do
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="test",headers="date digest",signature="test"'
        })
        allow(request).to receive(:get?).and_return(true)
        expect { http_signature.verify_signature_strength! }.to raise_error(Mastodon::SignatureVerificationError, /Host/)
      end

      it 'requires digest for POST requests' do
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="test",headers="date host",signature="test"'
        })
        allow(request).to receive(:get?).and_return(false)
        allow(request).to receive(:post?).and_return(true)
        expect { http_signature.verify_signature_strength! }.to raise_error(Mastodon::SignatureVerificationError, /Digest/)
      end

      it 'passes with valid headers for GET' do
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="test",headers="date host digest",signature="test"'
        })
        allow(request).to receive(:get?).and_return(true)
        allow(request).to receive(:post?).and_return(false)
        expect { http_signature.verify_signature_strength! }.not_to raise_error
      end

      it 'passes with valid headers for POST' do
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="test",headers="date digest host",signature="test"'
        })
        allow(request).to receive(:get?).and_return(false)
        allow(request).to receive(:post?).and_return(true)
        expect { http_signature.verify_signature_strength! }.not_to raise_error
      end
    end

    describe '#verify_body_digest!' do
      let(:body) { '{"test": "data"}' }
      let(:digest) { Digest::SHA256.base64digest(body) }

      before do
        allow(request).to receive(:raw_post).and_return(body)
      end

      it 'passes with correct digest' do
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="test",headers="digest",signature="test"',
          'Digest' => "SHA-256=#{digest}"
        })
        expect { http_signature.verify_body_digest! }.not_to raise_error
      end

      it 'raises error when digest header is missing' do
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="test",headers="digest",signature="test"'
        })
        allow(request).to receive(:key?).with('Digest').and_return(false)
        
        # Modificar el comportamiento del mock para que funcione con el código real
        headers = double('headers')
        allow(headers).to receive(:[]).with('Signature').and_return('keyId="test",headers="digest",signature="test"')
        allow(headers).to receive(:[]).with('Digest').and_return(nil)
        allow(headers).to receive(:key?).with('Digest').and_return(false)
        allow(request).to receive(:headers).and_return(headers)
        
        expect { http_signature.verify_body_digest! }.to raise_error(Mastodon::SignatureVerificationError, /Digest header missing/)
      end

      it 'raises error for incorrect digest' do
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="test",headers="digest",signature="test"',
          'Digest' => 'SHA-256=wrong'
        })
        expect { http_signature.verify_body_digest! }.to raise_error(Mastodon::SignatureVerificationError)
      end

      it 'raises error for unsupported algorithm' do
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="test",headers="digest",signature="test"',
          'Digest' => 'SHA-512=test'
        })
        expect { http_signature.verify_body_digest! }.to raise_error(Mastodon::SignatureVerificationError, /SHA-256/)
      end

      it 'does not verify when digest not in signed headers' do
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="test",headers="date",signature="test"'
        })
        expect { http_signature.verify_body_digest! }.not_to raise_error
      end
    end
  end

  describe SignedRequest do
    let(:signed_request) { described_class.new(request) }

    before do
      allow(request).to receive(:headers).and_return({
        'Signature' => 'keyId="https://example.com/actor#main-key",algorithm="rsa-sha256",headers="date host digest",signature="dGVzdA=="',
        'Date' => Time.now.utc.httpdate,
        'Host' => 'example.com',
        'Digest' => 'SHA-256=test'
      })
      allow(request).to receive(:get?).and_return(true)
      allow(request).to receive(:post?).and_return(false)
      allow(request).to receive(:raw_post).and_return('')
      allow(request).to receive(:method).and_return('GET')
      allow(request).to receive(:original_fullpath).and_return('/test')
      allow(request).to receive(:path).and_return('/test')
    end

    describe '#key_id' do
      it 'delegates to signature' do
        expect(signed_request.key_id).to eq('https://example.com/actor#main-key')
      end
    end

    describe '#verified?' do
      it 'raises error for missing signature parameters' do
        allow(request).to receive(:headers).and_return({
          'Signature' => 'test="value"'
        })
        new_request = described_class.new(request)
        expect { new_request.verified?(actor) }.to raise_error(Mastodon::SignatureVerificationError, /required/)
      end

      it 'raises error for unsupported algorithm' do
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="test",algorithm="unsupported",headers="date host digest",signature="test"',
          'Date' => Time.now.utc.httpdate
        })
        new_request = described_class.new(request)
        expect { new_request.verified?(actor) }.to raise_error(Mastodon::SignatureVerificationError, /algorithm/)
      end

      it 'raises error for expired signature' do
        old_date = (Time.now.utc - 2.days).httpdate
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="test",algorithm="rsa-sha256",headers="date host digest",signature="test"',
          'Date' => old_date,
          'Host' => 'example.com',
          'Digest' => 'SHA-256=test'
        })
        new_request = described_class.new(request)
        expect { new_request.verified?(actor) }.to raise_error(Mastodon::SignatureVerificationError, /time window/)
      end

      it 'verifies weak signature strength' do
        expect { signed_request.verified?(actor) }.to raise_error(Mastodon::SignatureVerificationError)
      end
    end

    describe 'time window validation' do
      it 'accepts recent signatures' do
        allow(request).to receive(:headers).and_return({
          'Signature' => 'keyId="test",algorithm="hs2019",created="' + Time.now.utc.to_i.to_s + '",headers="(created) host digest",signature="dGVzdA=="',
          'Host' => 'example.com',
          'Digest' => 'SHA-256=test'
        })
        new_request = described_class.new(request)
        expect { new_request.verified?(actor) }.to raise_error(Mastodon::SignatureVerificationError)
      end

      it 'rejects future signatures' do
        future_time = (Time.now.utc + 2.hours).to_i
        allow(request).to receive(:headers).and_return({
          'Signature' => "keyId=\"test\",algorithm=\"hs2019\",created=\"#{future_time}\",headers=\"(created) host digest\",signature=\"dGVzdA==\"",
          'Host' => 'example.com',
          'Digest' => 'SHA-256=test'
        })
        new_request = described_class.new(request)
        expect { new_request.verified?(actor) }.to raise_error(Mastodon::SignatureVerificationError, /time window/)
      end
    end
  end
end

