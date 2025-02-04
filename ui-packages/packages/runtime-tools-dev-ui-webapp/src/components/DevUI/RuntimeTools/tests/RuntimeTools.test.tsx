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

import { mount } from 'enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import RuntimeTools from '../RuntimeTools';

jest.mock('apollo-link-http');
jest.mock('../../DevUILayout/DevUILayout');
describe('Runtime Tools tests', () => {
  it('Snapshot tests with default props', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']} keyLength={0}>
        <RuntimeTools
          users={[{ id: 'John snow', groups: ['admin'] }]}
          dataIndex={'http:localhost:4000'}
          navigate="JobsManagement"
        />
      </MemoryRouter>
    );

    expect(wrapper.find('RuntimeTools')).toMatchSnapshot();
  });
});
