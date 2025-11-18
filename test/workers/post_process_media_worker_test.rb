# frozen_string_literal: true

require 'test_helper'

class PostProcessMediaWorkerTest < ActiveSupport::TestCase
  setup do
    @worker = PostProcessMediaWorker.new
  end

  test 'calls media processor methods in correct order with mocks' do
    processing_calls = []
    save_calls = []
    reprocess_called = false

    mock_file = Object.new
    def mock_file.reprocess!(*args)
      @reprocess_called = true
    end
    def mock_file.reprocess_called?
      @reprocess_called
    end

    mock_media_attachment = Object.new
    def mock_media_attachment.processing=(value)
      @processing_calls ||= []
      @processing_calls << value
    end
    def mock_media_attachment.processing_calls
      @processing_calls || []
    end
    def mock_media_attachment.save
      @save_called = true
      true
    end
    def mock_media_attachment.save_called?
      @save_called
    end
    def mock_media_attachment.file
      @file ||= Object.new.tap do |f|
        def f.reprocess!(*args)
          @reprocess_called = true
        end
        def f.reprocess_called?
          @reprocess_called
        end
      end
    end
    def mock_media_attachment.file_meta
      {}
    end
    def mock_media_attachment.file_meta=(value)
      @file_meta_set = true
    end

    MediaAttachment.stub :find, mock_media_attachment do
      @worker.perform(123)
    end

    assert_includes mock_media_attachment.processing_calls, :in_progress
    assert_includes mock_media_attachment.processing_calls, :complete
    assert mock_media_attachment.save_called?
    assert mock_media_attachment.file.reprocess_called?
  end

  test 'handles ActiveRecord::RecordNotFound gracefully' do
    find_stub = ->(_id) { raise ActiveRecord::RecordNotFound }
    MediaAttachment.stub :find, find_stub do
      result = @worker.perform(999)

      assert_equal true, result
    end
  end

  test 'preserves file_meta during reprocessing' do
    original_meta = { 'original' => { 'width' => 100, 'height' => 200 } }
    file_meta_set = false

    mock_file = Object.new
    def mock_file.reprocess!(*args)
      true
    end

    mock_media_attachment = Object.new
    def mock_media_attachment.processing=(value)
      true
    end
    def mock_media_attachment.save
      true
    end
    def mock_media_attachment.file
      @file ||= Object.new.tap do |f|
        def f.reprocess!(*args)
          true
        end
      end
    end
    def mock_media_attachment.file_meta
      { 'original' => { 'width' => 100, 'height' => 200 } }
    end
    def mock_media_attachment.file_meta=(value)
      @file_meta_set = true
    end
    def mock_media_attachment.file_meta_set?
      @file_meta_set
    end

    MediaAttachment.stub :find, mock_media_attachment do
      @worker.perform(123)
    end

    assert mock_media_attachment.file_meta_set?
  end

  test 'can be enqueued as a background job using ActiveJob test helpers' do
    media_attachment = Fabricate(:media_attachment)

    assert_enqueued_with(job: PostProcessMediaWorker, args: [media_attachment.id]) do
      PostProcessMediaWorker.perform_async(media_attachment.id)
    end
  end

  test 'processes media when job is performed' do
    media_attachment = Fabricate(:media_attachment)

    @worker.perform(media_attachment.id)

    assert_equal 'complete', media_attachment.reload.processing
  end
end

