'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { GrayButtonHover } from '@/components/ui/GrayButtonHover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import { usePicsumImage } from '@/hooks/usePicsumImage';
import { useSubmitTopic } from '@/hooks/useSubmitTopic';

interface FormValues {
  title: string;
  description: string;
}

export default function SuggestTopicForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { picsumImage, isImageLoading } = usePicsumImage();
  const { submitTopic } = useSubmitTopic();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);

    try {
      await submitTopic(values.title, values.description, picsumImage || '');
      setIsLoading(false);
      toast({
        title: 'Submission successful',
        description: 'Your topic has been suggested.',
      });
      router.push('/discover-new');
    } catch (error) {
      console.error('Error submitting topic:', error);
      toast({
        title: 'Submission failed',
        description: 'There was an error submitting your topic.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-12 bg-white rounded-lg shadow-xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Suggest a Topic</h1>
        <p className="text-muted-foreground text-lg">
          Contribute a valid topic.
        </p>
      </div>

      <div className="grid gap-14 md:grid-cols-2">
        <div>
          {isImageLoading ? (
            <p className="text-center">Loading image...</p>
          ) : picsumImage ? (
            <img
              src={picsumImage}
              alt="Random Picsum Image"
              className="w-full max-h-50 max-w-50 object-cover rounded-lg"
            />
          ) : (
            <p className="text-center">No image available</p>
          )}
        </div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-lg font-medium">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Enter topic title"
                className="p-2 text-base"
                {...register('title')}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-lg font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Provide a brief description"
                className="p-2 text-base"
                {...register('description')}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="flex justify-center">
              <GrayButtonHover
                type="submit"
                disabled={isLoading}
                className="px-10 py-3 text-lg"
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </GrayButtonHover>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
