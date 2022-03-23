import { mande, defaults } from 'mande'

// 全局默认配置
// defaults.headers.Authorization = ''

// http://game.wsmud.com/UserAPI/Login
export const login = (username: string, password: string) => {
  return mande('/').post('UserAPI/Login', null, {
    body: `code=${ username }&pwd=${ password }`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
  })
}

// http://game.wsmud.com/Game/GetServer
export const servers = () => {
  return mande('/').get('Game/GetServer')
}
