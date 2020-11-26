import request from '@/utils/request'

export function listGame() {
  return request({
    url: '/game/list',
    method: 'get'
  })
}

export function addGame(data) {
  return request({
    url: '/game/add',
    method: 'post',
    data
  })
}

export function deleteGame(data) {
  return request({
    url: '/game/delete',
    method: 'post',
    data
  })
}
