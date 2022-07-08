import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// must define this above the `useAxios` import, otherwise the ReferenceError is raised.
const mockGetFn = jest.fn();

import { useAxios } from './';

jest.mock('axios', () => ({
  get: mockGetFn,
  post: mockGetFn,
}));

describe('useAxios', () => {
  const response = { data: [{ id: '1', name: 'test' }] };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return isError in false if post request is ok', async () => {
    mockGetFn.mockResolvedValueOnce({ data: {}, headers: {} } as never);
    const { isError, exec } = useAxios({
      url: 'test',
      method: 'post',
      data: response.data[0],
    });

    await exec();

    expect(isError.value).toBeFalsy();
  });

  it('should fail request when error is occured', async () => {
    mockGetFn.mockRejectedValueOnce('Error');
    const { isError, exec } = useAxios({
      url: 'test',
      method: 'get',
    });

    await exec();

    expect(isError.value).toBeTruthy();
  });

  it('should return list data when get request with page params is ok', async () => {
    mockGetFn.mockResolvedValueOnce({
      data: response.data,
      headers: {
        'x-total-count': '1',
      },
    } as never);
    const { data, count, exec } = useAxios({
      url: 'test',
      method: 'get',
      config: {
        params: {
          _page: 1,
          _limit: 5,
          _sort: 'name',
          _order: 'desc',
        },
      },
    });

    await exec();

    expect(data?.value).toEqual(response.data);
    expect(count?.value).toBe(1);
  });
});
