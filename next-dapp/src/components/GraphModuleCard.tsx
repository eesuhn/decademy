import Image from 'next/image';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Book, Users } from 'lucide-react';
import {
  ModuleCardProps,
  GraphModuleCardProps,
} from '@/components/types/discoverType';

export function ModuleCard({
  module,
  showEducatorName = true,
  showBadge = true,
  userWalletAddress,
}: GraphModuleCardProps) {
  // need address in learnerInvolved
  let status = "Haven't started";

  // loop through module.learnerInvolved and find matching igccd

  if (
    module?.learnerInvolved?.some(
      (learner) => learner.id?.toLowerCase() === userWalletAddress
    )
  ) {
    status = 'On-going';
  }
  if (
    module.feedbacks &&
    module.feedbacks.length > 0 &&
    module?.feedbacks[0].currentPage === module.totalPages
  ) {
    status = 'Completed';
  }
  console.log('something', module.learnerInvolved);
  return (
    <Card className="flex overflow-hidden">
      <CardContent className="flex-grow p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <CardTitle className="text-lg mb-1">{module.title}</CardTitle>
            <p className="text-sm text-gray-600">{module.description}</p>
          </div>
          {showBadge && (
            <Badge
              variant={
                status === 'Completed'
                  ? 'default'
                  : status === 'On-going'
                    ? 'secondary'
                    : 'outline'
              }
            >
              {status}
            </Badge>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {showEducatorName && <p>Educator: {module?.educator?.user?.name}</p>}
          <div className="flex justify-between mt-2">
            <span>
              <Users className="w-4 h-4 inline mr-1" />
              {module?.learnerInvolved?.length} Learners
            </span>
            <span>
              <Book className="w-4 h-4 inline mr-1" />
              {module?.totalPages} Pages
            </span>
          </div>
        </div>
      </CardContent>
      <div className="w-1/4 relative">
        <Image
          src={'/' + module.moduleIMG}
          alt={module.title}
          layout="fill"
          objectFit="cover"
        />
      </div>
    </Card>
  );
}
