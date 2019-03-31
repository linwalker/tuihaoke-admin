import request from '@/utils/request'

export function fetchClassList(query) {
  return request({
    url: '/class/list',
    method: 'get',
    params: query
  })
}

