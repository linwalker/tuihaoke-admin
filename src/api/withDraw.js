import request from '@/utils/request'

export function fetchWithDrawList(query) {
  return request({
    url: '/withdraw/list',
    method: 'get',
    params: query
  })
}
