import request from '@/utils/request'

export function fetchClassList(query) {
  return request({
    url: '/op/qxy/enroll/list',
    method: 'get',
    params: query
  })
}

export function updateClassStatus(id) {
  return request({
    url: '/op/qxy/enroll/class/confirm',
    method: 'post',
    params: {
      enrollId: id
    }
  })
}
