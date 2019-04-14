import request from '@/utils/request'

export function fetchWithDrawList(query) {
  return request({
    url: '/op/qxy/withdraw/list',
    method: 'get',
    params: query
  })
}

export function updateWithDrawStatus(id) {
  return request({
    url: '/op/qxy/withdraw/confirm',
    method: 'post',
    params: {
      withdrawId: id
    }
  })
}
