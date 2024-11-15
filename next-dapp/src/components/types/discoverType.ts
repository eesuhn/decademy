// Define the Topic interface
export interface Topic {
  id?: number;
  title?: string;
  description?: string;
  topicIMG?: string;
  poolAmount?: number;
  modules?: Module[];
  learners?: number;
}

export interface GraphTopic {
  id?: string;
  learnerInvolved?: string;
  title?: string;
  topicIMG?: string;
  description?: string;
  modules?: GraphModule[];
}

export interface GraphModule {
  id?: string;
  title: string;
  moduleIMG?: string;
  totalPages?: number;
  description?: string;
  educator?: GraphEducator;
  learnerInvolved?: GraphLearner[];
  feedbacks?: GraphLearnerProgress[];
}

export interface GraphEducator {
  user?: GraphUser;
}

export interface GraphUser {
  id?: string;
  name?: string;
  socialLinks?: string;
  isVerified?: boolean;
  educatorData?: GraphEducator;
  learnerData?: GraphLearner;
}

export interface GraphLearner {
  id?: string;
  user?: GraphUser;
  topicsJoined?: GraphTopic[];
  progress?: GraphLearnerProgress[];
}

export interface GraphLearnerProgress {
  id?: string;
  currentPage?: number;
}

export interface GraphModulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: GraphTopic | null;
  userWalletAddress?: string;
}

export interface GraphModuleCardProps {
  module: GraphModule;
  showEducatorName?: boolean;
  showBadge?: boolean;
  userWalletAddress?: string;
}

export interface GraphTopicCardProps {
  topic: GraphTopic;
  onClick: () => void;
}

export interface TopicCardProps {
  topic: Topic;
  onClick: () => void;
}

export interface ModulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: Topic | null;
}

// Define the Module interface
export interface Module {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  educatorName: string;
  learners: number;
  pages: number;
  status: 'Not Started' | 'On-going' | 'Completed';
}

export interface ModuleCardProps {
  module: Module;
  showEducatorName?: boolean;
  showBadge?: boolean;
}
