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
  if (!res.data || !res.data.values) return []
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

async function fetch(rowNumber): Promise<null | string[]> {
  const auth = await getAuth()
  const request = {
    spreadsheetId,
    resource: {
      dataFilters: [
        {
          gridRange: {
            sheetId: baseSheetId,
            startRowIndex: rowNumber,
            endRowIndex: rowNumber + 1,
          },
        },
      ],
    },
    auth,
  }
  try {
    const response = (
      await sheets.spreadsheets.values.batchGetByDataFilter(request)
    ).data
    console.log(`${rowNumber} response`, response)
    if (!response.valueRanges || response.valueRanges.length === 0) return null

    return response.valueRanges[0].valueRange.values[0]
  } catch (err) {
    console.error(err)
    return null
  }
}

async function remove(start: number, end: number) {
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
              startIndex: start,
              endIndex: end,
            },
          },
        },
      ],
    },
  }
  // const result =
  await sheets.spreadsheets.batchUpdate(req)
  // console.log('removed', result)
  return start
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
    const arr = await fetch(rowNumber)
    console.log(`update fetch ${rowNumber}`, arr)
    if (!arr) return null
    const todo = convertSheetArrayToToDo(arr)
    const updatedTodo = { ...todo, ...update }
    const values = _.values(updatedTodo)
    const [a, ...updateValues] = values

    const request = {
      spreadsheetId,
      resource: {
        valueInputOption: 'USER_ENTERED',
        data: [
          {
            dataFilter: {
              gridRange: {
                sheetId: 0,
                startRowIndex: rowNumber,
                endRowIndex: rowNumber + 1,
                startColumnIndex: 1,
                endColumnIndex: 4,
              },
            },
            values: [updateValues],
            majorDimension: 'ROWS',
          },
        ],
      },
      auth,
    }

    try {
      const response = (
        await sheets.spreadsheets.values.batchUpdateByDataFilter(request)
      ).data
      console.log('updated', response)
      if (response.totalUpdatedRows !== 1) return null
    } catch (err) {
      console.error(err)
    }
    return updatedTodo
  },
  remove: async (rowNumber) => await remove(rowNumber, rowNumber + 1),
}
export default exportsObj
export const removeRange = async (start, end) => await remove(start, end)
