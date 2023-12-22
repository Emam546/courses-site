/* eslint-disable @typescript-eslint/no-explicit-any */

import { initializeApp } from "firebase-admin/app";
import {
  getFirestore,
  CollectionReference,
  QueryDocumentSnapshot,
  DocumentSnapshot,
} from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

import { document } from "firebase-functions/v1/firestore";
import type { Change } from "firebase-functions/lib/common/change";
import type { ParamsOf } from "firebase-functions/lib/common/params";
import {
  EventContext,
  CloudFunction,
} from "firebase-functions/lib/v1/cloud-functions";
export const app = initializeApp();
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const storage=getStorage(app);

export function getCollectionReference<T extends keyof DataBase>(
  collectionPath: T,
): CollectionReference<DataBase[T]> {
  return firestore.collection(collectionPath) as CollectionReference<
    DataBase[T]
  >;
}
export interface DG<Path extends string, T> {
  /** Respond to all document writes (creates, updates, or deletes). */
  onWrite(
    handler: (
      change: Change<DocumentSnapshot<T>>,
      context: EventContext<ParamsOf<Path>>,
    ) => PromiseLike<any> | any,
  ): CloudFunction<Change<DocumentSnapshot<T>>>;
  /** Respond only to document updates. */
  onUpdate(
    handler: (
      change: Change<QueryDocumentSnapshot<T>>,
      context: EventContext<ParamsOf<Path>>,
    ) => PromiseLike<any> | any,
  ): CloudFunction<Change<QueryDocumentSnapshot<T>>>;
  /** Respond only to document creations. */
  onCreate(
    handler: (
      snapshot: QueryDocumentSnapshot<T>,
      context: EventContext<ParamsOf<Path>>,
    ) => PromiseLike<any> | any,
  ): CloudFunction<QueryDocumentSnapshot<T>>;
  /** Respond only to document deletions. */
  onDelete(
    handler: (
      snapshot: QueryDocumentSnapshot<T>,
      context: EventContext<ParamsOf<Path>>,
    ) => PromiseLike<any> | any,
  ): CloudFunction<QueryDocumentSnapshot<T>>;
}
export function getDocument<T extends keyof DataBase>(collectionPath: T) {
  return document(`${collectionPath}/{documentId}`) as unknown as DG<
    `${T}/{documentId}`,
    DataBase[T]
  >;
}
export function getCollection<T extends keyof DataBase>(collectionPath: T) {
  return firestore.collection(collectionPath) as CollectionReference<
    DataBase[T]
  >;
}
