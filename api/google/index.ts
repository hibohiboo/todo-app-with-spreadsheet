import { google } from 'googleapis'
import type { Todo, DataStorage as SpreadSheetStorage } from '@/types'
import _ from 'lodash'
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const sheets = google.sheets('v4')
const spreadsheetId = process.env.APPSETTING_SPREAD_SHEET_ID
const range = process.env.APPSETTING_SPREAD_SHEET_RANGE
const baseSheetId = 0

// functionsの環境変数から秘密鍵を読み込んだ時に、\が\\になってしまい鍵を認識しないので置換
const private_key = process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(
  '\\\\',
  '\\',
)

async function getAuth() {
  const auth = await google.auth.getClient({
    credentials: {
      client_email: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
      private_key,
    },
    scopes: SCOPES,
  })
  return auth
}

async function fetchAll(spreadsheetId: string, range: string) {
  const baseSheetName = 'Todo'

  const auth = await getAuth()
  const apiOptions = {
    auth,
    spreadsheetId,
    range: `${baseSheetName}!${range}`,
  }
  const res = await sheets.spreadsheets.values.get(apiOptions)
  if (!res.data.values) return []
  return res.data.values
}

async function fetchCompleted(isCompleted) {
  const completedSheetName = 'TodoCompleted'
  const uncompletedSheetName = 'TodoUncompleted'
  const sheetName = isCompleted ? completedSheetName : uncompletedSheetName

  const auth = await getAuth()
  const apiOptions = {
    auth,
    spreadsheetId,
    range: `${sheetName}!${range}`,
  }
  const res = await sheets.spreadsheets.values.get(apiOptions)
  if (!res.data.values) return []
  // console.log('fetchres', res.data)
  return res.data.values
}

export const execAPI = fetchAll

const convertSheetArrayToToDo = (arr: string[]): Todo => ({
  rowNumber: Number(arr[0]),
  id: arr[1],
  title: arr[2],
  completed: arr[3] === 'TRUE',
})

const exportsObj: SpreadSheetStorage<Todo> = {
  fetchAll: async () => {
    const list = await fetchAll(spreadsheetId, range)
    return list.map(convertSheetArrayToToDo)
  },
  fetchByCompleted: async (completed) => {
    return (await fetchCompleted(completed)).map(convertSheetArrayToToDo)
  },
  create: async (todo) => {
    const auth = await getAuth()
    const values = _.values(todo)
    // APIを呼び出して、行の追加処理
    const req = {
      auth,
      // シートのID
      spreadsheetId: spreadsheetId,
      // A1に追記することを指定
      range: 'A1',
      // 追記する形式を指定。
      valueInputOption: 'USER_ENTERED',
      // A1に値があったら下方向に空欄を探しにいく
      insertDataOption: 'INSERT_ROWS',
      // 追加する行のデータ。2次元配列で指定
      resource: {
        values: [['', ...values]],
      },
    }
    await sheets.spreadsheets.values.append(req)
    // console.log('crated', todo)
  },
  update: async (rowNumber, update) => {
    const auth = await getAuth()
    // const values = _.values(todo)
    // // APIを呼び出して、行の追加処理
    // const req = {
    //   auth,
    //   // シートのID
    //   spreadsheetId: spreadsheetId,
    //   // A1に追記することを指定
    //   range: 'A1',
    //   // 追記する形式を指定。
    //   valueInputOption: 'USER_ENTERED',
    //   // A1に値があったら下方向に空欄を探しにいく
    //   insertDataOption: 'INSERT_ROWS',
    //   // 追加する行のデータ。2次元配列で指定
    //   resource: {
    //     values: [['', ...values]],
    //   },
    // }
    // await sheets.spreadsheets.values.update(req)
    return { rowNumber, id: '', title: '', completed: false }
  },
  remove: async (rowNumber) => {
    // console.log('remove', rowNumber)
    const auth = await getAuth()
    const req = {
      auth,
      spreadsheetId: spreadsheetId,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: baseSheetId,
                dimension: 'ROWS',
                startIndex: rowNumber,
                endIndex: rowNumber + 1,
              },
            },
          },
        ],
      },
    }
    const result = await sheets.spreadsheets.batchUpdate(req)
    // console.log('removed', result)
    return rowNumber
  },
}
export default exportsObj
