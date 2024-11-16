import { BigInt, log } from '@graphprotocol/graph-ts';

// Import events
import {
  createUser as createUserEvent,
  createEducator as createEducatorEvent,
  createModule as createModuleEvent,
  createTopic as createTopicEvent,
  learnerJoinTopic as learnerJoinTopicEvent,
  learnerJoinModule as learnerJoinModuleEvent,
  updateLearnerProgress as updateLearnerProgressEvent,
  updateWorldIdStatus as updateWorldIdStatusEvent,
  updateTopicAttestationStatus as updateTopicAttestationStatusEvent,
} from '../generated/GraphTest/GraphTest';

// Import schema tables
import {
  User,
  Learner,
  Educator,
  Topic,
  Module,
  LearnerProgress,
} from '../generated/schema';

export function handleCreateUser(event: createUserEvent): void {
  const userId = event.params.userWalletAddr.toHexString();
  let user = User.load(userId);
  if (user === null) {
    log.info('User not found, Creating new User: {}', [userId]);
    user = new User(userId);
  }

  let learnerData = Learner.load(userId);
  if (learnerData === null) {
    log.info('Learner not found, Creating new Learner: {}', [userId]);
    learnerData = new Learner(userId);
  }

  user.name = event.params.name;
  user.socialLinks = event.params.socials;
  user.isVerified = event.params.isVerified;
  user.learnerData = learnerData.id;
  user.save();

  learnerData.user = user.id;
  learnerData.topicsJoined = [];
  learnerData.modulesJoined = [];
  learnerData.save();
}

export function handleCreateEducator(event: createEducatorEvent): void {
  const userId = event.params.userWalletAddr.toHexString();
  let user = User.load(userId);
  if (user === null) {
    log.error('Error: User not found in CreateEducator: userWalletAddr: {}', [
      userId,
    ]);
    return;
  }

  let educator = Educator.load(userId);
  if (educator === null) {
    log.info('Educator not found, Creating new Educator: {}', [userId]);
    educator = new Educator(userId);
  }

  user.educatorData = educator.id;
  user.save();

  educator.user = user.id;
  educator.topicsJoined = [];
  educator.save();
}

export function handleCreateTopic(event: createTopicEvent): void {
  const topicId = event.params.topicId.toHexString();
  let topic = Topic.load(topicId);

  if (topic === null) {
    log.info('Topic not found, Creating new Topic: {}', [topicId]);
    topic = new Topic(topicId);
  }

  topic.title = event.params.title;
  topic.learnerInvolved = BigInt.fromI32(0);
  topic.description = event.params.description;
  topic.topicIMG = event.params.topicIMG;
  topic.attested = event.params.isAttested;

  topic.save();
}

export function handleCreateModule(event: createModuleEvent): void {
  const educatorId = event.params.eduWalletAddr.toHexString();
  let educator = Educator.load(educatorId);
  if (educator === null) {
    log.error('Error: Educator not found in CreateModule: educatorId: {}', [
      educatorId,
    ]);
    return;
  }

  const topicId = event.params.topicId.toHexString();
  let topic = Topic.load(topicId);
  if (topic === null) {
    log.error('Error: Topic not found in CreateModule: topicId: {}', [topicId]);
    return;
  }

  const moduleId = event.params.moduleId.toHexString();
  let entity = Module.load(moduleId);
  if (entity === null) {
    log.info('Module not found, Creating new Module: {}', [moduleId]);
    entity = new Module(moduleId);
  }

  entity.educator = educator.id;
  entity.topic = topic.id;
  // need to do this way to add stuff into array
  let temp = educator.topicsJoined;
  temp.push(topicId);
  educator.topicsJoined = temp;
  educator.save();

  entity.title = event.params.title;
  entity.totalPages = event.params.pageAmount.toI32();
  entity.description = event.params.description;
  entity.moduleIMG = event.params.moduleIMG;
  entity.save();
}

export function handleLearnerJoinTopic(event: learnerJoinTopicEvent): void {
  const topicId = event.params.topicId.toHexString();
  let topic = Topic.load(topicId);
  if (topic === null) {
    log.error('Error: Topic not found in LearnerJoinTopic: topicId: {}', [
      topicId,
    ]);
    return;
  }

  const learnerId = event.params.userWalletAddr.toHexString();
  let learner = Learner.load(learnerId);
  if (learner === null) {
    log.error('Error: Learner not found in LearnerJoinTopic: learnerId: {}', [
      learnerId,
    ]);
    return;
  }

  let temp = learner.topicsJoined;
  temp.push(topic.id);
  learner.topicsJoined = temp;
  learner.save();

  topic.learnerInvolved = BigInt.fromI32(1 + topic.learnerInvolved.toI32());
  topic.save();
}

export function handleLearnerJoinModule(event: learnerJoinModuleEvent): void {
  const userId = event.params.userWalletAddr.toHexString();
  let learnerData = Learner.load(userId);
  if (learnerData === null) {
    log.error('Error: Learner not found in LearnerJoinModule: learnerId: {}', [
      userId,
    ]);
    return;
  }

  const moduleId = event.params.moduleId.toHexString();
  let entity = Module.load(moduleId);
  if (entity === null) {
    log.error('Error: Module not found in learnerJoinModule: moduleId: {}', [
      moduleId,
    ]);
    return;
  }

  const learnerProgressId = userId + '-' + moduleId;
  let learnerProgress = LearnerProgress.load(learnerProgressId);
  if (learnerProgress == null) {
    log.info('LearnerProgress not found, Creating new LearnerProgress: {}', [
      learnerProgressId,
    ]);
    learnerProgress = new LearnerProgress(learnerProgressId);
    learnerProgress.learner = userId;
    learnerProgress.module = entity.id;
    learnerProgress.topic = entity.topic;
    learnerProgress.currentPage = 0;
    learnerProgress.rating = 0;
    learnerProgress.save();
  }

  let temp = learnerData.modulesJoined;
  temp.push(entity.id);
  learnerData.modulesJoined = temp;
  learnerData.save();
}

export function handleUpdateLearnerProgress(
  event: updateLearnerProgressEvent
): void {
  const userWalletAddr = event.params.userWalletAddr.toHexString();
  const moduleId = event.params.moduleId.toHexString();

  const learnerProgressId = userWalletAddr + '-' + moduleId;
  let learnerProgress = LearnerProgress.load(learnerProgressId);
  if (learnerProgress === null) {
    log.error(
      'Error: learnerProgress not found in UpdateLearnerProgress: learnerProgressId: {}',
      [learnerProgressId]
    );
    return;
  }

  learnerProgress.rating = event.params.rating.toI32();
  learnerProgress.currentPage = event.params.pageAmount.toI32();
  learnerProgress.save();
}

export function handleUpdateWorldIdStatus(
  event: updateWorldIdStatusEvent
): void {
  const userId = event.params.walletAddr.toHexString();
  let user = User.load(userId);
  if (user === null) {
    log.error('Error: User not found in UpdateWorldIdStatus: userId: {}', [
      userId,
    ]);
    return;
  }

  user.isVerified = true;
  user.save();
}

export function handleUpdateTopicAttestationStatus(
  event: updateTopicAttestationStatusEvent
): void {
  const topicId = event.params.topicId.toHexString();
  let topic = Topic.load(topicId);
  if (topic === null) {
    log.error(
      'Error: Topic not found in UpdateTopicAttestationStatus: topicId: {}',
      [topicId]
    );
    return;
  }

  topic.attested = event.params.isAttested;
  topic.save();
}
