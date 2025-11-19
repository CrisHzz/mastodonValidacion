# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Form::Import do
  let(:account) { Fabricate(:account) }
  let(:csv_data) { attachment_fixture('import.txt') }

  describe 'validations' do
    subject { described_class.new(current_account: account) }

    it { is_expected.to validate_presence_of(:type) }
    it { is_expected.to validate_presence_of(:data) }
  end

  describe '#guessed_type' do
    subject { described_class.new(current_account: account, data: csv_data) }

    context 'with following CSV headers' do
      let(:csv_data) { double(original_filename: 'follows.csv', read: 'Account address,Show boosts') }

      it 'guesses following type' do
        expect(subject.guessed_type).to eq(:following)
      end
    end

    context 'with muting CSV headers' do
      let(:csv_data) { double(original_filename: 'mutes.csv', read: 'Account address,Hide notifications') }

      it 'guesses muting type' do
        expect(subject.guessed_type).to eq(:muting)
      end
    end

    context 'with blocking CSV headers' do
      let(:csv_data) { double(original_filename: 'blocks.csv', read: 'Account address') }

      it 'guesses blocking type' do
        expect(subject.guessed_type).to eq(:blocking)
      end
    end

    context 'with domain blocking CSV headers' do
      let(:csv_data) { double(original_filename: 'domains.csv', read: '#domain') }

      it 'guesses domain_blocking type' do
        expect(subject.guessed_type).to eq(:domain_blocking)
      end
    end

    context 'with bookmarks CSV headers' do
      let(:csv_data) { double(original_filename: 'bookmarks.csv', read: '#uri') }

      it 'guesses bookmarks type' do
        expect(subject.guessed_type).to eq(:bookmarks)
      end
    end

    context 'with lists CSV headers' do
      let(:csv_data) { double(original_filename: 'lists.csv', read: 'List name,Account address') }

      it 'guesses lists type' do
        expect(subject.guessed_type).to eq(:lists)
      end
    end
  end

  describe '#likely_type' do
    subject { described_class.new(current_account: account, data: csv_data) }

    it 'returns guessed type' do
      allow(subject).to receive(:guessed_type).and_return(:following)
      expect(subject.likely_type).to eq(:following)
    end
  end

  describe 'MODES' do
    it 'includes merge mode' do
      expect(described_class::MODES).to include(:merge)
    end

    it 'includes overwrite mode' do
      expect(described_class::MODES).to include(:overwrite)
    end
  end

  describe 'FILE_SIZE_LIMIT' do
    it 'is set to 20 megabytes' do
      expect(described_class::FILE_SIZE_LIMIT).to eq(20.megabytes)
    end
  end

  describe 'ROWS_PROCESSING_LIMIT' do
    it 'is set to 20000' do
      expect(described_class::ROWS_PROCESSING_LIMIT).to eq(20_000)
    end
  end

  describe '#overwrite?' do
    subject { described_class.new(current_account: account, overwrite: overwrite) }

    context 'when overwrite is true' do
      let(:overwrite) { true }

      it 'returns true' do
        expect(subject.overwrite?).to be true
      end
    end

    context 'when overwrite is false' do
      let(:overwrite) { false }

      it 'returns false' do
        expect(subject.overwrite?).to be false
      end
    end
  end

  describe '#mode' do
    subject { described_class.new(current_account: account, overwrite: overwrite) }

    context 'when overwrite is true' do
      let(:overwrite) { true }

      it 'returns overwrite mode' do
        expect(subject.mode).to eq(:overwrite)
      end
    end

    context 'when overwrite is false' do
      let(:overwrite) { false }

      it 'returns merge mode' do
        expect(subject.mode).to eq(:merge)
      end
    end
  end
end

