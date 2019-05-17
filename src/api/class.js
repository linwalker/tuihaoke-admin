import request from '@/utils/request'

export function fetchClassList(query) {
  return request({
    url: '/op/qxy/enroll/list',
    method: 'get',
    params: query
  })
}

export function updateClassStatusSuccess(id) {
  return request({
    url: '/op/qxy/enroll/class/confirm',
    method: 'post',
    params: {
      enrollId: id
    }
  })
}

export function updateClassStatusFailure(enrollId, reason) {
  return request({
    url: '/op/qxy/enroll/class/confirm',
    method: 'post',
    params: {
      enrollId,
      reason
    }
  })
}

export function cancel(enrollId) {
  return request({
    url: '/op/qxy/enroll/class/rollback',
    method: 'post',
    params: {
      enrollId
    }
  })
}
