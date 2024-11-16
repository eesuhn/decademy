import Image from 'next/image';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Book, Users } from 'lucide-react';
import { GraphModuleCardProps } from '@/components/types/discoverType';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEmitAddUserToModule } from '@/hooks/useEmitAddUserToModule';

export function ModuleCard({
  module,
  showEducatorName = true,
  showBadge = true,
  userWalletAddress,
}: GraphModuleCardProps) {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const { emitAddUserToModule } = useEmitAddUserToModule();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    // Calculate mouse position relative to card center
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const handleClick = async () => {
    if (!module || !module.id || !module.totalPages) {
      console.log('Module is not available or has incomplete data');
      return;
    }

    try {
      const result = await emitAddUserToModule(parseInt(module.id, 16));
      if (result === true) {
        // Store module info in sessionStorage before navigation
        sessionStorage.setItem('currentModuleId', module.id.toString());
        sessionStorage.setItem(
          'modulePageAmount',
          module.totalPages.toString()
        );
        router.push('/module-content');
      } else {
        console.log('Module is not available');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

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
    <Card
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        flex overflow-hidden cursor-pointer
        transition-all duration-200 ease-out
        hover:shadow-xl
        transform-gpu
        ${isHovering ? 'scale-[1.02]' : ''}
      `}
      style={{
        transform: isHovering
          ? `
              perspective(1000px)
              rotateX(${mousePosition.y * -3}deg)
              rotateY(${mousePosition.x * 3}deg)
              translateZ(10px)
            `
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
      }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-200 pointer-events-none"
        style={{
          opacity: isHovering ? 0.1 : 0,
        }}
      />
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
          className="transition-transform duration-200"
        />
      </div>
    </Card>
  );
}
