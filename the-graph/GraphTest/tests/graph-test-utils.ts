import { newMockEvent } from 'matchstick-as';
import { ethereum, Address, BigInt } from '@graphprotocol/graph-ts';
import {
  addUserToModule,
  addUserToTopic,
  createEducator,
  createLearner,
  createLearnerProgress,
  createModule,
  createTopic,
  createUser,
  updateLearnerProgress,
  updateLearnerProgressRating,
} from '../generated/GraphTest/GraphTest';

export function createaddUserToModuleEvent(
  userWalletAddr: Address,
  moduleId: BigInt
): addUserToModule {
  let addUserToModuleEvent = changetype<addUserToModule>(newMockEvent());

  addUserToModuleEvent.parameters = new Array();

  addUserToModuleEvent.parameters.push(
    new ethereum.EventParam(
      'userWalletAddr',
      ethereum.Value.fromAddress(userWalletAddr)
    )
  );
  addUserToModuleEvent.parameters.push(
    new ethereum.EventParam(
      'moduleId',
      ethereum.Value.fromUnsignedBigInt(moduleId)
    )
  );

  return addUserToModuleEvent;
}

export function createaddUserToTopicEvent(
  userWalletAddr: Address,
  topicId: BigInt
): addUserToTopic {
  let addUserToTopicEvent = changetype<addUserToTopic>(newMockEvent());

  addUserToTopicEvent.parameters = new Array();

  addUserToTopicEvent.parameters.push(
    new ethereum.EventParam(
      'userWalletAddr',
      ethereum.Value.fromAddress(userWalletAddr)
    )
  );
  addUserToTopicEvent.parameters.push(
    new ethereum.EventParam(
      'topicId',
      ethereum.Value.fromUnsignedBigInt(topicId)
    )
  );

  return addUserToTopicEvent;
}

export function createcreateEducatorEvent(
  userWalletAddr: Address
): createEducator {
  let createEducatorEvent = changetype<createEducator>(newMockEvent());

  createEducatorEvent.parameters = new Array();

  createEducatorEvent.parameters.push(
    new ethereum.EventParam(
      'userWalletAddr',
      ethereum.Value.fromAddress(userWalletAddr)
    )
  );

  return createEducatorEvent;
}

export function createcreateLearnerEvent(
  userWalletAddr: Address
): createLearner {
  let createLearnerEvent = changetype<createLearner>(newMockEvent());

  createLearnerEvent.parameters = new Array();

  createLearnerEvent.parameters.push(
    new ethereum.EventParam(
      'userWalletAddr',
      ethereum.Value.fromAddress(userWalletAddr)
    )
  );

  return createLearnerEvent;
}

export function createcreateLearnerProgressEvent(
  userWalletAddr: Address,
  moduleId: BigInt,
  currentPage: BigInt,
  rating: BigInt
): createLearnerProgress {
  let createLearnerProgressEvent =
    changetype<createLearnerProgress>(newMockEvent());

  createLearnerProgressEvent.parameters = new Array();

  createLearnerProgressEvent.parameters.push(
    new ethereum.EventParam(
      'userWalletAddr',
      ethereum.Value.fromAddress(userWalletAddr)
    )
  );
  createLearnerProgressEvent.parameters.push(
    new ethereum.EventParam(
      'moduleId',
      ethereum.Value.fromUnsignedBigInt(moduleId)
    )
  );
  createLearnerProgressEvent.parameters.push(
    new ethereum.EventParam(
      'currentPage',
      ethereum.Value.fromUnsignedBigInt(currentPage)
    )
  );
  createLearnerProgressEvent.parameters.push(
    new ethereum.EventParam('rating', ethereum.Value.fromUnsignedBigInt(rating))
  );

  return createLearnerProgressEvent;
}

