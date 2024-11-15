import { X } from 'lucide-react';
import { GraphModulesModalProps } from './types/discoverType';
import { Progress } from '@/components/ui/progress';
import { ModuleCard } from '@/components/GraphModuleCard';

export function ModulesModal({
  isOpen,
  onClose,
  topic,
  userWalletAddress,
}: GraphModulesModalProps) {
  if (!isOpen || !topic) return null;

  if (!topic.modules) return null;

  let completedModules = 0;
  topic.modules.map((module) => {
    const feedbacks = module?.feedbacks; // Safely access feedbacks
    console.log(module, feedbacks?.length);

    if (
      feedbacks &&
      feedbacks.length > 0 &&
      feedbacks[0].currentPage === module.totalPages
    ) {
      completedModules += 1;
    }
  });

  const totalModules = topic.modules?.length;
  const progress = (completedModules / totalModules) * 100;
  const isEligibleForStakeReturn = completedModules >= 3;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{topic.title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Modules Completed: {completedModules}/{totalModules}
            </span>
            <span
              className={`text-sm font-medium ${isEligibleForStakeReturn ? 'text-green-600' : 'text-red-600'}`}
            >
              {isEligibleForStakeReturn
                ? 'Eligible for stake return'
                : 'Not eligible for stake return'}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <div className="space-y-4">
          {topic.modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              userWalletAddress={userWalletAddress}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
