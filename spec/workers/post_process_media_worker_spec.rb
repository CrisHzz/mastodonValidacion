# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PostProcessMediaWorker, :attachment_processing do
  let(:worker) { described_class.new }

  describe '#perform' do
    let(:media_attachment) { Fabricate(:media_attachment) }

    it 'reprocesses and updates the media attachment' do
      worker.perform(media_attachment.id)

      expect(media_attachment.processing).to eq('complete')
    end

    it 'returns true for non-existent record' do
      result = worker.perform(123_123_123)

      expect(result).to be(true)
    end

    context 'when sidekiq retries are exhausted' do
      it 'sets state to failed' do
        described_class.within_sidekiq_retries_exhausted_block({ 'args' => [media_attachment.id] }) do
          worker.perform(media_attachment.id)
        end

        expect(media_attachment.reload.processing).to eq('failed')
      end

      it 'returns true for non-existent record' do
        described_class.within_sidekiq_retries_exhausted_block({ 'args' => [123_123_123] }) do
          expect(worker.perform(123_123_123)).to be(true)
        end
      end
    end

    context 'with test doubles and mocks' do
      let(:mock_media_attachment) { instance_double(MediaAttachment) }

      before do
        allow(MediaAttachment).to receive(:find).and_return(mock_media_attachment)
        allow(mock_media_attachment).to receive(:processing=)
        allow(mock_media_attachment).to receive(:save)
        allow(mock_media_attachment).to receive(:file_meta=)
        allow(mock_media_attachment).to receive(:file).and_return(double(reprocess!: true))
        allow(mock_media_attachment).to receive(:file_meta).and_return({})
      end

      it 'calls media processor methods in correct order', :aggregate_failures do
        worker.perform(123)

        expect(MediaAttachment).to have_received(:find).with(123)
        expect(mock_media_attachment).to have_received(:processing=).with(:in_progress).ordered
        expect(mock_media_attachment).to have_received(:save).ordered
        expect(mock_media_attachment.file).to have_received(:reprocess!).with(:original).ordered
        expect(mock_media_attachment).to have_received(:processing=).with(:complete).ordered
        expect(mock_media_attachment).to have_received(:save).twice
      end

      it 'handles ActiveRecord::RecordNotFound gracefully', :aggregate_failures do
        allow(MediaAttachment).to receive(:find).and_raise(ActiveRecord::RecordNotFound)

        result = worker.perform(999)

        expect(result).to be(true)
      end

      it 'preserves file_meta during reprocessing', :aggregate_failures do
        original_meta = { 'original' => { 'width' => 100, 'height' => 200 } }
        allow(mock_media_attachment).to receive(:file_meta).and_return(original_meta)
        allow(mock_media_attachment).to receive(:file_meta=)

        worker.perform(123)

        expect(mock_media_attachment).to have_received(:file_meta=)
      end
    end

    context 'using ActiveJob test helpers' do
      it 'can be enqueued as a background job', :aggregate_failures do
        media_attachment = Fabricate(:media_attachment)

        expect do
          described_class.perform_async(media_attachment.id)
        end.to change(described_class.jobs, :size).by(1)
      end

      it 'processes media when job is performed', :aggregate_failures do
        media_attachment = Fabricate(:media_attachment)

        described_class.new.perform(media_attachment.id)

        expect(media_attachment.reload.processing).to eq('complete')
      end
    end
  end
end
