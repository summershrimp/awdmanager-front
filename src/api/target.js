import request from '@/utils/request'

export function listTarget(type) {
  return request({
    url: '/target/list',
    params: { game: type },
    method: 'get'
  })
}

export function addTarget(type, data) {
  return request({
    url: '/target/add',
    params: { game: type },
    method: 'post',
    data
  })
}

export function batchAdd(type, data) {
  return request({
    url: '/target/batch',
    params: { game: type },
    method: 'POST',
    data
  })
}

export function deleteTarget(data) {
  return request({
    url: '/target/delete',
    method: 'POST',
    data
  })
}
