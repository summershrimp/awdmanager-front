import request from '@/utils/request'

export function listShells() {
  return request({
    url: '/shell/list',
    method: 'get'
  })
}

export function executeCommand(data) {
  return request({
    url: '/shell/execute',
    method: 'post',
    data
  })
}

export function disconnectShell(data) {
  return request({
    url: '/shell/disconnect',
    method: 'post',
    data
  })
}

export function batchCommand(data) {
  return request({
    url: '/shell/batch',
    method: 'post',
    data
  })
}

