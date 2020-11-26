import request from '@/utils/request'

export function fetchAttackList(query) {
  return request({
    url: '/attack/list',
    method: 'get',
    params: query
  })
}
