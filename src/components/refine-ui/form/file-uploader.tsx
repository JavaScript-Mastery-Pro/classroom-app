import React, { useState } from 'react';
import { User, Upload, AlertCircle } from 'lucide-react';
import { convertFileToUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FileUploaderProps } from '@/types';
import { ALLOWED_TYPES, MAX_FILE_SIZE } from '@/constants';

export const FileUploader = ({
  files,
  onChange,
  type = 'profile',
  maxSizeText = 'PNG, JPG up to 3MB',
  currentImageUrl,
}: FileUploaderProps) => {
  const [error, setError] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please upload PNG, JPG, or WEBP images only');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 3MB');
      return;
    }

    setError('');
    onChange([file]);
  };

  const handleRemove = () => {
    onChange([]);
    setError('');
  };

  const previewUrl =
    files && files.length > 0 ? convertFileToUrl(files[0]) : currentImageUrl;
  const isProfile = type === 'profile';

  // Profile photo layout - banner style horizontal layout
  if (isProfile) {
    return (
      <>
        {previewUrl ? (
          <div className='relative w-full rounded-xl border-2 border-orange-600/20 bg-gradient-to-r from-orange-50/50 to-orange-100/30 p-5'>
            <div className='flex flex-col sm:flex-row items-center gap-4'>
              <div className='relative flex-shrink-0'>
                <img
                  src={previewUrl}
                  alt='Profile preview'
                  className='w-24 h-24 sm:w-26 sm:h-26 transition-all rounded-full object-cover border-3 border-orange-600 shadow-lg'
                />
              </div>

              <div className='flex-1 text-center sm:text-left'>
                <p className='text-sm font-bold text-gray-900'>Profile photo</p>
                <p className='text-xs text-gray-900/60 mt-1'>
                  Upload a clear photo of yourself.
                </p>
              </div>
              <div className='flex-shrink-0'>
                <Button
                  type='button'
                  variant='destructive'
                  size='sm'
                  onClick={handleRemove}
                  className='shadow-md hover:shadow-lg transition-all cursor-pointer'
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <section className='relative w-full rounded-xl overflow-hidden border-2 border-dashed border-gray-200 bg-orange-50/40 hover:border-orange-400 hover:bg-orange-50/30 transition-all duration-300 cursor-pointer'>
            <input
              id={`file-upload-${type}`}
              type='file'
              accept='image/*'
              onChange={handleFileChange}
              className='hidden'
            />
            <label
              htmlFor={`file-upload-${type}`}
              className='cursor-pointer block'
            >
              <div className='flex flex-col sm:flex-row items-center gap-4 p-5'>
                <div className='flex-shrink-0'>
                  <div className='w-24 h-24 sm:w-26 sm:h-26 rounded-full bg-orange-100 flex items-center justify-center'>
                    <User className='h-10 w-10 text-orange-600' />
                  </div>
                </div>
                <div className='flex-1 text-center sm:text-left'>
                  <p className='text-sm font-bold text-orange-600 mb-1'>
                    Click to upload photo
                  </p>
                  <p className='text-xs text-gray-900/60'>{maxSizeText}</p>
                </div>
              </div>
            </label>
          </section>
        )}
        {error && (
          <div className='flex items-center gap-2 mt-3 p-3 rounded-lg bg-red-50 border border-red-200'>
            <AlertCircle className='h-4 w-4 text-red-600 flex-shrink-0' />
            <p className='text-sm text-red-600'>{error}</p>
          </div>
        )}
      </>
    );
  }

  // Banner photo layout
  return (
    <>
      {previewUrl ? (
        <section className='relative w-full'>
          <img
            src={previewUrl}
            alt='Banner preview'
            className='w-full h-48 rounded-lg object-cover shadow-lg'
          />

          <Button
            type='button'
            variant='destructive'
            size='sm'
            onClick={handleRemove}
            className='absolute top-2 right-2 shadow-md'
          >
            Remove
          </Button>
        </section>
      ) : (
        <section className='flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 cursor-pointer hover:border-orange-400 hover:bg-orange-50/50 transition-all duration-300'>
          <input
            id={`file-upload-${type}`}
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            className='hidden'
          />
          <label
            htmlFor={`file-upload-${type}`}
            className='cursor-pointer text-center w-full'
          >
            <Upload className='h-12 w-12 mx-auto mb-3 text-orange-600' />
            <p className='text-sm font-bold text-gray-900 mb-1'>
              <span className='text-orange-600'>Click to upload</span> or drag
              and drop
            </p>
            <p className='text-xs text-gray-900/60'>{maxSizeText}</p>
          </label>
        </section>
      )}
      {error && (
        <div className='flex items-center gap-2 mt-3 p-3 rounded-lg bg-red-50 border border-red-200'>
          <AlertCircle className='h-4 w-4 text-red-600 flex-shrink-0' />
          <p className='text-sm text-red-600'>{error}</p>
        </div>
      )}
    </>
  );
};