export function createcreateModuleEvent(
  moduleId: BigInt,
  topicId: BigInt,
  eduWalletAddr: Address,
  totalPages: BigInt,
  title: string,
  description: string,
  moduleIMG: string
): createModule {
  let createModuleEvent = changetype<createModule>(newMockEvent());

  createModuleEvent.parameters = new Array();

  createModuleEvent.parameters.push(
    new ethereum.EventParam(
      'moduleId',
      ethereum.Value.fromUnsignedBigInt(moduleId)
    )
  );
  createModuleEvent.parameters.push(
    new ethereum.EventParam(
      'topicId',
      ethereum.Value.fromUnsignedBigInt(topicId)
    )
  );
  createModuleEvent.parameters.push(
    new ethereum.EventParam(
      'eduWalletAddr',
      ethereum.Value.fromAddress(eduWalletAddr)
    )
  );
  createModuleEvent.parameters.push(
    new ethereum.EventParam(
      'totalPages',
      ethereum.Value.fromUnsignedBigInt(totalPages)
    )
  );
  createModuleEvent.parameters.push(
    new ethereum.EventParam('title', ethereum.Value.fromString(title))
  );
  createModuleEvent.parameters.push(
    new ethereum.EventParam(
      'description',
      ethereum.Value.fromString(description)
    )
  );
  createModuleEvent.parameters.push(
    new ethereum.EventParam('moduleIMG', ethereum.Value.fromString(moduleIMG))
  );

  return createModuleEvent;
}

export function createcreateTopicEvent(
  topicId: BigInt,
  title: string,
  description: string,
  topicIMG: string
): createTopic {
  let createTopicEvent = changetype<createTopic>(newMockEvent());

  createTopicEvent.parameters = new Array();

  createTopicEvent.parameters.push(
    new ethereum.EventParam(
      'topicId',
      ethereum.Value.fromUnsignedBigInt(topicId)
    )
  );
  createTopicEvent.parameters.push(
    new ethereum.EventParam('title', ethereum.Value.fromString(title))
  );
  createTopicEvent.parameters.push(
    new ethereum.EventParam(
      'description',
      ethereum.Value.fromString(description)
    )
  );
  createTopicEvent.parameters.push(
    new ethereum.EventParam('topicIMG', ethereum.Value.fromString(topicIMG))
  );

  return createTopicEvent;
}

export function createcreateUserEvent(
  userWalletAddr: Address,
  name: string,
  socials: Array<string>,
  isVerified: boolean
): createUser {
  let createUserEvent = changetype<createUser>(newMockEvent());

  createUserEvent.parameters = new Array();

  createUserEvent.parameters.push(
    new ethereum.EventParam(
      'userWalletAddr',
      ethereum.Value.fromAddress(userWalletAddr)
    )
  );
  createUserEvent.parameters.push(
    new ethereum.EventParam('name', ethereum.Value.fromString(name))
  );
  createUserEvent.parameters.push(
    new ethereum.EventParam('socials', ethereum.Value.fromStringArray(socials))
  );
  createUserEvent.parameters.push(
    new ethereum.EventParam(
      'isVerified',
      ethereum.Value.fromBoolean(isVerified)
    )
  );

  return createUserEvent;
}

export function createupdateLearnerProgressEvent(
  userWalletAddr: Address,
  pageAmount: BigInt
): updateLearnerProgress {
  let updateLearnerProgressEvent =
    changetype<updateLearnerProgress>(newMockEvent());

  updateLearnerProgressEvent.parameters = new Array();

  updateLearnerProgressEvent.parameters.push(
    new ethereum.EventParam(
      'userWalletAddr',
      ethereum.Value.fromAddress(userWalletAddr)
    )
  );
  updateLearnerProgressEvent.parameters.push(
    new ethereum.EventParam(
      'pageAmount',
      ethereum.Value.fromUnsignedBigInt(pageAmount)
    )
  );

  return updateLearnerProgressEvent;
}

export function createupdateLearnerProgressRatingEvent(
  userWalletAddr: Address,
  rating: BigInt
): updateLearnerProgressRating {
  let updateLearnerProgressRatingEvent =
    changetype<updateLearnerProgressRating>(newMockEvent());

  updateLearnerProgressRatingEvent.parameters = new Array();

  updateLearnerProgressRatingEvent.parameters.push(
    new ethereum.EventParam(
      'userWalletAddr',
      ethereum.Value.fromAddress(userWalletAddr)
    )
  );
  updateLearnerProgressRatingEvent.parameters.push(
    new ethereum.EventParam('rating', ethereum.Value.fromUnsignedBigInt(rating))
  );

  return updateLearnerProgressRatingEvent;
}
