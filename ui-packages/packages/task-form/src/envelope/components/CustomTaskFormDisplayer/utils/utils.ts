/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import cloneDeep from 'lodash/cloneDeep';
import unset from 'lodash/unset';
import { TaskFormSchema } from '../../../../types';
import { User } from '../../../../api';
import { UserTaskInstance } from '@kogito-apps/task-console-shared';

export function buildTaskFormContext(
  userTask: UserTaskInstance,
  schema: TaskFormSchema,
  user: User
): Record<string, any> {
  const ctxSchema = cloneDeep(schema);

  const ctxPhases = ctxSchema.phases;

  unset(ctxSchema, 'phases');

  const ctxTask = cloneDeep(userTask);

  unset(ctxTask, 'actualOwner');
  unset(ctxTask, 'adminGroups');
  unset(ctxTask, 'adminUsers');
  unset(ctxTask, 'excludedUsers');
  unset(ctxTask, 'potentialGroups');
  unset(ctxTask, 'potentialUsers');
  unset(ctxTask, 'inputs');
  unset(ctxTask, 'outputs');
  unset(ctxTask, 'endpoint');

  return {
    user: user,
    task: ctxTask,
    schema: ctxSchema,
    phases: ctxPhases
  };
}
